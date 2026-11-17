import { RequestRepository } from '../repositories/request.repository';
import { UserRepository } from '../repositories/user.repository';

export class RequestService {
  static listRequests(
    filters: { status?: string; date?: string; search?: string; sort?: string } = {}
  ) {
    return RequestRepository.findAll(filters);
  }

  static getRequestById(id: string) {
    return RequestRepository.findByIdOrCode(id);
  }

  static reviewRequest(
    id: string,
    payload: {
      status?: string;
      admin_note?: string;
      check_doc?: boolean;
      check_info?: boolean;
      check_venue?: boolean;
    }
  ) {
    const updated = RequestRepository.review(id, payload);
    if (!updated) {
      return { ok: false as const, status: 404, message: 'ไม่พบคำขออนุมัติ' };
    }

    if (payload.status === 'อนุมัติแล้ว') {
      UserRepository.createNotification({
        role_target: 'organizer',
        type: 'check',
        title: `อนุมัติคำขอ "${updated.title}" แล้ว`,
        time_ago: 'เมื่อสักครู่',
        body: `คำขอ ${updated.request_code} ได้รับการอนุมัติและเผยแพร่บนหน้ารวมกิจกรรม E-MOD เรียบร้อยแล้ว`,
        action_label: 'ดูสถานะกิจกรรม',
        target_event_id: updated.event_id,
      });
    } else if (payload.status === 'ส่งกลับแก้ไข') {
      UserRepository.createNotification({
        role_target: 'organizer',
        type: 'warning',
        title: `คำขอ "${updated.title}" ถูกส่งกลับแก้ไข`,
        time_ago: 'เมื่อสักครู่',
        body:
          payload.admin_note ||
          'กรุณาตรวจสอบรายละเอียดและเอกสารประกอบก่อนส่งคำขอใหม่อีกครั้ง',
        action_label: 'แก้ไขกิจกรรม',
        target_event_id: updated.event_id,
      });
    }

    return { ok: true as const, status: 200, request: updated };
  }
}
