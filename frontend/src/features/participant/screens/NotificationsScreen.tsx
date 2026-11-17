import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Colors } from '../../../constants/colors';
import {
  IconArrowLeft,
  IconCheck,
  IconEdit,
  IconDocument,
} from '../../../components/Icons';
import { ParticipantSubScreen } from '../types';
import { participantStyles as styles } from '../styles/participant.styles';

type Props = {
  events: any[];
  notifications: any[];
  onMarkNotifRead: (id: string) => void;
  onSelectEvent: (ev: any, targetScreen?: ParticipantSubScreen) => void;
  setSubScreen: (s: ParticipantSubScreen) => void;
};

export function NotificationsScreen({
  events,
  notifications,
  onMarkNotifRead,
  onSelectEvent,
  setSubScreen,
}: Props) {
  const [notifFilter, setNotifFilter] = useState<'ทั้งหมด' | 'ยังไม่อ่าน'>('ทั้งหมด');

  const displayedNotifs =
    notifFilter === 'ยังไม่อ่าน'
      ? notifications.filter((n) => !n.is_read)
      : notifications;

  return (
    <View style={styles.screenContainer}>
      <View style={styles.topMenuBar}>
        <Pressable onPress={() => setSubScreen('home')} style={styles.iconHitBox}>
          <IconArrowLeft size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={[styles.topMenuTitle, { textAlign: 'left', flex: 1, marginLeft: 8 }]}>
          การแจ้งเตือน
        </Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingBottom: 12 }}>
        {(['ทั้งหมด', 'ยังไม่อ่าน'] as const).map((tab) => {
          const active = notifFilter === tab;
          return (
            <Pressable
              key={tab}
              onPress={() => setNotifFilter(tab)}
              style={[styles.filterPill, active && styles.filterPillActive]}
            >
              <Text style={[styles.filterPillText, active && styles.filterPillTextActive]}>
                {tab}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 12, paddingBottom: 32 }}
      >
        {displayedNotifs.map((n) => (
          <Pressable
            key={n.id}
            onPress={() => {
              onMarkNotifRead(n.id);
              if (n.target_event_id) {
                const target = events.find((e) => e.id === n.target_event_id);
                if (target) onSelectEvent(target, 'detail');
              }
            }}
            style={[styles.notifCard, !n.is_read && styles.notifCardUnread]}
          >
            <View style={styles.notifIconBox}>
              {n.type === 'check' ? (
                <IconCheck size={20} color={Colors.statusSuccess} />
              ) : n.type === 'edit' ? (
                <IconEdit size={20} color={Colors.brandPrimary} />
              ) : (
                <IconDocument size={20} color={Colors.textHeading} />
              )}
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={styles.notifTitle} numberOfLines={1}>
                {n.title}
              </Text>
              <Text style={styles.notifTime}>{n.time_ago}</Text>
              <Text style={styles.notifBody} numberOfLines={2}>
                {n.body}
              </Text>
              <Text style={styles.notifAction}>{n.action_label}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
