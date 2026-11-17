export const ENV = {
  PORT: Number(process.env.PORT || 3001),
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_PATH: process.env.DB_PATH || 'emod.sqlite',
  JWT_SECRET: process.env.JWT_SECRET || 'kmutt-emod-secret-key-2026',
  ALLOWED_EMAIL_DOMAINS: ['@kmutt.ac.th', '@mail.kmutt.ac.th', '@university.ac.th'],
};
