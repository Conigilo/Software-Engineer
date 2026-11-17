export type AdminPage = 'venues' | 'requests' | 'review';

export type AdminSlotKey =
  | '08:00 – 12:00 น.'
  | '12:00 – 16:00 น.'
  | '16:00 – 20:00 น.';

export type AdminModalType =
  | null
  | 'confirm_approve'
  | 'approved_done'
  | 'confirm_return'
  | 'returned_done'
  | 'preset_notes'
  | 'doc_preview'
  | 'doc_page2'
  | 'logout_confirm'
  | 'search_requests_preset'
  | 'filter_date_preset'
  | 'sort_requests_preset'
  | 'select_venue_modal'
  | 'search_venue_preset'
  | 'select_timeslot_modal'
  | 'select_venue_date_modal'
  | 'venue_saved_modal'
  | 'upload_venue_image_modal';

export type AdminWebPortalProps = {
  page: AdminPage;
  setPage: (p: AdminPage) => void;
  venues: any[];
  onUpdateVenueSlots: (id: string, payload: any) => Promise<void>;
  requestsData: { counts: any; requests: any[] };
  selectedRequest: any | null;
  onSelectRequest: (req: any) => void;
  onReviewRequest: (id: string, payload: any) => Promise<void>;
  onLogout: () => void;
};
