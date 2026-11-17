import React from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { Colors } from '../../../constants/colors';
import {
  IconPlus,
  IconSetting,
  IconCalendar,
  IconLocation,
  IconEdit,
  IconScan,
} from '../../../components/Icons';
import { OrganizerSubScreen } from '../types';
import { organizerStyles as styles } from '../styles/organizer.styles';
import { OrganizerBottomNav } from '../components/OrganizerBottomNav';

type Props = {
  subScreen: OrganizerSubScreen;
  setSubScreen: (s: OrganizerSubScreen) => void;
  events: any[];
  hasUnread: boolean;
  onSelectEvent: (ev: any, target?: OrganizerSubScreen) => void;
};

export function OrganizerMyEventsScreen({
  subScreen,
  setSubScreen,
  events,
  hasUnread,
  onSelectEvent,
}: Props) {
  const organizerEvents = events
    .slice(4, 9)
    .concat(events.filter((e) => Number(e.id.split('-')[1]) > 100));

  return (
    <View style={styles.screenContainer}>
      {/* Top Menu Bar (Figma 121:3620) */}
      <View style={styles.topMenuBar}>
        <Pressable onPress={() => setSubScreen('create_event')} style={styles.iconHitBox}>
          <IconPlus size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.topMenuTitle}>กิจกรรมของฉัน</Text>
        <Pressable onPress={() => setSubScreen('settings')} style={styles.iconHitBoxEnd}>
          <IconSetting size={24} color={Colors.textPrimary} />
        </Pressable>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 120,
          gap: 12,
        }}
      >
        {organizerEvents.map((ev) => {
          const orgStatus = ev.organizer_status || 'กำลังดำเนินการ...';
          const statusColor =
            orgStatus === 'กำลังดำเนินการ...'
              ? Colors.statusSuccess
              : orgStatus === 'ใกล้ถึงแล้ว' || orgStatus === 'รอเจ้าหน้าที่อนุมัติ'
              ? Colors.statusWarning
              : Colors.textPlaceholder;
          const ratio = Math.min(1, ev.current_participants / Math.max(1, ev.max_participants));

          return (
            <View key={ev.id} style={styles.orgEventCard}>
              {/* Left Thumbnail + Bottom Pill Badge (Figma 8150:14236) */}
              <View style={{ width: 112, gap: 8 }}>
                <Pressable onPress={() => onSelectEvent(ev, 'event_status')}>
                  <Image
                    source={{ uri: ev.image }}
                    style={styles.orgEventThumb}
                    resizeMode="cover"
                  />
                </Pressable>
                <Pressable
                  onPress={() => onSelectEvent(ev, 'event_status')}
                  style={[styles.orgThumbBadge, { backgroundColor: statusColor }]}
                >
                  <Text style={styles.orgThumbBadgeText} numberOfLines={1}>
                    {orgStatus}
                  </Text>
                </Pressable>
              </View>

              {/* Right Content */}
              <View style={{ flex: 1, justifyContent: 'space-between', gap: 6 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <View style={styles.iconLabelRow}>
                    <IconCalendar size={15} color={Colors.textSecondary} />
                    <Text style={{ fontSize: 12, color: Colors.textSecondary }}>{ev.date}</Text>
                  </View>
                  <Pressable onPress={() => onSelectEvent(ev, 'event_status')}>
                    <Text
                      style={{ fontSize: 12, color: Colors.brandPrimary, fontWeight: '600' }}
                    >
                      สถานะ ⋮
                    </Text>
                  </Pressable>
                </View>

                <Pressable onPress={() => onSelectEvent(ev, 'event_status')}>
                  <Text style={styles.orgEventTitle} numberOfLines={1}>
                    {ev.title}
                  </Text>
                </Pressable>

                <View style={styles.iconLabelRow}>
                  <IconLocation size={15} color={Colors.textMuted} />
                  <Text style={{ fontSize: 12, color: Colors.textMuted }} numberOfLines={1}>
                    {ev.venue_name}
                  </Text>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${Math.max(15, Math.round(ratio * 100))}%` as any },
                    ]}
                  />
                </View>

                {/* Edit + Start Check-in Buttons (Figma 8150:14139) */}
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 2 }}>
                  <Pressable
                    onPress={() => onSelectEvent(ev, 'edit_event')}
                    style={styles.orgEditBtn}
                  >
                    <IconEdit size={18} color={Colors.textPrimary} />
                    <Text style={styles.orgEditBtnText}>แก้ไข</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => onSelectEvent(ev, 'checkin')}
                    style={styles.orgScanBtn}
                  >
                    <IconScan size={18} color="#FFFFFF" />
                    <Text style={styles.orgScanBtnText}>เริ่มเช็คชื่อ</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <OrganizerBottomNav
        subScreen={subScreen}
        setSubScreen={setSubScreen}
        hasUnread={hasUnread}
      />
    </View>
  );
}
