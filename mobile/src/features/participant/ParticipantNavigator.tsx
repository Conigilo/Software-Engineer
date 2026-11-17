import React, { useState } from 'react';
import { ParticipantNavigatorProps, SortOptionKey } from './types';
import { HomeScreen } from './screens/HomeScreen';
import { SearchScreen } from './screens/SearchScreen';
import { FilterScreen } from './screens/FilterScreen';
import { EventDetailScreen } from './screens/EventDetailScreen';
import { QrTicketScreen } from './screens/QrTicketScreen';
import { MapRouteScreen } from './screens/MapRouteScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { FavoritesScreen } from './screens/FavoritesScreen';
import { MyEventsScreen } from './screens/MyEventsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { SupportChatScreen } from './screens/SupportChatScreen';

export { type ParticipantSubScreen } from './types';

export function ParticipantNavigator({
  subScreen,
  setSubScreen,
  events,
  selectedEvent,
  onSelectEvent,
  onToggleFavorite,
  onToggleRegister,
  notifications,
  onMarkNotifRead,
  chatMessages,
  onSendChat,
  recentSearches,
  onAddRecentSearch,
  userProfile,
  onUpdateProfile,
  onSwitchRole,
  onLogout,
}: ParticipantNavigatorProps) {
  const [statusFilter, setStatusFilter] = useState<'ทั้งหมด' | 'เปิดแล้ว' | 'กำลังจะเปิด'>('ทั้งหมด');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOptionKey>('วันที่เปิดกิจกรรม');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['ทั้งหมด']);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const filteredEvents = events
    .filter((ev) => {
      if (statusFilter !== 'ทั้งหมด' && ev.status !== statusFilter) return false;
      if (!selectedCategories.includes('ทั้งหมด')) {
        const hasCat = (ev.tags || []).some((t: string) => selectedCategories.includes(t));
        if (!hasCat) return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.trim().toLowerCase();
        return (
          ev.title.toLowerCase().includes(q) ||
          ev.venue_full.toLowerCase().includes(q) ||
          ev.description.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'จำนวนผู้เข้าร่วม') return b.current_participants - a.current_participants;
      if (sortBy === 'จำนวนชั่วโมงกิจกรรม') return b.hours - a.hours;
      return 0;
    });

  const favoriteEvents = events.filter((e) => e.is_favorite);

  const toggleCategoryChip = (cat: string) => {
    if (cat === 'ทั้งหมด') {
      setSelectedCategories(['ทั้งหมด']);
      return;
    }
    setSelectedCategories((prev) => {
      const withoutAll = prev.filter((c) => c !== 'ทั้งหมด');
      if (withoutAll.includes(cat)) {
        const next = withoutAll.filter((c) => c !== cat);
        return next.length === 0 ? ['ทั้งหมด'] : next;
      }
      return [...withoutAll, cat];
    });
  };

  if (subScreen === 'search') {
    return (
      <SearchScreen
        events={events}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        recentSearches={recentSearches}
        onAddRecentSearch={onAddRecentSearch}
        onSelectEvent={onSelectEvent}
        setSubScreen={setSubScreen}
      />
    );
  }

  if (subScreen === 'filter') {
    return (
      <FilterScreen
        sortBy={sortBy}
        setSortBy={setSortBy}
        selectedCategories={selectedCategories}
        onToggleCategoryChip={toggleCategoryChip}
        setSubScreen={setSubScreen}
      />
    );
  }

  if (subScreen === 'detail' && selectedEvent) {
    const ev = events.find((e) => e.id === selectedEvent.id) || selectedEvent;
    return (
      <EventDetailScreen
        event={ev}
        unreadCount={unreadCount}
        onToggleFavorite={onToggleFavorite}
        onToggleRegister={onToggleRegister}
        setSubScreen={setSubScreen}
      />
    );
  }

  if (subScreen === 'qr_ticket') {
    const ev = selectedEvent || events.find((e) => e.id === 'ev-5') || events[0];
    return (
      <QrTicketScreen
        event={ev}
        unreadCount={unreadCount}
        setSubScreen={setSubScreen}
      />
    );
  }

  if (subScreen === 'map_route') {
    const ev = selectedEvent || events[0];
    return <MapRouteScreen event={ev} setSubScreen={setSubScreen} />;
  }

  if (subScreen === 'notifications') {
    return (
      <NotificationsScreen
        events={events}
        notifications={notifications}
        onMarkNotifRead={onMarkNotifRead}
        onSelectEvent={onSelectEvent}
        setSubScreen={setSubScreen}
      />
    );
  }

  if (subScreen === 'favorites') {
    return (
      <FavoritesScreen
        subScreen={subScreen}
        setSubScreen={setSubScreen}
        favoriteEvents={favoriteEvents}
        unreadCount={unreadCount}
        onSelectEvent={onSelectEvent}
        onToggleFavorite={onToggleFavorite}
      />
    );
  }

  if (subScreen === 'my_events') {
    return (
      <MyEventsScreen
        subScreen={subScreen}
        setSubScreen={setSubScreen}
        events={events}
        unreadCount={unreadCount}
        onSelectEvent={onSelectEvent}
      />
    );
  }

  if (subScreen === 'profile') {
    return (
      <ProfileScreen
        subScreen={subScreen}
        setSubScreen={setSubScreen}
        events={events}
        userProfile={userProfile}
        onUpdateProfile={onUpdateProfile}
        onSelectEvent={onSelectEvent}
      />
    );
  }

  if (subScreen === 'settings') {
    return (
      <SettingsScreen
        setSubScreen={setSubScreen}
        onSwitchRole={onSwitchRole}
        onLogout={onLogout}
      />
    );
  }

  if (subScreen === 'chat') {
    return (
      <SupportChatScreen
        chatMessages={chatMessages}
        onSendChat={onSendChat}
        setSubScreen={setSubScreen}
      />
    );
  }

  return (
    <HomeScreen
      subScreen={subScreen}
      setSubScreen={setSubScreen}
      filteredEvents={filteredEvents}
      statusFilter={statusFilter}
      setStatusFilter={setStatusFilter}
      searchQuery={searchQuery}
      selectedCategories={selectedCategories}
      setSelectedCategories={setSelectedCategories}
      unreadCount={unreadCount}
      onSelectEvent={onSelectEvent}
      onToggleFavorite={onToggleFavorite}
    />
  );
}
