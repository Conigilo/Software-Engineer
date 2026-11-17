import { httpClient } from './http.client';

export const eventService = {
  getEvents: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return httpClient.get<any[]>(`/events${qs}`);
  },
  getEvent: (id: string) => httpClient.get<any>(`/events/${id}`),
  createEvent: (payload: any) =>
    httpClient.post<{ ok: boolean; event: any; requestCode: string }>('/events', payload),
  updateEvent: (id: string, payload: any) =>
    httpClient.put<{ ok: boolean; event: any }>(`/events/${id}`, payload),
  toggleFavorite: (id: string) =>
    httpClient.post<{ ok: boolean; event: any }>(`/events/${id}/favorite`),
  toggleRegister: (id: string) =>
    httpClient.post<{ ok: boolean; action: 'registered' | 'unregistered'; event: any }>(
      `/events/${id}/register`
    ),
  getAttendees: (eventId: string) =>
    httpClient.get<{ event: any; attendees: any[] }>(`/events/${eventId}/attendees`),
  checkInAttendee: (eventId: string, payload?: { student_id?: string; name?: string }) =>
    httpClient.post<{ ok: boolean; attendee: any; attendees: any[] }>(
      `/events/${eventId}/checkin`,
      payload || {}
    ),
  exportAttendees: (eventId: string) =>
    httpClient.get<{ ok: boolean; filename: string; csv: string; count: number }>(
      `/events/${eventId}/export`
    ),
};
