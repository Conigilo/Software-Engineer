import { db } from '../db/connection';

const CURRENT_USER_ID = 'u-1';

export const UserRepository = {
  findProfile(userId = CURRENT_USER_ID) {
    return db
      .query(
        `
        SELECT
          u.id,
          u.student_id,
          u.name,
          u.email,
          u.avatar,
          u.activity_hours,
          u.target_hours,
          u.role,
          COALESCE(o.name, 'ชมรมสืบสวนเยาวชน') AS organization
        FROM users u
        LEFT JOIN organizations o ON o.id = u.organization_id
        WHERE u.id = ?
      `
      )
      .get(userId) as any;
  },

  findByEmail(email: string) {
    return db
      .query(
        `
        SELECT
          u.id,
          u.student_id,
          u.name,
          u.email,
          u.avatar,
          u.activity_hours,
          u.target_hours,
          u.role,
          COALESCE(o.name, 'ชมรมสืบสวนเยาวชน') AS organization
        FROM users u
        LEFT JOIN organizations o ON o.id = u.organization_id
        WHERE u.email = ?
      `
      )
      .get(email) as any;
  },

  updateProfile(payload: { name?: string; organization?: string; role?: string }, userId = CURRENT_USER_ID) {
    const current = this.findProfile(userId);
    if (!current) return null;

    if (payload.name || payload.role) {
      db.run('UPDATE users SET name = ?, role = ? WHERE id = ?', [
        payload.name ?? current.name,
        payload.role ?? current.role,
        userId,
      ]);
    }
    return this.findProfile(userId);
  },

  findNotifications(roleTarget: string, unreadOnly = false) {
    let rows = db
      .query(
        `SELECT id, role_target AS role, type, title, time_ago, body, action_label, target_event_id, is_read
         FROM notifications
         WHERE role_target = ?
         ORDER BY rowid DESC`
      )
      .all(roleTarget) as any[];

    if (unreadOnly) {
      rows = rows.filter((n) => !n.is_read);
    }
    return rows.map((n) => ({ ...n, is_read: Boolean(n.is_read) }));
  },

  createNotification(payload: {
    role_target: string;
    type: string;
    title: string;
    time_ago: string;
    body: string;
    action_label: string;
    target_event_id?: string | null;
  }) {
    db.run(
      `INSERT INTO notifications (
        id, user_id, role_target, type, title, time_ago, body, action_label, target_event_id, is_read
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
      [
        `n-${Date.now()}-${Math.floor(Math.random() * 100)}`,
        CURRENT_USER_ID,
        payload.role_target,
        payload.type,
        payload.title,
        payload.time_ago,
        payload.body,
        payload.action_label,
        payload.target_event_id || null,
      ]
    );
  },

  markNotificationRead(id: string) {
    db.run('UPDATE notifications SET is_read = 1 WHERE id = ?', [id]);
  },

  findChatMessages() {
    return db
      .query(
        `SELECT id, sender, message_text AS text, sub_text AS subtext, sent_time AS time
         FROM chat_messages
         WHERE user_id = ?
         ORDER BY rowid ASC`
      )
      .all(CURRENT_USER_ID);
  },

  addChatMessage(sender: 'user' | 'assistant', text: string, subtext: string | null, time: string) {
    db.run(
      `INSERT INTO chat_messages (id, user_id, sender, message_text, sub_text, sent_time)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [`cm-${Date.now()}-${Math.floor(Math.random() * 100)}`, CURRENT_USER_ID, sender, text, subtext, time]
    );
  },

  /**
   * Query recent searches via relational JOIN between `recent_searches` and `events`
   */
  findRecentSearches() {
    return db
      .query(
        `
        SELECT
          rs.id,
          rs.event_id,
          e.title,
          e.event_date AS date_label,
          e.cover_image AS image
        FROM recent_searches rs
        INNER JOIN events e ON e.id = rs.event_id
        WHERE rs.user_id = ?
        ORDER BY rs.searched_at DESC
        LIMIT 8
      `
      )
      .all(CURRENT_USER_ID);
  },

  addRecentSearch(eventId: string) {
    db.run(
      `INSERT INTO recent_searches (id, user_id, event_id, searched_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(user_id, event_id) DO UPDATE SET searched_at = excluded.searched_at`,
      [`rs-${Date.now()}`, CURRENT_USER_ID, eventId, new Date().toISOString()]
    );
    return this.findRecentSearches();
  },
};
