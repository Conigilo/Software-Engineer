import { EventRepository, EventFilterParams } from '../repositories/event.repository';
import { UserRepository } from '../repositories/user.repository';

export class EventService {
  static listEvents(filters: EventFilterParams = {}) {
    return EventRepository.findAll(filters);
  }

  static getEventById(id: string) {
    return EventRepository.findById(id);
  }

  static createEventProposal(payload: {
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
    if (!payload.title?.trim() || !payload.organization?.trim() || !payload.description?.trim()) {
      return {
        ok: false as const,
        status: 400,
        message: 'กรุณากรอกข้อมูลกิจกรรมและแนบเอกสารยืนยันโครงการให้ครบถ้วน',
      };
    }

    const created = EventRepository.create({
      title: payload.title,
      organization: payload.organization,
      description: payload.description,
      date: payload.date,
      start_time: payload.start_time,
      end_time: payload.end_time,
      venue_full: payload.venue_full,
      max_participants: payload.max_participants ? Number(payload.max_participants) : 30,
      hours: payload.hours ? Number(payload.hours) : 3,
      tags: payload.tags,
      image: payload.image,
      pdf_name: payload.pdf_name,
    });

    UserRepository.createNotification({
      role_target: 'organizer',
      type: 'document',
      title: `ส่งคำขอสร้างกิจกรรม "${payload.title.trim()}" แล้ว`,
      time_ago: 'เมื่อสักครู่',
      body: `รหัสคำขอ ${created.requestCode} อยู่ระหว่างรอฝ่ายกิจการนักศึกษาตรวจสอบและอนุมัติ`,
      action_label: 'ดูสถานะกิจกรรม',
      target_event_id: created.event?.id,
    });

    return {
      ok: true as const,
      status: 201,
      ...created,
    };
  }

  static updateEventDetails(id: string, payload: Record<string, any>) {
    const updated = EventRepository.update(id, payload);
    if (!updated) {
      return { ok: false as const, status: 404, message: 'ไม่พบกิจกรรม' };
    }

    UserRepository.createNotification({
      role_target: 'participant',
      type: 'edit',
      title: `อัปเดตกิจกรรม ${updated.title}`,
      time_ago: 'เมื่อสักครู่',
      body: 'ผู้จัดกิจกรรมมีการแก้ไขรายละเอียดกิจกรรม โปรดตรวจสอบข้อมูลล่าสุด',
      action_label: 'ดูรายละเอียด',
      target_event_id: id,
    });

    return { ok: true as const, status: 200, event: updated };
  }

  static toggleFavorite(id: string) {
    const updated = EventRepository.toggleFavorite(id);
    if (!updated) {
      return { ok: false as const, status: 404, message: 'ไม่พบกิจกรรม' };
    }
    return { ok: true as const, status: 200, event: updated };
  }

  static toggleRegistration(id: string) {
    const res = EventRepository.toggleRegistration(id);
    if (res.error === 'NOT_FOUND') {
      return { ok: false as const, status: 404, message: 'ไม่พบกิจกรรม' };
    }
    if (res.error === 'FULL') {
      return {
        ok: false as const,
        status: 400,
        message: 'ที่นั่งเต็มแล้ว ไม่สามารถลงทะเบียนเพิ่มได้',
      };
    }

    if (res.action === 'registered' && res.event) {
      UserRepository.createNotification({
        role_target: 'participant',
        type: 'check',
        title: 'ลงทะเบียนเข้าร่วมกิจกรรมสำเร็จ',
        time_ago: 'เมื่อสักครู่',
        body: `ลงทะเบียนเข้าร่วมกิจกรรม${res.event.title}สำเร็จแล้ว สามารถดูบัตรเข้างาน (QR Code) ได้ที่กิจกรรมของฉัน`,
        action_label: 'ดูรายละเอียด',
        target_event_id: id,
      });
    }

    return { ok: true as const, status: 200, action: res.action, event: res.event };
  }

  static getEventAttendees(eventId: string) {
    const event = EventRepository.findById(eventId);
    const attendees = EventRepository.findCheckinsByEvent(eventId);
    return { event, attendees };
  }

  static checkInAttendee(eventId: string, studentId?: string, name?: string) {
    const resolvedStudentId = studentId || `67090500${Math.floor(100 + Math.random() * 899)}`;
    const resolvedName = name || 'น.ส.ปภาวรินท์ ลาภอนันต์ (สแกน QR)';
    const attendees = EventRepository.addCheckin(eventId, resolvedStudentId, resolvedName);
    return { ok: true as const, attendee: attendees[0], attendees };
  }

  static exportAttendeesCsv(eventId: string) {
    const ev = EventRepository.findById(eventId);
    const attendees = EventRepository.findCheckinsByEvent(eventId);
    const header = 'ลำดับ,รหัสนักศึกษา,ชื่อ-นามสกุล,เวลาเช็คชื่อ,กิจกรรม\n';
    const lines = attendees
      .map(
        (a, idx) =>
          `${idx + 1},${a.student_id},"${a.name}",${a.check_in_time},"${ev?.title || 'กิจกรรม E-MOD'}"`
      )
      .join('\n');
    return {
      ok: true as const,
      filename: `attendees-${eventId}.csv`,
      csv: header + lines,
      count: attendees.length,
    };
  }
}
