import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Image } from 'react-native';
import { Colors } from '../../../constants/colors';
import {
  IconArrowLeft,
  IconSetting,
  IconSearch,
  IconCalendar,
  IconLocation,
  IconUsers,
  IconClock,
} from '../../../components/Icons';
import { OrganizerSubScreen } from '../types';
import { organizerStyles as styles } from '../styles/organizer.styles';
import { OrganizerBottomNav } from '../components/OrganizerBottomNav';

type Props = {
  subScreen: OrganizerSubScreen;
  setSubScreen: (s: OrganizerSubScreen) => void;
  venues: any[];
  selectedDateLabel: string;
  setSelectedDateLabel: (d: string) => void;
  hasUnread: boolean;
  onSelectVenue: (v: any) => void;
};

export function VenueListScreen({
  subScreen,
  setSubScreen,
  venues,
  selectedDateLabel,
  setSelectedDateLabel,
  hasUnread,
  onSelectVenue,
}: Props) {
  const [venueFilter, setVenueFilter] = useState<'ทั้งหมด' | 'ว่าง' | 'ว่างบางส่วน' | 'ไม่ว่าง'>('ทั้งหมด');
  const [venueSearch, setVenueSearch] = useState('');
  const [showCalendarPicker, setShowCalendarPicker] = useState(false);

  const filteredVenues = venues.filter((v) => {
    if (venueFilter !== 'ทั้งหมด' && v.status !== venueFilter) return false;
    if (venueSearch.trim() !== '') {
      const q = venueSearch.trim().toLowerCase();
      return v.name.toLowerCase().includes(q) || v.code.toLowerCase().includes(q);
    }
    return true;
  });

  const availableCount = venues.filter((v) => v.status !== 'ไม่ว่าง').length;

  return (
    <View style={styles.screenContainer}>
      <View style={styles.topMenuBar}>
        <Pressable onPress={() => setSubScreen('my_events')} style={styles.iconHitBox}>
          <IconArrowLeft size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.topMenuTitle}>สถานที่</Text>
        <Pressable onPress={() => setSubScreen('settings')} style={styles.iconHitBoxEnd}>
          <IconSetting size={24} color={Colors.textPrimary} />
        </Pressable>
      </View>

      {/* Search + Calendar Button (Figma 121:3661) */}
      <View style={styles.venueSearchRow}>
        <View style={[styles.searchBox, { flex: 1 }]}>
          <IconSearch size={18} color={Colors.textGray} />
          <TextInput
            value={venueSearch}
            onChangeText={setVenueSearch}
            placeholder="ค้นหาอาคารหรือรหัสสถานที่ (เช่น N7, N16)"
            placeholderTextColor={Colors.textGray}
            style={styles.searchInput}
          />
        </View>
        <Pressable
          onPress={() => setShowCalendarPicker(!showCalendarPicker)}
          style={styles.calendarIconBtn}
        >
          <IconCalendar size={22} color={Colors.textHeading} />
        </Pressable>
      </View>

      {/* Date Picker Dropdown */}
      {showCalendarPicker && (
        <View style={styles.calendarPopupCard}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: Colors.textGray }}>
            เลือกวันที่ต้องการตรวจสอบสถานที่ว่าง:
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {[
              'วันพุธที่ 18 พฤศจิกายน 2026',
              'วันพฤหัสบดีที่ 19 พฤศจิกายน 2026',
              'วันอังคารที่ 24 พฤศจิกายน 2026',
            ].map((d) => (
              <Pressable
                key={d}
                onPress={() => {
                  setSelectedDateLabel(d);
                  setShowCalendarPicker(false);
                }}
                style={[
                  styles.filterPill,
                  selectedDateLabel === d && styles.filterPillActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    selectedDateLabel === d && styles.filterPillTextActive,
                  ]}
                >
                  {d}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {/* Availability Filter Pills */}
      <View style={{ paddingHorizontal: 16, paddingBottom: 10 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
        >
          {(['ทั้งหมด', 'ว่าง', 'ว่างบางส่วน', 'ไม่ว่าง'] as const).map((tab) => {
            const active = venueFilter === tab;
            return (
              <Pressable
                key={tab}
                onPress={() => setVenueFilter(tab)}
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
        {/* Highlighted Date Banner (Figma 121:3665) */}
        <View style={styles.venueDateBanner}>
          <View style={styles.notifIconBox}>
            <IconCalendar size={20} color={Colors.brandPrimary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, color: Colors.textBody }}>สถานที่ว่างวันที่</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.textHeading }}>
              {selectedDateLabel}
            </Text>
          </View>
          <Text style={{ fontSize: 12, fontWeight: '600', color: Colors.textHeading }}>
            ว่าง {availableCount} ที่
          </Text>
        </View>

        {/* Venue Cards (Figma 121:3674) */}
        {filteredVenues.map((v) => {
          const badgeBg =
            v.status === 'ว่าง'
              ? Colors.statusSuccess
              : v.status === 'ว่างบางส่วน'
              ? Colors.statusWarning
              : Colors.statusError;

          return (
            <Pressable
              key={v.id}
              onPress={() => {
                onSelectVenue(v);
                setSubScreen('venue_detail');
              }}
              style={styles.venueCard}
            >
              <Image source={{ uri: v.image }} style={styles.venueThumb} resizeMode="cover" />
              <View style={{ flex: 1, gap: 6 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Text style={styles.venueTitleText} numberOfLines={1}>
                    {v.name}
                  </Text>
                  <View style={[styles.venueStatusPill, { backgroundColor: badgeBg }]}>
                    <Text style={styles.venueStatusPillText}>{v.status}</Text>
                  </View>
                </View>
                <View style={styles.iconLabelRow}>
                  <IconLocation size={15} color={Colors.textPrimary} />
                  <Text style={styles.venueMetaText}>{v.code}</Text>
                </View>
                <View style={styles.iconLabelRow}>
                  <IconUsers size={15} color={Colors.textPrimary} />
                  <Text style={styles.venueMetaText}>รองรับ {v.capacity} คน</Text>
                </View>
                <View style={styles.iconLabelRow}>
                  <IconClock size={15} color={Colors.textPrimary} />
                  <Text style={styles.venueMetaText}>{v.available_window}</Text>
                </View>
              </View>
            </Pressable>
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
