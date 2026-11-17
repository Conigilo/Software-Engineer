import { VenueRepository } from '../repositories/venue.repository';

export class VenueService {
  static listVenues(filters: { status?: string; search?: string; date?: string } = {}) {
    return VenueRepository.findAll(filters);
  }

  static getVenueById(id: string) {
    return VenueRepository.findByIdOrCode(id);
  }

  static updateVenueSlots(
    id: string,
    payload: {
      slot_morning?: string;
      slot_afternoon?: string;
      slot_evening?: string;
      updated_date?: string;
      image?: string;
    }
  ) {
    const updated = VenueRepository.updateSlots(id, payload);
    if (!updated) {
      return { ok: false as const, status: 404, message: 'ไม่พบสถานที่' };
    }
    return { ok: true as const, status: 200, venue: updated };
  }
}
