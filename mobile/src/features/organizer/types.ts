export type OrganizerSubScreen =
  | 'my_events'
  | 'create_event'
  | 'edit_event'
  | 'event_status'
  | 'checkin'
  | 'venues'
  | 'venue_detail'
  | 'notifications'
  | 'settings';

export type OrganizerStatusVariant = 'pending' | 'approved' | 'export_ready' | 'rejected';

export type OrganizerNavigatorProps = {
  subScreen: OrganizerSubScreen;
  setSubScreen: (s: OrganizerSubScreen) => void;
  events: any[];
  selectedEvent: any | null;
  onSelectEvent: (ev: any, target?: OrganizerSubScreen) => void;
  onCreateEvent: (payload: any) => Promise<{ event: any; requestCode: string }>;
  onUpdateEvent: (id: string, payload: any) => Promise<void>;
  venues: any[];
  selectedVenue: any | null;
  onSelectVenue: (v: any) => void;
  attendees: any[];
  onLoadAttendees: (eventId: string) => Promise<void>;
  onScanCheckIn: (eventId: string, name?: string) => Promise<void>;
  onExportCsv: (eventId: string) => Promise<void>;
  notifications: any[];
  onMarkNotifRead: (id: string) => void;
  onSwitchRole: (role: 'participant' | 'organizer' | 'admin') => void;
  onLogout: () => void;
};
