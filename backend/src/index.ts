import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { ENV } from './config/env';
import { initializeDatabase } from './db/connection';
import { loggerMiddleware } from './middlewares/logger.middleware';
import { authRoutes } from './routes/auth.routes';
import { eventRoutes } from './routes/event.routes';
import { venueRoutes } from './routes/venue.routes';
import { requestRoutes } from './routes/request.routes';
import { supportRoutes } from './routes/support.routes';

// 1. Initialize 3NF Relational SQLite Database & Seed Data
initializeDatabase();

// 2. Bootstrap ElysiaJS Application with Layered Architecture
const app = new Elysia()
  .use(cors())
  .use(loggerMiddleware)
  .use(
    swagger({
      documentation: {
        info: {
          title: 'E-MOD University Activity & Venue Platform API',
          version: '3.0.0',
          description:
            'Production-Grade Layered Architecture: Routes -> Services -> Repositories -> 3NF Relational SQLite Database (Powered by ElysiaJS & Bun)',
        },
        tags: [
          { name: 'Auth & Profile', description: 'KMUTT University SSO / Email Authentication & Profile' },
          { name: 'Events', description: 'University Activity Management, Registration & QR Check-in' },
          { name: 'Venues', description: 'Campus Venues & Normalized Time Slot Availability' },
          { name: 'Approval Requests (Admin)', description: 'Student Affairs Staff Event Review & Approval' },
          { name: 'Notifications & Support', description: 'Real-time Notifications, Support Chat & Search History' },
        ],
      },
    })
  )
  .get('/api/health', () => ({
    status: 'ok',
    service: 'E-MOD Web Application API',
    version: '3.0.0',
    architecture: 'Layered Architecture (Routes -> Services -> Repositories -> 3NF SQLite)',
  }))
  .use(authRoutes)
  .use(eventRoutes)
  .use(venueRoutes)
  .use(requestRoutes)
  .use(supportRoutes)
  .listen(ENV.PORT);

console.log(`🦊 E-MOD ElysiaJS Backend (v3.0 Layered Architecture) running at http://${app.server?.hostname}:${app.server?.port}`);
