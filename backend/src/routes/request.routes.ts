import { Elysia, t } from 'elysia';
import { RequestService } from '../services/request.service';

export const requestRoutes = new Elysia({ prefix: '/api/requests' })
  .get(
    '',
    ({ query }) => {
      return RequestService.listRequests({
        status: query.status,
        date: query.date,
        search: query.search,
        sort: query.sort,
      });
    },
    {
      detail: {
        tags: ['Approval Requests (Admin)'],
        summary: 'List event approval requests with status counts',
      },
    }
  )
  .get(
    '/:id',
    ({ params, set }) => {
      const req = RequestService.getRequestById(params.id);
      if (!req) {
        set.status = 404;
        return { message: 'ไม่พบคำขออนุมัติ' };
      }
      return req;
    },
    {
      detail: {
        tags: ['Approval Requests (Admin)'],
        summary: 'Get approval request details by ID or code',
      },
    }
  )
  .patch(
    '/:id/review',
    ({ params, body, set }) => {
      const result = RequestService.reviewRequest(params.id, body);
      set.status = result.status;
      return result;
    },
    {
      body: t.Object({
        status: t.Optional(t.String()),
        admin_note: t.Optional(t.String()),
        check_doc: t.Optional(t.Boolean()),
        check_info: t.Optional(t.Boolean()),
        check_venue: t.Optional(t.Boolean()),
      }),
      detail: {
        tags: ['Approval Requests (Admin)'],
        summary: 'Approve or return an event request and sync event status',
      },
    }
  );
