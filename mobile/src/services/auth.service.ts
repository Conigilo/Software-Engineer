import { httpClient } from './http.client';

export const authService = {
  login: (email: string) =>
    httpClient.post<{ ok: boolean; token?: string; user: any; code?: string; message?: string }>(
      '/auth/login',
      { email }
    ),
  getProfile: () => httpClient.get<{ user: any; history: any[] }>('/profile'),
  updateProfile: (payload: { name?: string; organization?: string; role?: string }) =>
    httpClient.patch<any>('/profile', payload),
};
