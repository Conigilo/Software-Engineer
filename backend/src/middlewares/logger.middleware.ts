import { Elysia } from 'elysia';

export const loggerMiddleware = new Elysia({ name: 'logger-middleware' })
  .derive(() => ({
    requestStartTime: performance.now(),
  }))
  .onAfterHandle(({ request, set, requestStartTime }) => {
    const durationMs = (performance.now() - (requestStartTime || performance.now())).toFixed(2);
    set.headers['X-Response-Time'] = `${durationMs}ms`;
    set.headers['X-Powered-By'] = 'E-MOD ElysiaJS + Bun SQLite 3NF';
  })
  .onError(({ code, error, set }) => {
    if (code === 'VALIDATION') {
      set.status = 400;
      return {
        ok: false,
        code: 'VALIDATION_ERROR',
        message: 'ข้อมูลที่ส่งมาไม่ถูกต้องตามโครงสร้างที่กำหนด (Schema Validation Error)',
        details: error.message,
      };
    }
    if (code === 'NOT_FOUND') {
      set.status = 404;
      return {
        ok: false,
        code: 'ENDPOINT_NOT_FOUND',
        message: 'ไม่พบ API Endpoint ที่เรียกใช้งาน',
      };
    }
    set.status = 500;
    return {
      ok: false,
      code: 'INTERNAL_SERVER_ERROR',
      message: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
    };
  });
