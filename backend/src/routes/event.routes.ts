import { Elysia, t } from 'elysia';
import { EventService } from '../services/event.service';

export const eventRoutes = new Elysia({ prefix: '/api/events' })
  .get(
    '',
    ({ query }) => {
      return EventService.listEvents({
        status: query.status,
        myStatus: query.myStatus,
        favorite: query.favorite,
        registered: query.registered,
        category: query.category,
        search: query.search,
        sortBy: query.sortBy,
      });
    },
    {
      detail: {
        tags: ['Events'],
        summary: 'Query events with relational JOINs (categories, gallery, registrations, favorites)',
      },
    }
  )
  .get(
    '/:id',
    ({ params, set }) => {
      const event = EventService.getEventById(params.id);
      if (!event) {
        set.status = 404;
        return { message: 'ไม่พบกิจกรรม' };
      }
      return event;
    },
    {
      detail: {
        tags: ['Events'],
        summary: 'Get event detail by ID',
      },
    }
  )
  .post(
    '',
    ({ body, set }) => {
      const result = EventService.createEventProposal({
        title: body.title,
        organization: body.organization,
        description: body.description,
        date: body.date,
        start_time: body.start_time,
        end_time: body.end_time,
        venue_full: body.venue_full,
        max_participants: body.max_participants ? Number(body.max_participants) : 30,
        hours: body.hours ? Number(body.hours) : 3,
        tags: body.tags,
        image: body.image,
        pdf_name: body.pdf_name,
      });
      set.status = result.status;
      return result;
    },
    {
      body: t.Object({
        title: t.String(),
        organization: t.String(),
        description: t.String(),
        date: t.Optional(t.String()),
        start_time: t.Optional(t.String()),
        end_time: t.Optional(t.String()),
        venue_full: t.Optional(t.String()),
        max_participants: t.Optional(t.Numeric()),
        hours: t.Optional(t.Numeric()),
        tags: t.Optional(t.Array(t.String())),
        image: t.Optional(t.String()),
        pdf_name: t.Optional(t.String()),
      }),
      detail: {
        tags: ['Events'],
        summary: 'Create new event proposal & approval request',
      },
    }
  )
  .put(
    '/:id',
    ({ params, body, set }) => {
      const result = EventService.updateEventDetails(params.id, body);
      set.status = result.status;
      return result;
    },
    {
      body: t.Object({
        title: t.Optional(t.String()),
        description: t.Optional(t.String()),
        date: t.Optional(t.String()),
        time_range: t.Optional(t.String()),
        start_time: t.Optional(t.String()),
        end_time: t.Optional(t.String()),
        venue_full: t.Optional(t.String()),
        max_participants: t.Optional(t.Numeric()),
        hours: t.Optional(t.Numeric()),
        organization: t.Optional(t.String()),
        organizer_status: t.Optional(t.String()),
      }),
      detail: {
        tags: ['Events'],
        summary: 'Update existing event details',
      },
    }
  )
  .post(
    '/:id/favorite',
    ({ params, set }) => {
      const result = EventService.toggleFavorite(params.id);
      set.status = result.status;
      return result;
    },
    {
      detail: {
        tags: ['Events'],
        summary: 'Toggle event bookmark/favorite',
      },
    }
  )
  .post(
    '/:id/register',
    ({ params, set }) => {
      const result = EventService.toggleRegistration(params.id);
      set.status = result.status;
      return result;
    },
    {
      detail: {
        tags: ['Events'],
        summary: 'Register or cancel event participation',
      },
    }
  )
  .get(
    '/:id/attendees',
    ({ params }) => {
      return EventService.getEventAttendees(params.id);
    },
    {
      detail: {
        tags: ['Events'],
        summary: 'Get QR checked-in attendees for an event',
      },
    }
  )
  .post(
    '/:id/checkin',
    ({ params, body }) => {
      return EventService.checkInAttendee(params.id, body.student_id, body.name);
    },
    {
      body: t.Object({
        student_id: t.Optional(t.String()),
        name: t.Optional(t.String()),
      }),
      detail: {
        tags: ['Events'],
        summary: 'Record QR check-in for an attendee',
      },
    }
  )
  .get(
    '/:id/export',
    ({ params }) => {
      return EventService.exportAttendeesCsv(params.id);
    },
    {
      detail: {
        tags: ['Events'],
        summary: 'Export checked-in attendees as CSV',
      },
    }
  );
