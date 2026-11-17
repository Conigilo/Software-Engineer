import { db } from '../db/connection';

const DEFAULT_SLOT_DATE = '18 พฤศจิกายน 2569';

export const VenueRepository = {
  /**
   * Query venues joined with normalized `venue_time_slots` rows
   */
  findAll(filters: { status?: string; search?: string; date?: string } = {}) {
    const targetDate = filters.date || DEFAULT_SLOT_DATE;
    const venues = db.query('SELECT * FROM venues').all() as any[];

    const slotStmt = db.prepare(`
      SELECT slot_key, slot_label, status, slot_date
      FROM venue_time_slots
      WHERE venue_id = ? AND slot_date = ?
    `);

    let enriched = venues.map((v) => {
      let slots = slotStmt.all(v.id, targetDate) as Array<{
        slot_key: string;
        slot_label: string;
        status: string;
        slot_date: string;
      }>;
      if (slots.length === 0) {
        slots = slotStmt.all(v.id, DEFAULT_SLOT_DATE) as any[];
      }

      const morning = slots.find((s) => s.slot_key === 'morning')?.status || 'ว่าง';
      const afternoon = slots.find((s) => s.slot_key === 'afternoon')?.status || 'ว่าง';
      const evening = slots.find((s) => s.slot_key === 'evening')?.status || 'ว่าง';

      const freeCount = [morning, afternoon, evening].filter((s) => s === 'ว่าง').length;
      let status = 'ว่างบางส่วน';
      let availableWindow = '08 : 00 - 12 : 00';
      if (freeCount === 3) {
        status = 'ว่าง';
        availableWindow = 'ทั้งวัน';
      } else if (freeCount === 0) {
        status = 'ไม่ว่าง';
        availableWindow = 'ไม่ว่าง';
      } else {
        status = 'ว่างบางส่วน';
        if (morning === 'ว่าง' && afternoon === 'ว่าง') availableWindow = '08 : 00 - 16 : 00';
        else if (morning === 'ว่าง') availableWindow = '08 : 00 - 12 : 00';
        else if (afternoon === 'ว่าง') availableWindow = '12 : 00 - 16 : 00';
        else availableWindow = '16 : 00 - 20 : 00';
      }

      return {
        ...v,
        status,
        available_window: availableWindow,
        slot_morning: morning,
        slot_afternoon: afternoon,
        slot_evening: evening,
        updated_date: targetDate,
        slots,
      };
    });

    if (filters.status && filters.status !== 'ทั้งหมด') {
      enriched = enriched.filter((v) => v.status === filters.status);
    }
    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.trim().toLowerCase();
      enriched = enriched.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.code.toLowerCase().includes(q) ||
          v.full_name.toLowerCase().includes(q)
      );
    }

    return enriched;
  },

  findByIdOrCode(idOrCode: string) {
    const all = this.findAll();
    return all.find((v) => v.id === idOrCode || v.code === idOrCode) || null;
  },

  updateSlots(
    venueId: string,
    payload: {
      slot_morning?: string;
      slot_afternoon?: string;
      slot_evening?: string;
      updated_date?: string;
      image?: string;
    }
  ) {
    const existing = this.findByIdOrCode(venueId);
    if (!existing) return null;

    const slotDate = payload.updated_date || DEFAULT_SLOT_DATE;

    const upsertSlot = db.prepare(`
      INSERT INTO venue_time_slots (id, venue_id, slot_date, slot_key, slot_label, status)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(venue_id, slot_date, slot_key) DO UPDATE SET status = excluded.status
    `);

    if (payload.slot_morning) {
      upsertSlot.run(
        `slot-${venueId}-${slotDate}-m`,
        venueId,
        slotDate,
        'morning',
        '08:00 – 12:00 น.',
        payload.slot_morning
      );
    }
    if (payload.slot_afternoon) {
      upsertSlot.run(
        `slot-${venueId}-${slotDate}-a`,
        venueId,
        slotDate,
        'afternoon',
        '12:00 – 16:00 น.',
        payload.slot_afternoon
      );
    }
    if (payload.slot_evening) {
      upsertSlot.run(
        `slot-${venueId}-${slotDate}-e`,
        venueId,
        slotDate,
        'evening',
        '16:00 – 20:00 น.',
        payload.slot_evening
      );
    }

    if (payload.image) {
      db.run('UPDATE venues SET image = ? WHERE id = ?', [payload.image, venueId]);
    }

    return this.findByIdOrCode(venueId);
  },
};
