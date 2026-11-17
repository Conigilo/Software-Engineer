import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Colors } from '../../../constants/colors';
import { IconArrowLeft, IconDocument } from '../../../components/Icons';
import { OrganizerSubScreen } from '../types';
import { organizerStyles as styles } from '../styles/organizer.styles';
import { OrganizerBottomNav } from '../components/OrganizerBottomNav';

type Props = {
  subScreen: OrganizerSubScreen;
  setSubScreen: (s: OrganizerSubScreen) => void;
  notifications: any[];
  onMarkNotifRead: (id: string) => void;
};

export function OrganizerNotificationsScreen({
  subScreen,
  setSubScreen,
  notifications,
  onMarkNotifRead,
}: Props) {
  const [notifFilter, setNotifFilter] = useState<'ทั้งหมด' | 'ยังไม่อ่าน'>('ทั้งหมด');

  const displayed =
    notifFilter === 'ยังไม่อ่าน'
      ? notifications.filter((n) => !n.is_read)
      : notifications;

  const hasUnread = notifications.some((n) => !n.is_read);

  return (
    <View style={styles.screenContainer}>
      <View style={styles.topMenuBar}>
        <Pressable onPress={() => setSubScreen('my_events')} style={styles.iconHitBox}>
          <IconArrowLeft size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.topMenuTitle}>การแจ้งเตือนผู้จัด</Text>
        <View style={{ width: 44 }} />
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
        contentContainerStyle={{ paddingHorizontal: 16, gap: 12, paddingBottom: 120 }}
      >
        {displayed.map((n) => (
          <Pressable
            key={n.id}
            onPress={() => {
              onMarkNotifRead(n.id);
              setSubScreen('event_status');
            }}
            style={styles.notifCard}
          >
            <View style={styles.notifIconBox}>
              <IconDocument size={20} color={Colors.brandPrimary} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={styles.notifTitle}>{n.title}</Text>
              <Text style={styles.notifTime}>{n.time_ago}</Text>
              <Text style={styles.notifBody}>{n.body}</Text>
              <Text style={styles.notifAction}>{n.action_label}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <OrganizerBottomNav
        subScreen={subScreen}
        setSubScreen={setSubScreen}
        hasUnread={hasUnread}
      />
    </View>
  );
}
