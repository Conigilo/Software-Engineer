import { ENV } from '../config/env';
import { UserRepository } from '../repositories/user.repository';
import { EventRepository } from '../repositories/event.repository';

export class AuthService {
  static loginWithUniversityEmail(rawEmail: string) {
    const email = (rawEmail || '').trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      return {
        ok: false as const,
        status: 400,
        code: 'INVALID_FORMAT',
        message: 'รูปแบบอีเมลไม่ถูกต้อง กรุณากรอกอีเมลให้ถูกต้อง (เช่น student@kmutt.ac.th)',
      };
    }

    const isUniversityEmail = ENV.ALLOWED_EMAIL_DOMAINS.some((domain) => email.endsWith(domain));
    if (!isUniversityEmail) {
      return {
        ok: false as const,
        status: 400,
        code: 'UNIVERSITY_EMAIL_REQUIRED',
        message: 'ต้องใช้อีเมลมหาวิทยาลัย (@kmutt.ac.th) เท่านั้นในการเข้าสู่ระบบ',
      };
    }

    const existingUser = UserRepository.findByEmail(email);
    const fallbackUser = UserRepository.findProfile();
    const user = existingUser || {
      ...fallbackUser,
      email,
    };

    // Generate stateless session token for Web Application auth header
    const tokenPayload = Buffer.from(
      JSON.stringify({
        sub: user.id,
        email: user.email,
        role: user.role,
        iat: Date.now(),
      })
    ).toString('base64url');

    return {
      ok: true as const,
      status: 200,
      token: `emod.${tokenPayload}`,
      user,
    };
  }

  static getCurrentProfile() {
    const user = UserRepository.findProfile();
    const history = EventRepository.findAll({ registered: 'true' });
    return { user, history };
  }

  static updateProfile(data: { name?: string; organization?: string; role?: string }) {
    return UserRepository.updateProfile(data);
  }
}
