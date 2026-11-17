import { Elysia, t } from 'elysia';
import { VenueService } from '../services/venue.service';

export const venueRoutes = new Elysia({ prefix: '/api/venues' })
  .get(
    '',
    ({ query }) => {
      return VenueService.listVenues({
        status: query.status,
        search: query.search,
        date: query.date,
      });
    },
    {
      detail: {
        tags: ['Venues'],
        summary: 'List campus venues joined with normalized time slots (morning, afternoon, evening)',
      },
    }
  )
  .get(
    '/:id',
    ({ params, set }) => {
      const venue = VenueService.getVenueById(params.id);
      if (!venue) {
        set.status = 404;
        return { message: 'ไม่พบสถานที่' };
      }
      return venue;
    },
    {
      detail: {
        tags: ['Venues'],
        summary: 'Get venue details by ID or code',
      },
    }
  )
  .patch(
    '/:id/slots',
    ({ params, body, set }) => {
      const result = VenueService.updateVenueSlots(params.id, body);
      set.status = result.status;
      return result;
    },
    {
      body: t.Object({
        slot_morning: t.Optional(t.String()),
        slot_afternoon: t.Optional(t.String()),
        slot_evening: t.Optional(t.String()),
        updated_date: t.Optional(t.String()),
        image: t.Optional(t.String()),
      }),
      detail: {
        tags: ['Venues'],
        summary: 'Update venue availability time slots in venue_time_slots table',
      },
    }
  );
