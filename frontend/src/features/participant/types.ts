export type ParticipantSubScreen =
  | 'home'
  | 'search'
  | 'filter'
  | 'detail'
  | 'qr_ticket'
  | 'map_route'
  | 'notifications'
  | 'favorites'
  | 'my_events'
  | 'profile'
  | 'settings'
  | 'chat';

export type SortOptionKey =
  | 'วันที่เปิดกิจกรรม'
  | 'จำนวนผู้เข้าร่วม'
  | 'จำนวนชั่วโมงกิจกรรม';

export type ParticipantNavigatorProps = {
  subScreen: ParticipantSubScreen;
  setSubScreen: (s: ParticipantSubScreen) => void;
  events: any[];
  selectedEvent: any | null;
  onSelectEvent: (ev: any, targetScreen?: ParticipantSubScreen) => void;
  onToggleFavorite: (id: string) => void;
  onToggleRegister: (id: string) => Promise<void>;
  notifications: any[];
  onMarkNotifRead: (id: string) => void;
  chatMessages: any[];
  onSendChat: (text: string) => Promise<void>;
  recentSearches: any[];
  onAddRecentSearch: (ev: any) => void;
  userProfile: any;
  onUpdateProfile: (data: any) => Promise<void>;
  onSwitchRole: (role: 'participant' | 'organizer' | 'admin') => void;
  onLogout: () => void;
};
