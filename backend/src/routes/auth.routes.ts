import { Elysia, t } from 'elysia';
import { AuthService } from '../services/auth.service';

export const authRoutes = new Elysia({ prefix: '/api' })
  .post(
    '/auth/login',
    ({ body, set }) => {
      const result = AuthService.loginWithUniversityEmail(body.email);
      set.status = result.status;
      if (!result.ok) {
        return {
          ok: false,
          code: result.code,
          message: result.message,
        };
      }
      return {
        ok: true,
        token: result.token,
        user: result.user,
      };
    },
    {
      body: t.Object({
        email: t.String(),
      }),
      detail: {
        tags: ['Auth & Profile'],
        summary: 'Login with KMUTT University Email (@kmutt.ac.th)',
      },
    }
  )
  .get(
    '/profile',
    () => {
      return AuthService.getCurrentProfile();
    },
    {
      detail: {
        tags: ['Auth & Profile'],
        summary: 'Get current user profile & registered event history',
      },
    }
  )
  .patch(
    '/profile',
    ({ body }) => {
      return AuthService.updateProfile(body);
    },
    {
      body: t.Object({
        name: t.Optional(t.String()),
        organization: t.Optional(t.String()),
        role: t.Optional(t.String()),
      }),
      detail: {
        tags: ['Auth & Profile'],
        summary: 'Update user profile & organization',
      },
    }
  );
