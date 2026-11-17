export type UserRole = 'participant' | 'organizer' | 'admin';

export interface UserProfile {
  id: string;
  student_id: string;
  name: string;
  email: string;
  avatar: string;
  activity_hours: number;
  target_hours: number;
  organization: string;
  role: UserRole;
}

export interface EventItem {
  id: string;
  title: string;
  organization: string;
  date: string;
  time_range: string;
  start_time: string;
  end_time: string;
  location_short: string;
  venue_full: string;
  distance_km: string;
  travel_mins: number;
  hours: number;
  current_participants: number;
  max_participants: number;
  status: string;
  my_status: string;
  organizer_status: string;
  is_favorite: boolean;
  is_registered: boolean;
  tags: string[];
  image: string;
  gallery: string[];
  description: string;
  rating?: number;
  review_count?: number;
  pdf_name?: string;
}

export interface VenueItem {
  id: string;
  code: string;
  name: string;
  zone: string;
  distance_label: string;
  capacity_label: string;
  max_capacity: number;
  status: string;
  slot_morning: string;
  slot_afternoon: string;
  slot_evening: string;
  updated_date: string;
  image: string;
  description: string;
}

export interface ApprovalRequestItem {
  id: string;
  request_code: string;
  event_id: string;
  title: string;
  organization: string;
  submitted_date: string;
  event_date: string;
  start_time: string;
  end_time: string;
  hours: number;
  venue_id: string;
  venue_name: string;
  max_participants: number;
  expected_participants: string;
  tags: string[];
  description: string;
  pdf_name: string;
  image: string;
  requester_name: string;
  requester_role: string;
  requester_email: string;
  requester_phone: string;
  status: 'รออนุมัติ' | 'อนุมัติแล้ว' | 'ส่งกลับแก้ไข' | string;
  admin_note: string;
  check_doc: boolean;
  check_info: boolean;
  check_venue: boolean;
  reviewed_at: string;
  reviewed_by: string;
}

export interface NotificationItem {
  id: string;
  role_target: string;
  type: string;
  title: string;
  time_ago: string;
  body: string;
  is_read: boolean;
  action_label?: string;
  target_event_id?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  subtext?: string | null;
  time: string;
}
