import { httpClient } from './http.client';

export const venueService = {
  getVenues: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return httpClient.get<any[]>(`/venues${qs}`);
  },
  getVenue: (id: string) => httpClient.get<any>(`/venues/${id}`),
  updateVenueSlots: (id: string, payload: any) =>
    httpClient.patch<{ ok: boolean; venue: any }>(`/venues/${id}/slots`, payload),
};

export const requestService = {
  getRequests: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return httpClient.get<{ counts: any; requests: any[] }>(`/requests${qs}`);
  },
  getRequest: (id: string) => httpClient.get<any>(`/requests/${id}`),
  reviewRequest: (id: string, payload: any) =>
    httpClient.patch<{ ok: boolean; request: any }>(`/requests/${id}/review`, payload),
};

export const supportService = {
  getNotifications: (role: string, unreadOnly?: boolean) =>
    httpClient.get<any[]>(
      `/notifications?role=${role}&unreadOnly=${unreadOnly ? 'true' : 'false'}`
    ),
  markNotificationRead: (id: string) =>
    httpClient.patch<{ ok: boolean }>(`/notifications/${id}/read`),
  getChat: () => httpClient.get<any[]>('/chat'),
  sendChat: (text: string) =>
    httpClient.post<{ ok: boolean; messages: any[] }>('/chat', { text }),
  getRecentSearches: () => httpClient.get<any[]>('/recent-searches'),
  addRecentSearch: (payload: {
    event_id: string;
    title: string;
    date_label: string;
    image: string;
  }) => httpClient.post<any[]>('/recent-searches', payload),
};

export const api = {
  ... {
    login: (email: string) =>
      httpClient.post<{ ok: boolean; user: any; code?: string; message?: string }>('/auth/login', {
        email,
      }),
    getProfile: () => httpClient.get<{ user: any; history: any[] }>('/profile'),
    updateProfile: (payload: { name?: string; organization?: string; role?: string }) =>
      httpClient.patch<any>('/profile', payload),
  },
  ...venueService,
  ...requestService,
  ...supportService,
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
