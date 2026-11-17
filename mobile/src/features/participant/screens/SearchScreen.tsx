import React from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Image } from 'react-native';
import { Colors } from '../../../constants/colors';
import {
  IconArrowLeft,
  IconSearch,
  IconFunnel,
  IconClock,
  IconChevronRight,
} from '../../../components/Icons';
import { ParticipantSubScreen } from '../types';
import { participantStyles as styles } from '../styles/participant.styles';

type Props = {
  events: any[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  recentSearches: any[];
  onAddRecentSearch: (ev: any) => void;
  onSelectEvent: (ev: any, targetScreen?: ParticipantSubScreen) => void;
  setSubScreen: (s: ParticipantSubScreen) => void;
};

export function SearchScreen({
  events,
  searchQuery,
  setSearchQuery,
  recentSearches,
  onAddRecentSearch,
  onSelectEvent,
  setSubScreen,
}: Props) {
  const searchMatches =
    searchQuery.trim() === ''
      ? []
      : events.filter(
          (e) =>
            e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.venue_full.toLowerCase().includes(searchQuery.toLowerCase())
        );

  return (
    <View style={styles.screenContainer}>
      <View style={styles.searchHeaderBar}>
        <Pressable onPress={() => setSubScreen('home')} style={styles.iconHitBox}>
          <IconArrowLeft size={24} color={Colors.textPrimary} />
        </Pressable>
        <View style={[styles.searchBox, { flex: 1 }]}>
          <IconSearch size={18} color={Colors.textGray} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="ค้นหาชื่อกิจกรรม สถานที่ หรือชมรม..."
            placeholderTextColor={Colors.textGray}
            autoFocus
            style={styles.searchInput}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Text style={{ fontSize: 12, color: Colors.textGray }}>ล้าง</Text>
            </Pressable>
          )}
        </View>
        <Pressable onPress={() => setSubScreen('filter')} style={styles.funnelButton}>
          <IconFunnel size={20} color={Colors.textPrimary} />
        </Pressable>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
      >
        <Text style={styles.sectionSubTitle}>
          {searchQuery.trim() === ''
            ? 'กิจกรรมที่ค้นหาล่าสุด'
            : `ผลการค้นหา (${searchMatches.length})`}
        </Text>

        {searchQuery.trim() === '' ? (
          <View style={{ gap: 10 }}>
            {recentSearches.map((rs) => {
              const matched = events.find((e) => e.id === rs.event_id) || events[0];
              return (
                <Pressable
                  key={rs.id}
                  onPress={() => {
                    if (matched) {
                      onAddRecentSearch(matched);
                      onSelectEvent(matched, 'detail');
                    }
                  }}
                  style={styles.recentSearchCard}
                >
                  <Image source={{ uri: rs.image }} style={styles.recentSearchImg} />
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={styles.recentSearchTitle} numberOfLines={1}>
                      {rs.title}
                    </Text>
                    <View style={styles.iconLabelRow}>
                      <IconClock size={14} color={Colors.brandPrimary} />
                      <Text style={styles.recentSearchDate}>{rs.date_label}</Text>
                    </View>
                  </View>
                  <IconChevronRight size={18} color={Colors.textMuted} />
                </Pressable>
              );
            })}
          </View>
        ) : (
          <View style={{ gap: 12 }}>
            {searchMatches.map((ev) => (
              <Pressable
                key={ev.id}
                onPress={() => {
                  onAddRecentSearch(ev);
                  onSelectEvent(ev, 'detail');
                }}
                style={styles.recentSearchCard}
              >
                <Image source={{ uri: ev.image }} style={styles.recentSearchImg} />
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={styles.recentSearchTitle}>{ev.title}</Text>
                  <View style={styles.iconLabelRow}>
                    <IconClock size={14} color={Colors.brandPrimary} />
                    <Text style={styles.recentSearchDate}>
                      {ev.date} • {ev.venue_code}
                    </Text>
                  </View>
                </View>
                <IconChevronRight size={18} color={Colors.textMuted} />
              </Pressable>
            ))}
            {searchMatches.length === 0 && (
              <Text style={styles.emptyText}>ไม่พบกิจกรรมที่ตรงกับ &quot;{searchQuery}&quot;</Text>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
