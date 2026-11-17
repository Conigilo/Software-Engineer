import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Colors } from '../../../constants/colors';
import {
  IconBell,
  IconSearch,
  IconFunnel,
  IconMessage,
} from '../../../components/Icons';
import { ParticipantSubScreen } from '../types';
import { participantStyles as styles } from '../styles/participant.styles';
import { ParticipantEventCard } from '../components/ParticipantEventCard';
import { ParticipantBottomNav } from '../components/ParticipantBottomNav';

type Props = {
  subScreen: ParticipantSubScreen;
  setSubScreen: (s: ParticipantSubScreen) => void;
  filteredEvents: any[];
  statusFilter: 'ทั้งหมด' | 'เปิดแล้ว' | 'กำลังจะเปิด';
  setStatusFilter: (s: 'ทั้งหมด' | 'เปิดแล้ว' | 'กำลังจะเปิด') => void;
  searchQuery: string;
  selectedCategories: string[];
  setSelectedCategories: (cats: string[]) => void;
  unreadCount: number;
  onSelectEvent: (ev: any, targetScreen?: ParticipantSubScreen) => void;
  onToggleFavorite: (id: string) => void;
};

export function HomeScreen({
  subScreen,
  setSubScreen,
  filteredEvents,
  statusFilter,
  setStatusFilter,
  searchQuery,
  selectedCategories,
  setSelectedCategories,
  unreadCount,
  onSelectEvent,
  onToggleFavorite,
}: Props) {
  return (
    <View style={styles.screenContainer}>
      {/* Top Menu Bar (Figma 121:3535) */}
      <View style={styles.topMenuBar}>
        <View style={{ width: 44 }} />
        <Text style={styles.topMenuTitle}>E-MOD</Text>
        <Pressable onPress={() => setSubScreen('notifications')} style={styles.iconHitBoxEnd}>
          <IconBell size={24} hasBadge={unreadCount > 0} />
        </Pressable>
      </View>

      {/* Search & Funnel Row (Figma 121:3536) */}
      <View style={styles.homeSearchRow}>
        <Pressable onPress={() => setSubScreen('search')} style={[styles.searchBox, { flex: 1 }]}>
          <IconSearch size={20} color={Colors.textGray} />
          <Text style={styles.searchPlaceholder}>
            {searchQuery ? searchQuery : 'ค้นหา'}
          </Text>
        </Pressable>
        <Pressable onPress={() => setSubScreen('filter')} style={styles.funnelButton}>
          <IconFunnel size={22} color={Colors.textPrimary} />
        </Pressable>
      </View>

      {/* Status Filter Pills (Figma 8223:5209) */}
      <View style={styles.filterPillsRow}>
        {(['ทั้งหมด', 'เปิดแล้ว', 'กำลังจะเปิด'] as const).map((st) => {
          const active = statusFilter === st;
          return (
            <Pressable
              key={st}
              onPress={() => setStatusFilter(st)}
              style={[styles.filterPill, active && styles.filterPillActive]}
            >
              <Text style={[styles.filterPillText, active && styles.filterPillTextActive]}>
                {st}
              </Text>
            </Pressable>
          );
        })}
        {!selectedCategories.includes('ทั้งหมด') && (
          <Pressable
            onPress={() => setSelectedCategories(['ทั้งหมด'])}
            style={[styles.filterPill, { borderColor: Colors.brandPrimary }]}
          >
            <Text style={{ fontSize: 12, color: Colors.brandPrimary, fontWeight: '600' }}>
              หมวดหมู่ ({selectedCategories.length}) ✕
            </Text>
          </Pressable>
        )}
      </View>

      {/* Event Cards Vertical Scroll (Figma 6004:2149) */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 140, gap: 16 }}
      >
        {filteredEvents.map((ev) => (
          <ParticipantEventCard
            key={ev.id}
            event={ev}
            onPress={() => onSelectEvent(ev, 'detail')}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
        {filteredEvents.length === 0 && (
          <Text style={styles.emptyText}>ไม่พบกิจกรรมในหมวดหมู่ที่เลือก</Text>
        )}
      </ScrollView>

      {/* Floating Chat Button (Figma 6026:4415) */}
      <Pressable onPress={() => setSubScreen('chat')} style={styles.floatingChatFab}>
        <IconMessage size={24} color="#FFFFFF" />
      </Pressable>

      {/* Bottom Navigation (Figma 121:3549) */}
      <ParticipantBottomNav subScreen={subScreen} setSubScreen={setSubScreen} />
    </View>
  );
}
