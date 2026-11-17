import { db } from '../db/connection';

export const RequestRepository = {
  /**
   * Query event_requests joined with organizations and venues
   */
  findAll(filters: { status?: string; date?: string; search?: string; sort?: string } = {}) {
    const allRows = db
      .query(
        `
        SELECT
          r.id,
          r.request_code,
          r.event_id,
          r.title,
          r.description,
          o.name AS organizer,
          o.coordinator_name AS coordinator,
          o.contact_email AS email,
          r.submitted_date,
          r.submitted_time,
          r.event_date,
          r.event_time,
          v.name AS venue,
          r.capacity,
          r.hours,
          r.pdf_name,
          r.pdf_pages,
          r.pdf_size,
          r.status,
          r.admin_note,
          r.check_doc,
          r.check_info,
          r.check_venue,
          r.image
        FROM event_requests r
        INNER JOIN organizations o ON o.id = r.organization_id
        INNER JOIN venues v ON v.id = r.venue_id
        ORDER BY r.rowid DESC
      `
      )
      .all() as any[];

    const counts = {
      pending: allRows.filter((r) => r.status === 'รอตรวจสอบ').length,
      approved: allRows.filter((r) => r.status === 'อนุมัติแล้ว').length,
      returned: allRows.filter((r) => r.status === 'ส่งกลับแก้ไข').length,
      total: allRows.length,
    };

    let filtered = [...allRows];
    if (filters.status && filters.status !== 'ทั้งหมด') {
      filtered = filtered.filter((r) => r.status === filters.status);
    }
    if (filters.date && filters.date !== 'ทั้งหมด') {
      filtered = filtered.filter((r) => r.submitted_date === filters.date);
    }
    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.trim().toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.organizer.toLowerCase().includes(q) ||
          r.request_code.toLowerCase().includes(q)
      );
    }
    if (filters.sort === 'ส่งเก่าสุดก่อน') {
      filtered.reverse();
    }

    return { counts, requests: filtered };
  },

  findByIdOrCode(idOrCode: string) {
    const { requests } = this.findAll();
    return requests.find((r) => r.id === idOrCode || r.request_code === idOrCode) || null;
  },

  review(
    id: string,
    payload: {
      status?: string;
      admin_note?: string;
      check_doc?: boolean;
      check_info?: boolean;
      check_venue?: boolean;
    }
  ) {
    const existing = this.findByIdOrCode(id);
    if (!existing) return null;

    const nextStatus = payload.status ?? existing.status;
    const nextNote = payload.admin_note ?? existing.admin_note;
    const checkDoc = payload.check_doc !== undefined ? (payload.check_doc ? 1 : 0) : existing.check_doc;
    const checkInfo = payload.check_info !== undefined ? (payload.check_info ? 1 : 0) : existing.check_info;
    const checkVenue = payload.check_venue !== undefined ? (payload.check_venue ? 1 : 0) : existing.check_venue;

    db.run(
      `UPDATE event_requests
       SET status = ?, admin_note = ?, check_doc = ?, check_info = ?, check_venue = ?
       WHERE id = ?`,
      [nextStatus, nextNote, checkDoc, checkInfo, checkVenue, existing.id]
    );

    if (nextStatus === 'อนุมัติแล้ว' && existing.event_id) {
      db.run('UPDATE events SET status = ?, organizer_status = ? WHERE id = ?', [
        'เปิดแล้ว',
        'กำลังดำเนินการ...',
        existing.event_id,
      ]);
    } else if (nextStatus === 'ส่งกลับแก้ไข' && existing.event_id) {
      db.run('UPDATE events SET organizer_status = ? WHERE id = ?', [
        'ส่งกลับแก้ไข',
        existing.event_id,
      ]);
    }

    return this.findByIdOrCode(existing.id);
  },
};
