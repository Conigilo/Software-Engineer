-- ============================================================================
-- E-MOD Relational Database Schema (3NF Normalized - Zero JSON Columns)
-- ============================================================================

PRAGMA foreign_keys = ON;

-- 1. องค์กร / ชมรมผู้จัดกิจกรรม (Organizations)
CREATE TABLE IF NOT EXISTS organizations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  coordinator_name TEXT NOT NULL,
  contact_email TEXT NOT NULL
);

-- 2. ผู้ใช้งาน (Users: นักศึกษา, ผู้จัดกิจกรรม, ผู้ดูแลระบบ)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  avatar TEXT NOT NULL,
  activity_hours INTEGER NOT NULL DEFAULT 0,
  target_hours INTEGER NOT NULL DEFAULT 25,
  role TEXT NOT NULL DEFAULT 'participant',
  organization_id TEXT REFERENCES organizations(id) ON DELETE SET NULL
);

-- 3. หมวดหมู่กิจกรรม (Categories)
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

-- 4. สถานที่ / อาคาร (Venues)
CREATE TABLE IF NOT EXISTS venues (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  image TEXT NOT NULL
);

-- 5. ตารางช่วงเวลาว่างของสถานที่รายวัน (Venue Time Slots - 1-to-Many with Venues)
CREATE TABLE IF NOT EXISTS venue_time_slots (
  id TEXT PRIMARY KEY,
  venue_id TEXT NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  slot_date TEXT NOT NULL,
  slot_key TEXT NOT NULL, -- 'morning' | 'afternoon' | 'evening'
  slot_label TEXT NOT NULL, -- '08:00 – 12:00 น.' | '12:00 – 16:00 น.' | '16:00 – 20:00 น.'
  status TEXT NOT NULL DEFAULT 'ว่าง', -- 'ว่าง' | 'ไม่ว่าง'
  UNIQUE(venue_id, slot_date, slot_key)
);

-- 6. กิจกรรม (Events)
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  venue_id TEXT NOT NULL REFERENCES venues(id) ON DELETE RESTRICT,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  base_participants INTEGER NOT NULL DEFAULT 0,
  max_participants INTEGER NOT NULL DEFAULT 20,
  hours INTEGER NOT NULL DEFAULT 3,
  status TEXT NOT NULL DEFAULT 'เปิดแล้ว', -- 'เปิดแล้ว' | 'กำลังจะเปิด'
  organizer_status TEXT NOT NULL DEFAULT 'กำลังดำเนินการ...',
  cover_image TEXT NOT NULL,
  qr_image TEXT NOT NULL,
  created_at TEXT NOT NULL
);

-- 7. ตารางเชื่อม กิจกรรม <-> หมวดหมู่ (Many-to-Many Junction Table)
CREATE TABLE IF NOT EXISTS event_categories (
  event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, category_id)
);

-- 8. รูปภาพเพิ่มเติมของกิจกรรม (Event Gallery Images - 1-to-Many)
CREATE TABLE IF NOT EXISTS event_images (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 1
);

-- 9. การลงทะเบียนเข้าร่วมกิจกรรม (Event Registrations - Many-to-Many User <-> Event)
CREATE TABLE IF NOT EXISTS event_registrations (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  participation_status TEXT NOT NULL DEFAULT 'กำลังดำเนินอยู่', -- 'ยังไม่ถึง' | 'กำลังดำเนินอยู่' | 'จบแล้ว'
  registered_at TEXT NOT NULL,
  UNIQUE(event_id, user_id)
);

-- 10. รายการโปรด (Event Favorites - Many-to-Many User <-> Event)
CREATE TABLE IF NOT EXISTS event_favorites (
  event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL,
  PRIMARY KEY (event_id, user_id)
);

-- 11. ประวัติการสแกน QR เช็คชื่อเข้างาน (Event Check-ins - 1-to-Many with Events)
CREATE TABLE IF NOT EXISTS event_checkins (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL,
  attendee_name TEXT NOT NULL,
  check_in_time TEXT NOT NULL,
  avatar TEXT NOT NULL
);

-- 12. คำขอโพสต์กิจกรรมสำหรับแอดมินตรวจสอบ (Event Approval Requests)
CREATE TABLE IF NOT EXISTS event_requests (
  id TEXT PRIMARY KEY,
  request_code TEXT NOT NULL UNIQUE,
  event_id TEXT REFERENCES events(id) ON DELETE SET NULL,
  organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  venue_id TEXT NOT NULL REFERENCES venues(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  submitted_date TEXT NOT NULL,
  submitted_time TEXT NOT NULL,
  event_date TEXT NOT NULL,
  event_time TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  hours INTEGER NOT NULL,
  pdf_name TEXT NOT NULL,
  pdf_pages INTEGER NOT NULL,
  pdf_size TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'รอตรวจสอบ', -- 'รอตรวจสอบ' | 'อนุมัติแล้ว' | 'ส่งกลับแก้ไข'
  admin_note TEXT NOT NULL DEFAULT '',
  check_doc INTEGER NOT NULL DEFAULT 1,
  check_info INTEGER NOT NULL DEFAULT 1,
  check_venue INTEGER NOT NULL DEFAULT 1,
  image TEXT NOT NULL
);

-- 13. การแจ้งเตือน (Notifications)
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_target TEXT NOT NULL, -- 'participant' | 'organizer'
  type TEXT NOT NULL, -- 'document' | 'edit' | 'check' | 'warning'
  title TEXT NOT NULL,
  time_ago TEXT NOT NULL,
  body TEXT NOT NULL,
  action_label TEXT NOT NULL,
  target_event_id TEXT REFERENCES events(id) ON DELETE SET NULL,
  is_read INTEGER NOT NULL DEFAULT 0
);

-- 14. ข้อความแชตช่วยเหลือ (Support Chat Messages)
CREATE TABLE IF NOT EXISTS chat_messages (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sender TEXT NOT NULL, -- 'user' | 'assistant'
  message_text TEXT NOT NULL,
  sub_text TEXT,
  sent_time TEXT NOT NULL
);

-- 15. ประวัติการค้นหากิจกรรมล่าสุด (Recent Searches - Relational Foreign Key to Events)
CREATE TABLE IF NOT EXISTS recent_searches (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  searched_at TEXT NOT NULL,
  UNIQUE(user_id, event_id)
);

-- Indexes for fast SQL JOINs and filtering
CREATE INDEX IF NOT EXISTS idx_events_venue ON events(venue_id);
CREATE INDEX IF NOT EXISTS idx_events_org ON events(organization_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_event_categories_cat ON event_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_registrations_user ON event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON event_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_venue_slots_lookup ON venue_time_slots(venue_id, slot_date);
CREATE INDEX IF NOT EXISTS idx_requests_status ON event_requests(status);
