import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { IconBell, IconHeart } from '../../../components/Icons';
import { ParticipantSubScreen } from '../types';
import { participantStyles as styles } from '../styles/participant.styles';
import { ParticipantEventCard } from '../components/ParticipantEventCard';
import { ParticipantBottomNav } from '../components/ParticipantBottomNav';

type Props = {
  subScreen: ParticipantSubScreen;
  setSubScreen: (s: ParticipantSubScreen) => void;
  favoriteEvents: any[];
  unreadCount: number;
  onSelectEvent: (ev: any, targetScreen?: ParticipantSubScreen) => void;
  onToggleFavorite: (id: string) => void;
};

export function FavoritesScreen({
  subScreen,
  setSubScreen,
  favoriteEvents,
  unreadCount,
  onSelectEvent,
  onToggleFavorite,
}: Props) {
  return (
    <View style={styles.screenContainer}>
      <View style={styles.topMenuBar}>
        <View style={{ width: 44 }} />
        <Text style={styles.topMenuTitle}>รายการโปรด</Text>
        <Pressable onPress={() => setSubScreen('notifications')} style={styles.iconHitBoxEnd}>
          <IconBell size={24} hasBadge={unreadCount > 0} />
        </Pressable>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 16, paddingBottom: 120 }}
      >
        {favoriteEvents.map((ev) => (
          <ParticipantEventCard
            key={ev.id}
            event={ev}
            onPress={() => onSelectEvent(ev, 'detail')}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
        {favoriteEvents.length === 0 && (
          <View style={{ alignItems: 'center', marginTop: 64, gap: 8 }}>
            <IconHeart size={40} active={false} />
            <Text style={styles.emptyText}>ยังไม่มีกิจกรรมในรายการโปรด</Text>
            <Pressable onPress={() => setSubScreen('home')} style={styles.filterPillActive}>
              <Text
                style={[
                  styles.filterPillTextActive,
                  { paddingHorizontal: 16, paddingVertical: 8 },
                ]}
              >
                ไปหน้ารวมกิจกรรม
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
      <ParticipantBottomNav subScreen={subScreen} setSubScreen={setSubScreen} />
    </View>
  );
}
