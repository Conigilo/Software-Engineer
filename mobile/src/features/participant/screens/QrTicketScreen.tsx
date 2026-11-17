import React from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { Colors } from '../../../constants/colors';
import {
  IconArrowLeft,
  IconBell,
  IconLocation,
} from '../../../components/Icons';
import { ParticipantSubScreen } from '../types';
import { participantStyles as styles } from '../styles/participant.styles';

type Props = {
  event: any;
  unreadCount: number;
  setSubScreen: (s: ParticipantSubScreen) => void;
};

export function QrTicketScreen({ event: ev, unreadCount, setSubScreen }: Props) {
  return (
    <View style={styles.screenContainer}>
      <View style={styles.topMenuBar}>
        <Pressable onPress={() => setSubScreen('my_events')} style={styles.iconHitBox}>
          <IconArrowLeft size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.topMenuTitle}>บัตรเข้างาน</Text>
        <Pressable onPress={() => setSubScreen('notifications')} style={styles.iconHitBoxEnd}>
          <IconBell size={24} hasBadge={unreadCount > 0} />
        </Pressable>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 36 }}
      >
        {/* Ticket Card (Figma 121:3574) */}
        <View style={styles.ticketCard}>
          <Image source={{ uri: ev.image }} style={styles.ticketCoverImg} resizeMode="cover" />
          <View style={styles.ticketHeaderSection}>
            <Text style={styles.ticketDateText}>{ev.date}</Text>
            <Text style={styles.ticketTitleText}>{ev.title}</Text>
            <View style={styles.iconLabelRow}>
              <IconLocation size={16} color={Colors.textHeading} />
              <Text style={styles.ticketVenueText}>{ev.venue_full}</Text>
            </View>
          </View>

          <View style={styles.qrSection}>
            <Image
              source={{ uri: ev.qr_image || '/assets/figma/15bde.png' }}
              style={styles.qrImage}
              resizeMode="contain"
            />
            <Text style={styles.qrHelperText}>ให้ผู้จัดสแกนโค้ดนี้เพื่อเช็คชื่อ</Text>
          </View>

          <Pressable onPress={() => setSubScreen('detail')} style={styles.ticketDetailBtn}>
            <Text style={styles.ticketDetailBtnText}>ดูรายละเอียดกิจกรรม</Text>
          </Pressable>
        </View>

        {/* Venue Route Card (Figma 121:3585) */}
        <View style={styles.ticketVenueCard}>
          <Text style={styles.ticketVenueCardTitle}>
            {ev.venue_name || 'Learning Space (N7)'}
          </Text>
          <Image
            source={{ uri: ev.venue_image || '/assets/figma/64291.png' }}
            style={styles.registerVenuePreview}
            resizeMode="cover"
          />
          <Pressable onPress={() => setSubScreen('map_route')} style={styles.registerActionBtn}>
            <Text style={styles.registerActionBtnText}>ดูเส้นทาง</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
