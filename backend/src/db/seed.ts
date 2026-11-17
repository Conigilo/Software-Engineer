import { Database } from 'bun:sqlite';

export function seedDatabase(db: Database) {
  const tx = db.transaction(() => {
    // 1. Seed Organizations
    const insertOrg = db.prepare(
      'INSERT INTO organizations (id, name, coordinator_name, contact_email) VALUES (?, ?, ?, ?)'
    );
    const organizations = [
      ['org-1', 'ชมรมจิตอาสา', 'ลาแล้ว ผู้คนบางกอก', 'volunteer@university.ac.th'],
      ['org-2', 'สโมสรนักศึกษา', 'กานต์ ชัยพัฒนา', 'samo@kmutt.ac.th'],
      ['org-3', 'ชมรมศิลปะและออกแบบ', 'พิมพ์ชนก วาดฝัน', 'artclub@kmutt.ac.th'],
      ['org-4', 'สภานักศึกษา', 'ศุภกร มั่งคั่ง', 'council@kmutt.ac.th'],
      ['org-5', 'ชมรมสืบสวนเยาวชน', 'ปภาวรินท์ ลาภอนันต์', 'pp.asd@kmutt.ac.th'],
      ['org-6', 'ชมรมกีฬา', 'ธนภัทร รักสุขภาพ', 'sports@kmutt.ac.th'],
      ['org-7', 'ชมรมดนตรี', 'ปภาวรินท์ ลาภอนันต์', 'music@kmutt.ac.th'],
      ['org-8', 'ฝ่ายกิจการนักศึกษา', 'ผู้ดูแลระบบ', 'admin@kmutt.ac.th'],
    ] as const;
    for (const o of organizations) insertOrg.run(...o);

    // 2. Seed Users
    const insertUser = db.prepare(`
      INSERT INTO users (id, student_id, name, email, avatar, activity_hours, target_hours, role, organization_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertUser.run(
      'u-1',
      '67090500429',
      'ปภาวรินท์ ลาภอนันต์',
      'pp.asd@kmutt.ac.th',
      '/assets/figma/2beed.png',
      20,
      25,
      'participant',
      'org-5'
    );
    insertUser.run(
      'u-2',
      '67090500001',
      'ฝ่ายกิจการนักศึกษา',
      'admin@kmutt.ac.th',
      '/assets/figma/2beed.png',
      25,
      25,
      'admin',
      'org-8'
    );

    // 3. Seed Categories
    const insertCat = db.prepare('INSERT INTO categories (id, name) VALUES (?, ?)');
    const categories = [
      ['cat-1', 'พัฒนาตัวเอง'],
      ['cat-2', 'งานและการเงิน'],
      ['cat-3', 'งานแข่งขัน'],
      ['cat-4', 'จิตอาสา'],
      ['cat-5', 'กีฬา'],
      ['cat-6', 'ดนตรี'],
      ['cat-7', 'ศิลปะ'],
      ['cat-8', 'วิชาการ'],
      ['cat-9', 'บอร์ดเกม'],
      ['cat-10', 'เทคโนโลยี'],
      ['cat-11', 'สุขภาพ'],
    ] as const;
    for (const c of categories) insertCat.run(...c);

    // 4. Seed Venues
    const insertVenue = db.prepare(
      'INSERT INTO venues (id, code, name, full_name, capacity, image) VALUES (?, ?, ?, ?, ?, ?)'
    );
    const venues = [
      ['v-1', 'S14', 'อาคารพระจอมเกล้าราชานุสรณ์ 190 ปี', 'S14 : อาคารพระจอมเกล้าราชานุสรณ์ 190 ปี', 300, '/assets/figma/51eb6.png'],
      ['v-2', 'CB2', 'อาคารเรียนรวม 2', 'CB2 : อาคารเรียนรวม 2', 80, '/assets/figma/9b2af.png'],
      ['v-3', 'N16', 'อาคารการเรียนรู้พหุวิทยาการ', 'N16 : อาคารการเรียนรู้พหุวิทยาการ', 300, '/assets/figma/51eb6.png'],
      ['v-4', 'CB1', 'อาคารเรียนรวม 1', 'CB1 : อาคารเรียนรวม 1', 80, '/assets/figma/9b2af.png'],
      ['v-5', 'N10', 'อาคารสำนักหอสมุด', 'N10 : อาคารสำนักหอสมุด', 100, '/assets/figma/e9192.png'],
      ['v-6', 'N7', 'อาคารปฏิบัติการพื้นฐานทางวิทยาศาสตร์', 'N7 : อาคารปฏิบัติการพื้นฐานทางวิทยาศาสตร์', 100, '/assets/figma/64291.png'],
      ['v-7', 'W1', 'อาคารวิศววัฒนะ', 'W1 : อาคารวิศววัฒนะ', 100, '/assets/figma/e9192.png'],
      ['v-8', 'N15', 'อาคารเรียนและปฏิบัติการทางศิลปศาสตร์', 'N15 : อาคารเรียนและปฏิบัติการทางศิลปศาสตร์', 120, '/assets/figma/51eb6.png'],
      ['v-9', 'LG', 'Learning Garden (LG)', 'Learning Garden (LG)', 60, '/assets/figma/64291.png'],
    ] as const;
    for (const v of venues) insertVenue.run(...v);

    // 5. Seed Normalized Venue Time Slots (18 พฤศจิกายน 2569)
    const insertSlot = db.prepare(`
      INSERT INTO venue_time_slots (id, venue_id, slot_date, slot_key, slot_label, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const slotConfigs: Array<[string, 'ว่าง' | 'ไม่ว่าง', 'ว่าง' | 'ไม่ว่าง', 'ว่าง' | 'ไม่ว่าง']> = [
      ['v-1', 'ว่าง', 'ไม่ว่าง', 'ไม่ว่าง'],
      ['v-2', 'ว่าง', 'ว่าง', 'ไม่ว่าง'],
      ['v-3', 'ว่าง', 'ไม่ว่าง', 'ว่าง'],
      ['v-4', 'ว่าง', 'ว่าง', 'ว่าง'],
      ['v-5', 'ว่าง', 'ว่าง', 'ไม่ว่าง'],
      ['v-6', 'ว่าง', 'ว่าง', 'ว่าง'],
      ['v-7', 'ไม่ว่าง', 'ไม่ว่าง', 'ว่าง'],
      ['v-8', 'ว่าง', 'ไม่ว่าง', 'ว่าง'],
      ['v-9', 'ว่าง', 'ว่าง', 'ว่าง'],
    ];
    const defaultDate = '18 พฤศจิกายน 2569';
    for (const [venueId, m, a, e] of slotConfigs) {
      insertSlot.run(`slot-${venueId}-m`, venueId, defaultDate, 'morning', '08:00 – 12:00 น.', m);
      insertSlot.run(`slot-${venueId}-a`, venueId, defaultDate, 'afternoon', '12:00 – 16:00 น.', a);
      insertSlot.run(`slot-${venueId}-e`, venueId, defaultDate, 'evening', '16:00 – 20:00 น.', e);
    }

    // 6. Seed Events (Relational Foreign Keys to venues & organizations)
    const insertEvent = db.prepare(`
      INSERT INTO events (
        id, title, description, event_date, start_time, end_time,
        venue_id, organization_id, base_participants, max_participants,
        hours, status, organizer_status, cover_image, qr_image, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const events = [
      [
        'ev-1',
        'ปันน้ำใจให้เด็กยากไร้',
        'กิจกรรมจิตอาสาร่วมแบ่งปันสิ่งของและจัดกิจกรรมนันทนาการเพื่อเสริมสร้างรอยยิ้มและโอกาสทางการศึกษาให้กับเด็กผู้ด้อยโอกาส',
        '12-11-2026',
        '09 : 00',
        '16 : 00',
        'v-1',
        'org-1',
        8,
        20,
        6,
        'เปิดแล้ว',
        'กำลังดำเนินการ...',
        '/assets/figma/fa970.png',
        '/assets/figma/15bde.png',
        '2026-11-01',
      ],
      [
        'ev-2',
        'Mod-Hack(kathon)',
        'การแข่งขัน Hackathon ภายในมหาวิทยาลัย เพื่อหาผู้เป็นเลิศ ภายใต้หัวข้อ “โลกไร้ไซเบอร์” ชิงเงินรางวัลรวมกว่า 30,000 บาท มีจุดประสงค์ในการกระตุ้นความทะเยอทะยานในการเรียนรู้ และส่งเสริมให้นักศึกษาพัฒนาหาความรู้เพิ่มเติมอยู่เสมอ',
        '18-11-2026',
        '08 : 00',
        '16 : 00',
        'v-3',
        'org-2',
        17,
        20,
        8,
        'เปิดแล้ว',
        'กำลังดำเนินการ...',
        '/assets/figma/36446.png',
        '/assets/figma/15bde.png',
        '2026-11-05',
      ],
      [
        'ev-3',
        'เยียวยาจิตใจหลังสอบ',
        'การแข่งขัน Hackathon ภายในมหาวิทยาลัย เพื่อหาผู้เป็นเลิศ ภายใต้หัวข้อ “โลกไร้ไซเบอร์” ชิงเงินรางวัลรวมกว่า 30,000 บาท มีจุดประสงค์ในการกระตุ้นความทะเยอทะยานในการเรียนรู้ และส่งเสริมให้นักศึกษาพัฒนาหาความรู้เพิ่มเติมอยู่เสมอ',
        '26-11-2026',
        '13 : 00',
        '17 : 00',
        'v-8',
        'org-3',
        30,
        30,
        4,
        'เปิดแล้ว',
        'ยังไม่ถึงวัน',
        '/assets/figma/9fc64.png',
        '/assets/figma/15bde.png',
        '2026-11-08',
      ],
      [
        'ev-4',
        'Job-fair ใบเบิกทางหางาน',
        'มหกรรมแนะแนวสายอาชีพและรับสมัครงานจากบริษัทชั้นนำกว่า 40 บริษัท พร้อมเวิร์กช็อปตรวจเรซูเม่และจำลองการสัมภาษณ์งานจริง',
        '6-12-2026',
        '09 : 00',
        '17 : 00',
        'v-3',
        'org-4',
        120,
        135,
        6,
        'กำลังจะเปิด',
        'ยังไม่ถึงวัน',
        '/assets/figma/322b4.png',
        '/assets/figma/15bde.png',
        '2026-11-10',
      ],
      [
        'ev-5',
        'พัฒนาบุคลิกภาพเพื่อความเริ่ด',
        'เวิร์กช็อปพัฒนาบุคลิกภาพ การสื่อสาร และการแต่งกายเพื่อเตรียมความพร้อมสู่การทำงานอย่างมืออาชีพ',
        '18-11-2026',
        '08 : 00',
        '12 : 00',
        'v-6',
        'org-5',
        39,
        50,
        4,
        'เปิดแล้ว',
        'กำลังดำเนินการ...',
        '/assets/figma/62d1b.png',
        '/assets/figma/15bde.png',
        '2026-11-11',
      ],
      [
        'ev-6',
        'ทำทงคัตสึราเม็ง',
        'เรียนรู้การทำน้ำซุปทงคัตสึเข้มข้นและเส้นราเม็งสดแบบต้นตำรับญี่ปุ่น พร้อมชิมผลงานตัวเองร่วมกับเพื่อนต่างคณะ',
        '20-12-2026',
        '10 : 00',
        '14 : 00',
        'v-5',
        'org-5',
        11,
        30,
        4,
        'กำลังจะเปิด',
        'ยังไม่ถึงวัน',
        '/assets/figma/38f5d.png',
        '/assets/figma/15bde.png',
        '2026-11-12',
      ],
      [
        'ev-7',
        'การควบคุมอารมณ์ในการทำงาน',
        'เทคนิคการจัดการอารมณ์และความเครียดในการทำงานร่วมกับผู้อื่น เสริมสร้าง EQ และทักษะการสื่อสารเชิงบวก',
        '29-08-2027',
        '13 : 00',
        '16 : 00',
        'v-6',
        'org-5',
        18,
        40,
        3,
        'กำลังจะเปิด',
        'ใกล้ถึงแล้ว',
        '/assets/figma/f9c4c.png',
        '/assets/figma/15bde.png',
        '2026-11-13',
      ],
      [
        'ev-8',
        'ติวเพิ่มเติมเสริมแกร่งแคล',
        'ติวเข้มแคลคูลัสพื้นฐานและตะลุยโจทย์ข้อสอบเก่าโดยรุ่นพี่เกียรตินิยม เพื่อให้พร้อมสำหรับการสอบปลายภาค',
        '19-01-2027',
        '09 : 00',
        '12 : 00',
        'v-6',
        'org-2',
        13,
        60,
        3,
        'เปิดแล้ว',
        'ยังไม่ถึงวัน',
        '/assets/figma/867ba.png',
        '/assets/figma/15bde.png',
        '2026-11-14',
      ],
      [
        'ev-9',
        'ช็อกโกแลตสื่อใจ',
        'เวิร์กช็อปทำช็อกโกแลตแฮนด์เมดต้อนรับเทศกาลวาเลนไทน์ เรียนรู้การเทมเปอร์ช็อกโกแลตและตกแต่งหน้าสวยงาม',
        '14-02-2027',
        '13 : 00',
        '16 : 00',
        'v-5',
        'org-3',
        2,
        16,
        3,
        'กำลังจะเปิด',
        'ยังไม่ถึงวัน',
        '/assets/figma/56f4b.png',
        '/assets/figma/15bde.png',
        '2026-11-14',
      ],
      [
        'ev-10',
        'กิจกรรมเสริมพลังวิญญาณ',
        'กิจกรรมฝึกสมาธิ ผ่อนคลายความเหนื่อยล้า และฮีลใจท่ามกลางธรรมชาติในสวนการเรียนรู้',
        '26-06-2027',
        '09 : 00',
        '15 : 00',
        'v-9',
        'org-1',
        0,
        30,
        6,
        'เปิดแล้ว',
        'ยังไม่ถึงวัน',
        '/assets/figma/03acf.png',
        '/assets/figma/15bde.png',
        '2026-11-14',
      ],
      [
        'ev-11',
        'อบรมใบขับขี่ Safety ปลอดภัย',
        'อบรมความรู้กฎจราจรและเทคนิคการขับขี่ปลอดภัย พร้อมรับใบรับรองสำหรับยื่นทำใบอนุญาตขับขี่',
        '29-12-2026',
        '08 : 30',
        '16 : 30',
        'v-1',
        'org-8',
        24,
        40,
        8,
        'เปิดแล้ว',
        'ยังไม่ถึงวัน',
        '/assets/figma/f214f.png',
        '/assets/figma/15bde.png',
        '2026-11-15',
      ],
      [
        'ev-12',
        'Warm-Kid',
        'โครงการค่ายอาสาดูแลน้องและจัดกิจกรรมสร้างสรรค์ให้น้องๆ เยาวชนรอบรั้วมหาวิทยาลัย',
        '18-11-2026',
        '09 : 00',
        '16 : 00',
        'v-6',
        'org-1',
        23,
        30,
        6,
        'เปิดแล้ว',
        'กำลังดำเนินการ...',
        '/assets/figma/880df.png',
        '/assets/figma/15bde.png',
        '2026-11-15',
      ],
      [
        'ev-13',
        'ประกวดโครงงานวิทยาศาสตร์',
        'เวทีนำเสนอผลงานวิจัยและนวัตกรรมทางวิทยาศาสตร์ของนักศึกษา ชิงทุนการศึกษาและโล่เกียรติยศ',
        '03-10-2026',
        '09 : 00',
        '16 : 00',
        'v-6',
        'org-2',
        44,
        50,
        6,
        'เปิดแล้ว',
        'จบแล้ว',
        '/assets/figma/21d2c.png',
        '/assets/figma/15bde.png',
        '2026-10-03',
      ],
      [
        'ev-14',
        'แอโรบิกเพื่อสุขภาพ',
        'ออกกำลังกายเต้นแอโรบิกยามเย็นเพื่อเสริมสร้างสุขภาพที่ดีและผ่อนคลายหลังเลิกเรียน',
        '28-06-2027',
        '16 : 30',
        '18 : 30',
        'v-4',
        'org-6',
        29,
        50,
        2,
        'เปิดแล้ว',
        'จบแล้ว',
        '/assets/figma/51ff3.png',
        '/assets/figma/15bde.png',
        '2026-10-15',
      ],
    ] as const;

    for (const ev of events) insertEvent.run(...ev);

    // 7. Seed Event <-> Category Junction Table (Normalized Many-to-Many)
    const insertEventCat = db.prepare(
      'INSERT INTO event_categories (event_id, category_id) VALUES (?, ?)'
    );
    const eventCategories: Array<[string, string]> = [
      ['ev-1', 'cat-4'],
      ['ev-1', 'cat-1'],
      ['ev-2', 'cat-1'],
      ['ev-2', 'cat-2'],
      ['ev-2', 'cat-3'],
      ['ev-3', 'cat-1'],
      ['ev-3', 'cat-2'],
      ['ev-3', 'cat-3'],
      ['ev-4', 'cat-2'],
      ['ev-4', 'cat-1'],
      ['ev-5', 'cat-1'],
      ['ev-6', 'cat-1'],
      ['ev-6', 'cat-7'],
      ['ev-7', 'cat-1'],
      ['ev-7', 'cat-11'],
      ['ev-8', 'cat-8'],
      ['ev-8', 'cat-1'],
      ['ev-9', 'cat-7'],
      ['ev-9', 'cat-1'],
      ['ev-10', 'cat-11'],
      ['ev-10', 'cat-1'],
      ['ev-11', 'cat-1'],
      ['ev-12', 'cat-4'],
      ['ev-13', 'cat-8'],
      ['ev-13', 'cat-3'],
      ['ev-14', 'cat-5'],
      ['ev-14', 'cat-11'],
    ];
    for (const [evId, catId] of eventCategories) insertEventCat.run(evId, catId);

    // 8. Seed Event Registrations (Normalized Many-to-Many User <-> Event)
    const insertReg = db.prepare(`
      INSERT INTO event_registrations (id, event_id, user_id, participation_status, registered_at)
      VALUES (?, ?, ?, ?, ?)
    `);
    const registrations: Array<[string, string, string, string, string]> = [
      ['reg-1', 'ev-2', 'u-1', 'กำลังดำเนินอยู่', '2026-11-10'],
      ['reg-2', 'ev-5', 'u-1', 'กำลังดำเนินอยู่', '2026-11-11'],
      ['reg-3', 'ev-6', 'u-1', 'ยังไม่ถึง', '2026-11-12'],
      ['reg-4', 'ev-10', 'u-1', 'จบแล้ว', '2026-11-14'],
      ['reg-5', 'ev-11', 'u-1', 'ยังไม่ถึง', '2026-11-15'],
      ['reg-6', 'ev-12', 'u-1', 'กำลังดำเนินอยู่', '2026-11-15'],
      ['reg-7', 'ev-13', 'u-1', 'จบแล้ว', '2026-10-03'],
      ['reg-8', 'ev-14', 'u-1', 'จบแล้ว', '2026-10-15'],
    ];
    for (const r of registrations) insertReg.run(...r);

    // 9. Seed Event Favorites (Normalized Many-to-Many User <-> Event)
    const insertFav = db.prepare(
      'INSERT INTO event_favorites (event_id, user_id, created_at) VALUES (?, ?, ?)'
    );
    insertFav.run('ev-8', 'u-1', '2026-11-14');
    insertFav.run('ev-9', 'u-1', '2026-11-14');
    insertFav.run('ev-10', 'u-1', '2026-11-14');

    // 10. Seed Event Check-ins
    const insertCheckin = db.prepare(`
      INSERT INTO event_checkins (id, event_id, student_id, attendee_name, check_in_time, avatar)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const checkins: Array<[string, string, string, string, string, string]> = [
      ['att-1', 'ev-5', '67090500101', 'นาย อรุ่มเจ๊าะห์ ยิ้มแป้น', '08 : 32', '/assets/figma/f4b03.png'],
      ['att-2', 'ev-5', '67090500102', 'นาย นี่ฉันอยาก เข้างานหรือนี่', '08 : 30', '/assets/figma/5e564.png'],
      ['att-3', 'ev-5', '67090500103', 'น.ส.อ่านแล้ว เริ่มเครียด', '08 : 27', '/assets/figma/c13d1.png'],
      ['att-4', 'ev-5', '67090500104', 'น.ส.ไม่อยาก ทำงานแล้ว', '08 : 25', '/assets/figma/4f8e4.png'],
      ['att-5', 'ev-5', '67090500105', 'นาย อย่าห้าม จะลาออก', '08 : 19', '/assets/figma/4a382.png'],
      ['att-6', 'ev-5', '67090500106', 'นาย ไม่ต้องพูด จุ๊จุ๊จุ๊', '08 : 10', '/assets/figma/59364.png'],
      ['att-7', 'ev-5', '67090500107', 'นาย หลายครั้งละนะ แกอะ', '08 : 08', '/assets/figma/0e255.png'],
      ['att-8', 'ev-5', '67090500108', 'น.ส.สู้สิวะ อีหญิง', '08 : 05', '/assets/figma/1d9b7.png'],
    ];
    for (const c of checkins) insertCheckin.run(...c);

    // 11. Seed Event Approval Requests (Relational Foreign Keys to organizations & venues)
    const insertReq = db.prepare(`
      INSERT INTO event_requests (
        id, request_code, event_id, organization_id, venue_id, title, description,
        submitted_date, submitted_time, event_date, event_time,
        capacity, hours, pdf_name, pdf_pages, pdf_size, status, admin_note, image
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const requests = [
      [
        'req-1',
        'REQ-2569-035',
        'ev-1',
        'org-1',
        'v-1',
        'ค่ายอาสารักน้ำ รักปลา รักเราด้วยนะ',
        'กิจกรรมจิตอาสาปรับปรุงพื้นที่ส่วนกลางและสร้างสรรค์สื่อการเรียนรู้ ร่วมกับชุมชนรอบมหาวิทยาลัย',
        '14 พ.ย. 2569',
        '09:30 น.',
        '24 พ.ย. 2569',
        '08:00–12:00 น.',
        120,
        27,
        'เล่มคำขอ.pdf',
        12,
        '2.4 MB',
        'รอตรวจสอบ',
        '',
        '/assets/figma/fa970.png',
      ],
      [
        'req-2',
        'REQ-2569-034',
        'ev-2',
        'org-2',
        'v-3',
        'เปิดโลกกิจกรรมแล้วทำไงจะได้ใจเธอ',
        'งานเปิดบ้านแนะนำชมรมและองค์กรนักศึกษาภายในมหาวิทยาลัย พร้อมกิจกรรมสอยดาวและแลกของที่ระลึก',
        '14 พ.ย. 2569',
        '10:15 น.',
        '28 พ.ย. 2569',
        '09:00–16:00 น.',
        250,
        6,
        'เล่มคำขอ.pdf',
        18,
        '3.1 MB',
        'รอตรวจสอบ',
        '',
        '/assets/figma/36446.png',
      ],
      [
        'req-3',
        'REQ-2569-033',
        'ev-14',
        'org-6',
        'v-1',
        'วิ่งเพื่อสุขภาพปากดีแล้ว สุขภาพต้องดีด้วย',
        'กิจกรรมเดิน-วิ่งมินิมาราธอนรอบมหาวิทยาลัยเพื่อส่งเสริมสุขภาพที่ดีของนักศึกษาและบุคลากร',
        '13 พ.ย. 2569',
        '14:20 น.',
        '05 ธ.ค. 2569',
        '06:00–10:00 น.',
        200,
        4,
        'เล่มคำขอ.pdf',
        10,
        '1.8 MB',
        'รอตรวจสอบ',
        '',
        '/assets/figma/51ff3.png',
      ],
      [
        'req-4',
        'REQ-2569-032',
        'ev-3',
        'org-3',
        'v-2',
        'มาปั้นเซรามิกด้วยกันไหม',
        'เวิร์กช็อปปั้นดินเผาและเพนต์สีเซรามิกเบื้องต้น ฝึกสมาธิและจินตนาการสร้างสรรค์',
        '13 พ.ย. 2569',
        '11:05 น.',
        '12 ธ.ค. 2569',
        '13:00–17:00 น.',
        40,
        4,
        'เล่มคำขอ.pdf',
        8,
        '1.2 MB',
        'รอตรวจสอบ',
        '',
        '/assets/figma/9fc64.png',
      ],
      [
        'req-5',
        'REQ-2569-031',
        'ev-5',
        'org-7',
        'v-5',
        'สายลับจับคำผิด',
        'กิจกรรมบอร์ดเกมเสริมสร้างพัฒนาการและการเข้าสังคมกับคนหมู่มาก เพื่อความเข้ากันได้ และลดความเครียดจากการศึกษาของนักศึกษาภายในมหาวิทยาลัย',
        '12 พ.ย. 2569',
        '16:40 น.',
        '30 กันยายน 2027',
        '09:00–12:00 น.',
        30,
        3,
        'เล่มคำขอ.pdf',
        15,
        '2.6 MB',
        'รอตรวจสอบ',
        '',
        '/assets/figma/86192.png',
      ],
      [
        'req-6',
        'REQ-2569-030',
        'ev-4',
        'org-4',
        'v-5',
        'ใครอยากเป็นเศรษฐี',
        'เสวนาการวางแผนทางการเงินและการลงทุนเบื้องต้นสำหรับนักศึกษาจบใหม่',
        '12 พ.ย. 2569',
        '09:10 น.',
        '15 ธ.ค. 2569',
        '13:00–16:00 น.',
        80,
        3,
        'เล่มคำขอ.pdf',
        9,
        '1.5 MB',
        'รอตรวจสอบ',
        '',
        '/assets/figma/322b4.png',
      ],
    ] as const;
    for (const r of requests) insertReq.run(...r);

    // 12. Seed Notifications
    const insertNotif = db.prepare(`
      INSERT INTO notifications (
        id, user_id, role_target, type, title, time_ago, body, action_label, target_event_id, is_read
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const notifs = [
      ['n-1', 'u-1', 'participant', 'document', 'แบบประเมินกิจกรรมประกวดโครงงานวิทย...', '2 ชั่วโมงที่แล้ว', 'สามารถประเมินกิจกรรมเพื่อรับชั่วโมงกิจกรรมได้แล้วที่เมนูโปรไฟล์', 'ทำแบบประเมิน', 'ev-13', 0],
      ['n-2', 'u-1', 'participant', 'edit', 'กิจกรรมอบรมใบขับขี่ Safety ปลอดภัย', '3 วันที่แล้ว', 'ผู้จัดกิจกรรมมีการแก้ไขรายละเอียดกิจกรรม โปรดตรวจสอบข้อมูลล่าสุด', 'ดูรายละเอียด', 'ev-11', 0],
      ['n-3', 'u-1', 'participant', 'check', 'ลงทะเบียนเข้าร่วมกิจกรรมสำเร็จ', '1 สัปดาห์ที่แล้ว', 'ลงทะเบียนเข้าร่วมกิจกรรมติวเพิ่มเติมเสริมแกร่งแคลสำเร็จแล้ว', 'ดูรายละเอียด', 'ev-8', 1],
      ['n-4', 'u-1', 'participant', 'check', 'ลงทะเบียนเข้าร่วมกิจกรรมสำเร็จ', '1 สัปดาห์ที่แล้ว', 'ลงทะเบียนเข้าร่วมกิจกรรมช็อกโกแลตสื่อใจสำเร็จแล้ว', 'ดูรายละเอียด', 'ev-9', 1],
      ['n-5', 'u-1', 'participant', 'check', 'ลงทะเบียนเข้าร่วมกิจกรรมสำเร็จ', '1 สัปดาห์ที่แล้ว', 'ลงทะเบียนเข้าร่วมกิจกรรมเสริมพลังวิญญาณสำเร็จแล้ว', 'ดูรายละเอียด', 'ev-10', 1],
      ['n-6', 'u-1', 'participant', 'warning', 'คุณมีกิจกรรมที่ลงทะเบียนไว้พรุ่งนี้', '1 เดือนที่แล้ว', 'กิจกรรมประกวดโครงงานวิทยาศาสตร์ที่ลงทะเบียนไว้กำลังจะเริ่มพรุ่งนี้', 'ดูรายละเอียด', 'ev-13', 1],
      ['n-7', 'u-1', 'organizer', 'check', 'คำขอจัดกิจกรรมได้รับการอนุมัติ', '1 ชั่วโมงที่แล้ว', 'กิจกรรมพัฒนาบุคลิกภาพเพื่อความเริ่ด ได้รับการอนุมัติและเผยแพร่บน E-MOD แล้ว', 'ดูสถานะกิจกรรม', 'ev-5', 0],
      ['n-8', 'u-1', 'organizer', 'document', 'คำขอจัดกิจกรรมอยู่ระหว่างการตรวจสอบ', '1 วันที่แล้ว', 'กิจกรรมสายลับจับคำผิด (REQ-2569-031) อยู่ระหว่างรอเจ้าหน้าที่ฝ่ายกิจการนักศึกษาอนุมัติ', 'ดูสถานะกิจกรรม', 'ev-5', 0],
    ] as const;
    for (const n of notifs) insertNotif.run(...n);

    // 13. Seed Support Chat Messages
    const insertChat = db.prepare(`
      INSERT INTO chat_messages (id, user_id, sender, message_text, sub_text, sent_time)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    insertChat.run('cm-1', 'u-1', 'assistant', 'สวัสดีค่ะ ฉันคือ E-MOD Assistant\nมีอะไรให้ช่วยเกี่ยวกับกิจกรรมไหมคะ', null, '10:30 น.');
    insertChat.run('cm-2', 'u-1', 'user', 'ดู QR Code เข้างานได้ที่ไหนคะ', null, '10:31 น.');
    insertChat.run('cm-3', 'u-1', 'assistant', 'เปิดเมนู “กิจกรรมของฉัน” แล้วเลือก\nกิจกรรมที่ลงทะเบียน จากนั้นกด\n“เลือกกิจกรรม” เพื่อใช้เช็กอินค่ะ', 'หากไม่พบ QR Code แจ้งฉันได้เลยค่ะ', '10:31 น.');

    // 14. Seed Recent Searches (Relational Foreign Key to events)
    const insertRecent = db.prepare(`
      INSERT INTO recent_searches (id, user_id, event_id, searched_at)
      VALUES (?, ?, ?, ?)
    `);
    insertRecent.run('rs-1', 'u-1', 'ev-2', '2026-11-17T10:00:00Z');
    insertRecent.run('rs-2', 'u-1', 'ev-5', '2026-11-17T10:01:00Z');
    insertRecent.run('rs-3', 'u-1', 'ev-1', '2026-11-17T10:02:00Z');
    insertRecent.run('rs-4', 'u-1', 'ev-8', '2026-11-17T10:03:00Z');
    insertRecent.run('rs-5', 'u-1', 'ev-9', '2026-11-17T10:04:00Z');
  });

  tx();
}
