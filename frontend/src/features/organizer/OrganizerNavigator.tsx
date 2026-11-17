import React, { useState } from 'react';
import {
  OrganizerNavigatorProps,
  OrganizerStatusVariant,
} from './types';
import { OrganizerMyEventsScreen } from './screens/MyEventsScreen';
import { EventFormScreen } from './screens/EventFormScreen';
import { EventStatusScreen } from './screens/EventStatusScreen';
import { QrCheckInScreen } from './screens/QrCheckInScreen';
import { VenueListScreen } from './screens/VenueListScreen';
import { VenueDetailScreen } from './screens/VenueDetailScreen';
import { OrganizerNotificationsScreen } from './screens/OrganizerNotificationsScreen';
import { OrganizerSettingsScreen } from './screens/OrganizerSettingsScreen';

export { type OrganizerSubScreen } from './types';

export function OrganizerNavigator({
  subScreen,
  setSubScreen,
  events,
  selectedEvent,
  onSelectEvent,
  onCreateEvent,
  onUpdateEvent,
  venues,
  selectedVenue,
  onSelectVenue,
  attendees,
  onLoadAttendees,
  onScanCheckIn,
  onExportCsv,
  notifications,
  onMarkNotifRead,
  onSwitchRole,
  onLogout,
}: OrganizerNavigatorProps) {
  const [venueFull, setVenueFull] = useState('N10 : อาคารสำนักหอสมุด');
  const [statusVariant, setStatusVariant] = useState<OrganizerStatusVariant>('pending');
  const [selectedDateLabel, setSelectedDateLabel] = useState(
    'วันพุธที่ 18 พฤศจิกายน 2026'
  );

  const hasUnread = notifications.some((n) => !n.is_read);

  if (subScreen === 'create_event' || subScreen === 'edit_event') {
    return (
      <EventFormScreen
        isEdit={subScreen === 'edit_event'}
        selectedEvent={selectedEvent}
        venueFull={venueFull}
        setVenueFull={setVenueFull}
        onCreateEvent={onCreateEvent}
        onUpdateEvent={onUpdateEvent}
        setStatusVariant={setStatusVariant}
        setSubScreen={setSubScreen}
      />
    );
  }

  if (subScreen === 'event_status') {
    const ev = selectedEvent || events.find((e) => e.id === 'ev-5') || events[0];
    return (
      <EventStatusScreen
        subScreen={subScreen}
        setSubScreen={setSubScreen}
        event={ev}
        statusVariant={statusVariant}
        setStatusVariant={setStatusVariant}
        hasUnread={hasUnread}
        onExportCsv={onExportCsv}
      />
    );
  }

  if (subScreen === 'checkin') {
    const ev = selectedEvent || events.find((e) => e.id === 'ev-5') || events[0];
    return (
      <QrCheckInScreen
        event={ev}
        attendees={attendees}
        onLoadAttendees={onLoadAttendees}
        onScanCheckIn={onScanCheckIn}
        setSubScreen={setSubScreen}
      />
    );
  }

  if (subScreen === 'venues') {
    return (
      <VenueListScreen
        subScreen={subScreen}
        setSubScreen={setSubScreen}
        venues={venues}
        selectedDateLabel={selectedDateLabel}
        setSelectedDateLabel={setSelectedDateLabel}
        hasUnread={hasUnread}
        onSelectVenue={onSelectVenue}
      />
    );
  }

  if (subScreen === 'venue_detail') {
    const v = selectedVenue || venues[2] || venues[0];
    return (
      <VenueDetailScreen
        subScreen={subScreen}
        setSubScreen={setSubScreen}
        venue={v}
        selectedDateLabel={selectedDateLabel}
        hasUnread={hasUnread}
        onSelectVenueForEvent={setVenueFull}
      />
    );
  }

  if (subScreen === 'notifications') {
    return (
      <OrganizerNotificationsScreen
        subScreen={subScreen}
        setSubScreen={setSubScreen}
        notifications={notifications}
        onMarkNotifRead={onMarkNotifRead}
      />
    );
  }

  if (subScreen === 'settings') {
    return (
      <OrganizerSettingsScreen
        setSubScreen={setSubScreen}
        onSwitchRole={onSwitchRole}
        onLogout={onLogout}
      />
    );
  }

  return (
    <OrganizerMyEventsScreen
      subScreen={subScreen}
      setSubScreen={setSubScreen}
      events={events}
      hasUnread={hasUnread}
      onSelectEvent={onSelectEvent}
    />
  );
}
