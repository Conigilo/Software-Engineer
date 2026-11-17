import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Colors } from '../../../constants/colors';
import { Categories } from '../../../constants/categories';
import {
  IconCloseCircle,
  IconCalendar,
  IconUsers,
  IconClock,
} from '../../../components/Icons';
import { ParticipantSubScreen, SortOptionKey } from '../types';
import { participantStyles as styles } from '../styles/participant.styles';

type Props = {
  sortBy: SortOptionKey;
  setSortBy: (s: SortOptionKey) => void;
  selectedCategories: string[];
  onToggleCategoryChip: (cat: string) => void;
  setSubScreen: (s: ParticipantSubScreen) => void;
};

export function FilterScreen({
  sortBy,
  setSortBy,
  selectedCategories,
  onToggleCategoryChip,
  setSubScreen,
}: Props) {
  const sortOptions: Array<{
    key: SortOptionKey;
    icon: React.ReactNode;
  }> = [
    { key: 'วันที่เปิดกิจกรรม', icon: <IconCalendar size={20} color={Colors.textHeading} /> },
    { key: 'จำนวนผู้เข้าร่วม', icon: <IconUsers size={20} color={Colors.textHeading} /> },
    { key: 'จำนวนชั่วโมงกิจกรรม', icon: <IconClock size={20} color={Colors.textHeading} /> },
  ];

  return (
    <View style={styles.screenContainer}>
      <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
        <Pressable
          onPress={() => setSubScreen('home')}
          style={{ width: 48, height: 48, justifyContent: 'center' }}
        >
          <IconCloseCircle size={36} color={Colors.textHeading} />
        </Pressable>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
        <Text style={styles.filterGroupHeading}>เรียงตาม</Text>
        <View style={{ gap: 8, marginTop: 8 }}>
          {sortOptions.map((opt) => {
            const selected = sortBy === opt.key;
            return (
              <Pressable
                key={opt.key}
                onPress={() => setSortBy(opt.key)}
                style={styles.radioRow}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                  {opt.icon}
                  <Text style={styles.radioLabel}>{opt.key}</Text>
                </View>
                <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
                  {selected && <View style={styles.radioInner} />}
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.dividerLine} />

        <Text style={styles.filterGroupHeading}>หมวดหมู่</Text>
        <View style={styles.categoryWrapGrid}>
          {Categories.map((cat) => {
            const active = selectedCategories.includes(cat);
            return (
              <Pressable
                key={cat}
                onPress={() => onToggleCategoryChip(cat)}
                style={[styles.filterPill, active && styles.filterPillActive]}
              >
                <Text style={[styles.filterPillText, active && styles.filterPillTextActive]}>
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={{ padding: 19 }}>
        <Pressable onPress={() => setSubScreen('home')} style={styles.primaryFullButton}>
          <Text style={styles.primaryFullButtonText}>ใช้ตัวกรอง</Text>
        </Pressable>
      </View>
    </View>
  );
}
