import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { Colors } from '../../../constants/colors';
import {
  IconBell,
  IconCalendar,
  IconChevronRight,
} from '../../../components/Icons';
import { ParticipantSubScreen } from '../types';
import { participantStyles as styles } from '../styles/participant.styles';
import { ParticipantBottomNav } from '../components/ParticipantBottomNav';

type Props = {
  subScreen: ParticipantSubScreen;
  setSubScreen: (s: ParticipantSubScreen) => void;
  events: any[];
  unreadCount: number;
  onSelectEvent: (ev: any, targetScreen?: ParticipantSubScreen) => void;
};

export function MyEventsScreen({
  subScreen,
  setSubScreen,
  events,
  unreadCount,
  onSelectEvent,
}: Props) {
  const [myEventFilter, setMyEventFilter] = useState<
    'ทั้งหมด' | 'ยังไม่ถึง' | 'กำลังดำเนินอยู่' | 'จบแล้ว'
  >('ทั้งหมด');

  const tabs: Array<'ทั้งหมด' | 'ยังไม่ถึง' | 'กำลังดำเนินอยู่' | 'จบแล้ว'> = [
    'ทั้งหมด',
    'ยังไม่ถึง',
    'กำลังดำเนินอยู่',
    'จบแล้ว',
  ];

  const myRegisteredEvents = events.filter((e) => {
    if (!e.is_registered) return false;
    if (myEventFilter === 'ทั้งหมด') return true;
    return e.my_event_status === myEventFilter;
  });

  return (
    <View style={styles.screenContainer}>
      <View style={styles.topMenuBar}>
        <View style={{ width: 44 }} />
        <Text style={styles.topMenuTitle}>กิจกรรมของฉัน</Text>
        <Pressable onPress={() => setSubScreen('notifications')} style={styles.iconHitBoxEnd}>
          <IconBell size={24} hasBadge={unreadCount > 0} />
        </Pressable>
      </View>

      <View style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
        >
          {tabs.map((tab) => {
            const active = myEventFilter === tab;
            return (
              <Pressable
                key={tab}
                onPress={() => setMyEventFilter(tab)}
                style={[styles.filterPill, active && styles.filterPillActive]}
              >
                <Text style={[styles.filterPillText, active && styles.filterPillTextActive]}>
                  {tab}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 14, paddingBottom: 120 }}
      >
        {myRegisteredEvents.map((ev) => {
          const statusLabel = ev.my_event_status || 'กำลังดำเนินอยู่';
          const badgeColor =
            statusLabel === 'กำลังดำเนินอยู่'
              ? Colors.statusSuccess
              : statusLabel === 'ยังไม่ถึง'
              ? Colors.statusWarning
              : Colors.darkGray;

          return (
            <Pressable
              key={ev.id}
              onPress={() => onSelectEvent(ev, 'qr_ticket')}
              style={styles.myEventCard}
            >
              <Image source={{ uri: ev.image }} style={styles.myEventImg} resizeMode="cover" />
              <View style={{ flex: 1, gap: 6 }}>
                <View style={[styles.statusBadgePill, { backgroundColor: badgeColor }]}>
                  <Text style={styles.statusBadgeText}>{statusLabel}</Text>
                </View>
                <Text style={styles.eventTitleText} numberOfLines={1}>
                  {ev.title}
                </Text>
                <View style={styles.iconLabelRow}>
                  <IconCalendar size={15} color={Colors.textMuted} />
                  <Text style={styles.eventMetaText}>{ev.date}</Text>
                </View>
              </View>
              <IconChevronRight size={20} color={Colors.textPrimary} />
            </Pressable>
          );
        })}
      </ScrollView>

      <ParticipantBottomNav subScreen={subScreen} setSubScreen={setSubScreen} />
    </View>
  );
}
