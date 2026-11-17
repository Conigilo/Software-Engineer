import React from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { Colors } from '../../../constants/colors';
import {
  IconArrowLeft,
  IconCalendar,
  IconLocation,
  IconUsers,
} from '../../../components/Icons';
import { OrganizerSubScreen } from '../types';
import { organizerStyles as styles } from '../styles/organizer.styles';
import { OrganizerBottomNav } from '../components/OrganizerBottomNav';

type Props = {
  subScreen: OrganizerSubScreen;
  setSubScreen: (s: OrganizerSubScreen) => void;
  venue: any;
  selectedDateLabel: string;
  hasUnread: boolean;
  onSelectVenueForEvent: (venueFullLabel: string) => void;
};

export function VenueDetailScreen({
  subScreen,
  setSubScreen,
  venue: v,
  selectedDateLabel,
  hasUnread,
  onSelectVenueForEvent,
}: Props) {
  const slots = [
    { label: '08 : 00 - 12 : 00', status: v?.slot_morning || 'ว่าง' },
    { label: '12 : 00 - 16 : 00', status: v?.slot_afternoon || 'ไม่ว่าง' },
    { label: '16 : 00 - 20 : 00', status: v?.slot_evening || 'ว่าง' },
  ];

  return (
    <View style={styles.screenContainer}>
      <View style={styles.topMenuBar}>
        <Pressable onPress={() => setSubScreen('venues')} style={styles.iconHitBox}>
          <IconArrowLeft size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.topMenuTitle}>รายละเอียดสถานที่</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 14, paddingBottom: 120 }}
      >
        <View style={styles.venueDetailDateBox}>
          <IconCalendar size={20} color={Colors.textHeading} />
          <Text style={{ fontSize: 14, fontWeight: '500', color: Colors.textHeading }}>
            {selectedDateLabel}
          </Text>
        </View>

        <Image
          source={{ uri: v?.image || '/assets/figma/51eb6.png' }}
          style={styles.venueDetailImg}
        />

        <Text style={styles.venueDetailHeading}>
          {v?.name || 'อาคารการเรียนรู้พหุวิทยาการ'}
        </Text>

        <View style={{ flexDirection: 'row', gap: 18 }}>
          <View style={styles.iconLabelRow}>
            <IconLocation size={16} color={Colors.textPrimary} />
            <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.textPrimary }}>
              {v?.code || 'N16'}
            </Text>
          </View>
          <View style={styles.iconLabelRow}>
            <IconUsers size={16} color={Colors.textPrimary} />
            <Text style={{ fontSize: 13, color: Colors.textPrimary }}>
              รองรับได้ {v?.capacity || 300} คน
            </Text>
          </View>
        </View>

        {/* Time Slots Card (Figma 121:3691) */}
        <View style={styles.timeSlotsCard}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.textHeading }}>
            ช่วงเวลาที่เปิดให้ใช้
          </Text>
          {slots.map((s) => {
            const isAvail = s.status === 'ว่าง';
            return (
              <View key={s.label} style={styles.timeSlotRow}>
                <Text style={{ fontSize: 14, color: Colors.textHeading, fontWeight: '500' }}>
                  {s.label}
                </Text>
                <View
                  style={[
                    styles.venueStatusPill,
                    { backgroundColor: isAvail ? Colors.statusSuccess : Colors.statusError },
                  ]}
                >
                  <Text style={styles.venueStatusPillText}>{s.status}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <Pressable
          onPress={() => {
            onSelectVenueForEvent(`${v.code} : ${v.name}`);
            setSubScreen('create_event');
          }}
          style={styles.submitBtn}
        >
          <Text style={styles.submitBtnText}>เลือกใช้สถานที่นี้สร้างกิจกรรม</Text>
        </Pressable>
      </ScrollView>

      <OrganizerBottomNav
        subScreen={subScreen}
        setSubScreen={setSubScreen}
        hasUnread={hasUnread}
      />
    </View>
  );
}
