import { db } from '../db/connection';

const CURRENT_USER_ID = 'u-1';

export interface EventQueryFilter {
  status?: string;
  myStatus?: string;
  favorite?: string;
  registered?: string;
  category?: string;
  search?: string;
  sortBy?: string;
}

export const EventRepository = {
  /**
   * Query events using relational SQL JOINs across:
   * - events
   * - venues
   * - organizations
   * - event_registrations
   * - event_favorites
   * - event_categories + categories
   */
  findAll(filters: EventQueryFilter = {}) {
    const baseRows = db
      .query(
        `
        SELECT
          e.id,
          e.title,
          e.description,
          e.event_date AS date,
          (e.start_time || ' – ' || e.end_time || ' น.') AS time_range,
          e.start_time,
          e.end_time,
          v.code AS venue_code,
          v.name AS venue_name,
          v.full_name AS venue_full,
          v.image AS venue_image,
          o.name AS organization,
          (e.base_participants + (
            SELECT COUNT(*) FROM event_registrations er WHERE er.event_id = e.id
          )) AS current_participants,
          e.max_participants,
          e.hours,
          e.status,
          e.organizer_status,
          ur.participation_status AS my_event_status,
          e.cover_image AS image,
          e.qr_image,
          CASE WHEN uf.event_id IS NOT NULL THEN 1 ELSE 0 END AS is_favorite,
          CASE WHEN ur.id IS NOT NULL THEN 1 ELSE 0 END AS is_registered,
          e.created_at
        FROM events e
        INNER JOIN venues v ON v.id = e.venue_id
        INNER JOIN organizations o ON o.id = e.organization_id
        LEFT JOIN event_registrations ur
          ON ur.event_id = e.id AND ur.user_id = ?
        LEFT JOIN event_favorites uf
          ON uf.event_id = e.id AND uf.user_id = ?
      `
      )
      .all(CURRENT_USER_ID, CURRENT_USER_ID) as any[];

    // Query category tags via relational JOIN on event_categories -> categories
    const catStmt = db.prepare(`
      SELECT c.name
      FROM event_categories ec
      INNER JOIN categories c ON c.id = ec.category_id
      WHERE ec.event_id = ?
    `);

    let results = baseRows.map((row) => {
      const catRows = catStmt.all(row.id) as Array<{ name: string }>;
      return {
        ...row,
        tags: catRows.map((c) => c.name),
        is_favorite: Boolean(row.is_favorite),
        is_registered: Boolean(row.is_registered),
      };
    });

    if (filters.status && filters.status !== 'ทั้งหมด') {
      results = results.filter((e) => e.status === filters.status);
    }
    if (filters.myStatus && filters.myStatus !== 'ทั้งหมด') {
      results = results.filter((e) => e.my_event_status === filters.myStatus);
    }
    if (filters.favorite === 'true') {
      results = results.filter((e) => e.is_favorite);
    }
    if (filters.registered === 'true') {
      results = results.filter((e) => e.is_registered);
    }
    if (filters.category && filters.category !== 'ทั้งหมด') {
      results = results.filter((e) => e.tags.includes(filters.category!));
    }
    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.trim().toLowerCase();
      results = results.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.venue_full.toLowerCase().includes(q) ||
          e.organization.toLowerCase().includes(q)
      );
    }

    if (filters.sortBy === 'จำนวนผู้เข้าร่วม') {
      results.sort((a, b) => b.current_participants - a.current_participants);
    } else if (filters.sortBy === 'จำนวนชั่วโมงกิจกรรม') {
      results.sort((a, b) => b.hours - a.hours);
    }

    return results;
  },

  findById(id: string) {
    const all = this.findAll();
    return all.find((e) => e.id === id) || null;
  },

  create(payload: {
    title: string;
    organization: string;
    description: string;
    date?: string;
    start_time?: string;
    end_time?: string;
    venue_full?: string;
    max_participants?: number;
    hours?: number;
    tags?: string[];
    image?: string;
    pdf_name?: string;
  }) {
    const eventId = `ev-${Date.now()}`;
    const orgName = payload.organization.trim();

    // Find or insert organization in organizations table
    let orgRow = db.query('SELECT id FROM organizations WHERE name = ?').get(orgName) as { id: string } | null;
    if (!orgRow) {
      const newOrgId = `org-${Date.now()}`;
      db.run(
        'INSERT INTO organizations (id, name, coordinator_name, contact_email) VALUES (?, ?, ?, ?)',
        [newOrgId, orgName, 'ปภาวรินท์ ลาภอนันต์', 'pp.asd@kmutt.ac.th']
      );
      orgRow = { id: newOrgId };
    }

    // Match venue from venues table
    const venueCodeHint = (payload.venue_full || 'N10').split(':')[0].trim();
    const venueRow =
      (db
        .query('SELECT id, name FROM venues WHERE code = ? OR full_name = ? OR name = ?')
        .get(venueCodeHint, payload.venue_full || '', payload.venue_full || '') as { id: string; name: string } | null) ||
      (db.query('SELECT id, name FROM venues WHERE id = ?').get('v-5') as { id: string; name: string });

    const startTime = payload.start_time || '09 : 00';
    const endTime = payload.end_time || '12 : 00';
    const coverImage = payload.image || '/assets/figma/86192.png';

    db.run(
      `INSERT INTO events (
        id, title, description, event_date, start_time, end_time,
        venue_id, organization_id, base_participants, max_participants,
        hours, status, organizer_status, cover_image, qr_image, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        eventId,
        payload.title.trim(),
        payload.description.trim(),
        payload.date || '30-09-2027',
        startTime,
        endTime,
        venueRow.id,
        orgRow.id,
        0,
        Number(payload.max_participants) || 30,
        Number(payload.hours) || 3,
        'กำลังจะเปิด',
        'รอเจ้าหน้าที่อนุมัติ',
        coverImage,
        '/assets/figma/15bde.png',
        new Date().toISOString().slice(0, 10),
      ]
    );

    // Link categories in event_categories junction table
    const tags = payload.tags && payload.tags.length > 0 ? payload.tags : ['พัฒนาตัวเอง'];
    for (const tag of tags) {
      const cat = db.query('SELECT id FROM categories WHERE name = ?').get(tag) as { id: string } | null;
      if (cat) {
        db.run('INSERT OR IGNORE INTO event_categories (event_id, category_id) VALUES (?, ?)', [
          eventId,
          cat.id,
        ]);
      }
    }

    // Create corresponding approval request in event_requests
    const reqCount = (db.query('SELECT COUNT(*) as c FROM event_requests').get() as { c: number }).c;
    const reqCode = `REQ-2569-${String(30 + reqCount + 1).padStart(3, '0')}`;
    db.run(
      `INSERT INTO event_requests (
        id, request_code, event_id, organization_id, venue_id, title, description,
        submitted_date, submitted_time, event_date, event_time,
        capacity, hours, pdf_name, pdf_pages, pdf_size, status, admin_note, image
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        `req-${Date.now()}`,
        reqCode,
        eventId,
        orgRow.id,
        venueRow.id,
        payload.title.trim(),
        payload.description.trim(),
        '17 พ.ย. 2569',
        '14:00 น.',
        payload.date || '30 ก.ย. 2570',
        `${startTime} – ${endTime} น.`,
        Number(payload.max_participants) || 30,
        Number(payload.hours) || 3,
        payload.pdf_name || 'เล่มคำขอโครงการ.pdf',
        12,
        '2.4 MB',
        'รอตรวจสอบ',
        '',
        coverImage,
      ]
    );

    return {
      event: this.findById(eventId),
      requestCode: reqCode,
    };
  },

  update(id: string, payload: any) {
    const existing = db.query('SELECT * FROM events WHERE id = ?').get(id) as any;
    if (!existing) return null;

    let venueId = existing.venue_id;
    if (payload.venue_full) {
      const codeHint = payload.venue_full.split(':')[0].trim();
      const matchedVenue = db
        .query('SELECT id FROM venues WHERE code = ? OR full_name = ? OR name = ?')
        .get(codeHint, payload.venue_full, payload.venue_full) as { id: string } | null;
      if (matchedVenue) venueId = matchedVenue.id;
    }

    let orgId = existing.organization_id;
    if (payload.organization) {
      let matchedOrg = db
        .query('SELECT id FROM organizations WHERE name = ?')
        .get(payload.organization.trim()) as { id: string } | null;
      if (!matchedOrg) {
        const newOrgId = `org-${Date.now()}`;
        db.run(
          'INSERT INTO organizations (id, name, coordinator_name, contact_email) VALUES (?, ?, ?, ?)',
          [newOrgId, payload.organization.trim(), 'ปภาวรินท์ ลาภอนันต์', 'pp.asd@kmutt.ac.th']
        );
        matchedOrg = { id: newOrgId };
      }
      orgId = matchedOrg.id;
    }

    db.run(
      `UPDATE events
       SET title = ?, description = ?, event_date = ?, start_time = ?, end_time = ?,
           venue_id = ?, organization_id = ?, max_participants = ?, hours = ?, organizer_status = ?
       WHERE id = ?`,
      [
        payload.title ?? existing.title,
        payload.description ?? existing.description,
        payload.date ?? existing.event_date,
        payload.start_time ?? existing.start_time,
        payload.end_time ?? existing.end_time,
        venueId,
        orgId,
        payload.max_participants ?? existing.max_participants,
        payload.hours ?? existing.hours,
        payload.organizer_status ?? existing.organizer_status,
        id,
      ]
    );

    return this.findById(id);
  },

  toggleFavorite(eventId: string, userId = CURRENT_USER_ID) {
    const existing = db
      .query('SELECT * FROM event_favorites WHERE event_id = ? AND user_id = ?')
      .get(eventId, userId);

    if (existing) {
      db.run('DELETE FROM event_favorites WHERE event_id = ? AND user_id = ?', [eventId, userId]);
    } else {
      db.run('INSERT INTO event_favorites (event_id, user_id, created_at) VALUES (?, ?, ?)', [
        eventId,
        userId,
        new Date().toISOString(),
      ]);
    }
    return this.findById(eventId);
  },

  toggleRegistration(eventId: string, userId = CURRENT_USER_ID) {
    const ev = this.findById(eventId);
    if (!ev) return { error: 'NOT_FOUND' as const };

    const existingReg = db
      .query('SELECT id FROM event_registrations WHERE event_id = ? AND user_id = ?')
      .get(eventId, userId) as { id: string } | null;

    if (existingReg) {
      db.run('DELETE FROM event_registrations WHERE id = ?', [existingReg.id]);
      return { action: 'unregistered' as const, event: this.findById(eventId) };
    }

    if (ev.current_participants >= ev.max_participants) {
      return { error: 'FULL' as const };
    }

    db.run(
      `INSERT INTO event_registrations (id, event_id, user_id, participation_status, registered_at)
       VALUES (?, ?, ?, ?, ?)`,
      [`reg-${Date.now()}`, eventId, userId, 'กำลังดำเนินอยู่', new Date().toISOString().slice(0, 10)]
    );

    return { action: 'registered' as const, event: this.findById(eventId) };
  },

  findCheckinsByEvent(eventId: string) {
    let rows = db
      .query(
        `SELECT id, event_id, student_id, attendee_name AS name, check_in_time, avatar
         FROM event_checkins
         WHERE event_id = ?
         ORDER BY rowid DESC`
      )
      .all(eventId) as any[];

    if (rows.length === 0) {
      rows = db
        .query(
          `SELECT id, event_id, student_id, attendee_name AS name, check_in_time, avatar
           FROM event_checkins
           WHERE event_id = 'ev-5'
           ORDER BY rowid DESC`
        )
        .all() as any[];
    }
    return rows;
  },

  addCheckin(eventId: string, studentId: string, attendeeName: string) {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')} : ${String(now.getMinutes()).padStart(2, '0')}`;
    const id = `att-${Date.now()}`;
    db.run(
      `INSERT INTO event_checkins (id, event_id, student_id, attendee_name, check_in_time, avatar)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, eventId, studentId, attendeeName, timeStr, '/assets/figma/2beed.png']
    );
    return this.findCheckinsByEvent(eventId);
  },
};
