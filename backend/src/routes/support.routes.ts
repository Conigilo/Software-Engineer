import { Elysia, t } from 'elysia';
import { UserRepository } from '../repositories/user.repository';

export const supportRoutes = new Elysia({ prefix: '/api' })
  .get(
    '/notifications',
    ({ query }) => {
      const role = query.role || 'participant';
      const unreadOnly = query.unreadOnly === 'true';
      return UserRepository.findNotifications(role, unreadOnly);
    },
    {
      detail: {
        tags: ['Notifications & Support'],
        summary: 'Get notifications filtered by role and read status',
      },
    }
  )
  .patch(
    '/notifications/:id/read',
    ({ params }) => {
      UserRepository.markNotificationRead(params.id);
      return { ok: true };
    },
    {
      detail: {
        tags: ['Notifications & Support'],
        summary: 'Mark notification as read',
      },
    }
  )
  .get(
    '/chat',
    () => {
      return UserRepository.findChatMessages();
    },
    {
      detail: {
        tags: ['Notifications & Support'],
        summary: 'Get support chat conversation history',
      },
    }
  )
  .post(
    '/chat',
    ({ body }) => {
      const text = (body.text || '').trim();
      if (!text) return { ok: false };

      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} น.`;
      UserRepository.addChatMessage('user', text, null, timeStr);

      let replyText =
        'เปิดเมนู “กิจกรรมของฉัน” แล้วเลือก\nกิจกรรมที่ลงทะเบียน จากนั้นกด\n“เลือกกิจกรรม” เพื่อใช้เช็กอินค่ะ';
      let replySubtext: string | null = 'หากไม่พบ QR Code แจ้งฉันได้เลยค่ะ';

      const lower = text.toLowerCase();
      if (lower.includes('ชั่วโมง') || lower.includes('สะสม')) {
        replyText =
          'คุณสามารถตรวจสอบชั่วโมงกิจกรรมสะสมได้ที่เมนู “โปรไฟล์” มุมขวาล่างค่ะ (ปัจจุบันสะสมแล้ว 20/25 ชม.)';
        replySubtext = 'ขาดอีกเพียง 5 ชม. จะครบตามเกณฑ์มหาวิทยาลัยค่ะ';
      } else if (lower.includes('สร้าง') || lower.includes('ผู้จัด') || lower.includes('โครงการ')) {
        replyText =
          'สำหรับการขอจัดกิจกรรม ให้สลับไปที่โหมด “ผู้จัดกิจกรรม” แล้วกดปุ่ม “+” มุมซ้ายบนเพื่อกรอกข้อมูล 5 ขั้นตอนและแนบเล่มโครงการ (.pdf) ค่ะ';
        replySubtext = 'ฝ่ายกิจการนักศึกษาจะตรวจสอบคำขอภายใน 1–2 วันทำการค่ะ';
      } else if (lower.includes('เจ้าหน้าที่') || lower.includes('ติดต่อ')) {
        replyText =
          'ระบบได้ส่งเรื่องต่อไปยังเจ้าหน้าที่ฝ่ายกิจการนักศึกษา (อาคาร S14 ชั้น 2) เรียบร้อยแล้วค่ะ';
        replySubtext = 'เจ้าหน้าที่จะติดต่อกลับทางอีเมลมหาวิทยาลัยของคุณโดยเร็วที่สุดค่ะ';
      }

      UserRepository.addChatMessage('assistant', replyText, replySubtext, timeStr);

      return {
        ok: true,
        messages: UserRepository.findChatMessages(),
      };
    },
    {
      body: t.Object({
        text: t.String(),
      }),
      detail: {
        tags: ['Notifications & Support'],
        summary: 'Send message to E-MOD Support Assistant',
      },
    }
  )
  .get(
    '/recent-searches',
    () => {
      return UserRepository.findRecentSearches();
    },
    {
      detail: {
        tags: ['Notifications & Support'],
        summary: 'Get recent event searches joined with events table',
      },
    }
  )
  .post(
    '/recent-searches',
    ({ body }) => {
      return UserRepository.addRecentSearch(body.event_id);
    },
    {
      body: t.Object({
        event_id: t.String(),
        title: t.Optional(t.String()),
        date_label: t.Optional(t.String()),
        image: t.Optional(t.String()),
      }),
      detail: {
        tags: ['Notifications & Support'],
        summary: 'Record recent event search',
      },
    }
  );
