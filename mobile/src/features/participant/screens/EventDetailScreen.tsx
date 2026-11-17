import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { Colors } from '../../../constants/colors';
import {
  IconArrowLeft,
  IconBell,
  IconHeart,
  IconCalendar,
  IconLocation,
  IconMap,
  IconClock,
} from '../../../components/Icons';
import { ParticipantSubScreen } from '../types';
import { participantStyles as styles } from '../styles/participant.styles';

type Props = {
  event: any;
  unreadCount: number;
  onToggleFavorite: (id: string) => void;
  onToggleRegister: (id: string) => Promise<void>;
  setSubScreen: (s: ParticipantSubScreen) => void;
};

export function EventDetailScreen({
  event: ev,
  unreadCount,
  onToggleFavorite,
  onToggleRegister,
  setSubScreen,
}: Props) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [registerLoading, setRegisterLoading] = useState(false);

  const isFull = ev.current_participants >= ev.max_participants;
  const isRegistered = Boolean(ev.is_registered);
  const slides = [ev.image, '/assets/figma/51eb6.png', '/assets/figma/fa970.png'];
  const ratio = Math.min(1, ev.current_participants / Math.max(1, ev.max_participants));

  const handleRegisterPress = async () => {
    if (isFull && !isRegistered) return;
    setRegisterLoading(true);
    try {
      await onToggleRegister(ev.id);
    } finally {
      setTimeout(() => setRegisterLoading(false), 350);
    }
  };

  return (
    <View style={styles.screenContainer}>
      {/* Top Menu Bar (Figma 121:3551) */}
      <View style={styles.topMenuBar}>
        <Pressable onPress={() => setSubScreen('home')} style={styles.iconHitBox}>
          <IconArrowLeft size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.topMenuTitle} numberOfLines={1}>
          {ev.title}
        </Text>
        <Pressable onPress={() => setSubScreen('notifications')} style={styles.iconHitBoxEnd}>
          <IconBell size={24} hasBadge={unreadCount > 0} />
        </Pressable>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 36, gap: 16 }}
      >
        {/* Photo Slide (Figma 8102:12964) */}
        <View style={styles.photoSlideWrap}>
          <Pressable
            onPress={() => setSlideIndex((prev) => (prev + 1) % slides.length)}
            style={styles.photoSlideImageBox}
          >
            <Image
              source={{ uri: slides[slideIndex] }}
              style={styles.photoSlideImg}
              resizeMode="cover"
            />
            <View style={styles.slideCounterBadge}>
              <Text style={styles.slideCounterText}>{slideIndex + 1}/3</Text>
            </View>
          </Pressable>
          <View style={styles.slideDotsRow}>
            {[0, 1, 2].map((idx) => (
              <Pressable
                key={idx}
                onPress={() => setSlideIndex(idx)}
                style={[styles.slideDot, slideIndex === idx && styles.slideDotActive]}
              />
            ))}
          </View>
        </View>

        {/* Title + Favourite (Figma 121:3554) */}
        <View style={styles.detailTitleRow}>
          <Text style={styles.detailTitleText}>{ev.title}</Text>
          <Pressable onPress={() => onToggleFavorite(ev.id)} style={{ padding: 4 }}>
            <IconHeart size={24} active={Boolean(ev.is_favorite)} />
          </Pressable>
        </View>

        {/* Category Tags (Figma 8155:14765) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10 }}
        >
          {(ev.tags && ev.tags.length > 0
            ? ev.tags
            : ['พัฒนาตัวเอง', 'งานและการเงิน', 'งานแข่งขัน']
          ).map((tag: string) => (
            <View key={tag} style={styles.detailTagChip}>
              <Text style={styles.detailTagText}>{tag}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Description (Figma 8166:14914) */}
        <View style={{ gap: 8 }}>
          <Text style={styles.detailSectionTitle}>รายละเอียดกิจกรรม</Text>
          <Text style={styles.detailDescriptionText}>{ev.description}</Text>
        </View>

        {/* 3 Info Cards: Date/Time, Venue + Map button, Hours (Figma 121:3561) */}
        <View style={{ gap: 12 }}>
          <View style={styles.detailInfoCard}>
            <View style={styles.detailInfoIconWrap}>
              <IconCalendar size={24} color={Colors.brandPrimary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.detailInfoLabel}>วันและเวลา</Text>
              <Text style={styles.detailInfoValue}>{ev.date}</Text>
              <Text style={styles.detailInfoSub}>{ev.time_range}</Text>
            </View>
          </View>

          <View style={styles.detailInfoCard}>
            <View style={styles.detailInfoIconWrap}>
              <IconLocation size={24} color={Colors.brandPrimary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.detailInfoLabel}>สถานที่</Text>
              <Text style={styles.detailInfoValue}>{ev.venue_code}</Text>
              <Text style={styles.detailInfoSub}>{ev.venue_name}</Text>
            </View>
            <Pressable onPress={() => setSubScreen('map_route')} style={styles.mapPillButton}>
              <Text style={styles.mapPillText}>Map</Text>
              <IconMap size={18} color={Colors.brandPrimary} />
            </Pressable>
          </View>

          <View style={styles.detailInfoCard}>
            <View style={styles.detailInfoIconWrap}>
              <IconClock size={24} color={Colors.brandPrimary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.detailInfoLabel}>ชั่วโมงกิจกรรม</Text>
              <Text style={styles.detailInfoValue}>{ev.hours} ชม.</Text>
            </View>
          </View>
        </View>

        {/* Participant Progress & Register Card (Figma 8188:19670) */}
        <View style={styles.registerCard}>
          <Image
            source={{ uri: ev.venue_image || '/assets/figma/51eb6.png' }}
            style={styles.registerVenuePreview}
            resizeMode="cover"
          />
          <View style={styles.participantCountRow}>
            <Text style={styles.participantCountLabel}>ผู้เข้าร่วม</Text>
            <Text
              style={[
                styles.participantCountVal,
                isFull && { color: Colors.statusError, fontWeight: '700' },
              ]}
            >
              {ev.current_participants}/{ev.max_participants}
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.round(ratio * 100)}%` as any,
                  backgroundColor: isFull ? Colors.statusError : Colors.brandPrimary,
                },
              ]}
            />
          </View>

          {isRegistered ? (
            <View style={{ gap: 8, width: '100%' }}>
              <Pressable
                onPress={() => setSubScreen('qr_ticket')}
                style={[styles.registerActionBtn, { backgroundColor: Colors.statusSuccess }]}
              >
                <Text style={styles.registerActionBtnText}>
                  ✓ ลงทะเบียนแล้ว • ดูบัตรเข้างาน (QR)
                </Text>
              </Pressable>
              <Pressable
                onPress={handleRegisterPress}
                style={[styles.registerActionBtn, { backgroundColor: '#F5F5F5', height: 38 }]}
              >
                <Text
                  style={[styles.registerActionBtnText, { color: Colors.textGray, fontSize: 12 }]}
                >
                  ยกเลิกการลงทะเบียน
                </Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={handleRegisterPress}
              disabled={isFull || registerLoading}
              style={[
                styles.registerActionBtn,
                isFull && { backgroundColor: Colors.textPlaceholder },
              ]}
            >
              <Text style={styles.registerActionBtnText}>
                {registerLoading
                  ? '• • • กำลังบันทึก'
                  : isFull
                  ? 'ที่นั่งเต็มแล้ว'
                  : 'ลงทะเบียนกิจกรรม'}
              </Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
