import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Colors } from '../../../constants/colors';
import { IconArrowLeft, IconLocation, IconMap } from '../../../components/Icons';
import { ParticipantSubScreen } from '../types';
import { participantStyles as styles } from '../styles/participant.styles';

type Props = {
  event: any;
  setSubScreen: (s: ParticipantSubScreen) => void;
};

export function MapRouteScreen({ event: ev, setSubScreen }: Props) {
  return (
    <View style={styles.screenContainer}>
      <View style={{ flex: 1, position: 'relative' }}>
        <Image
          source={{ uri: '/assets/figma/64291.png' }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
        {/* Floating Back Button */}
        <Pressable onPress={() => setSubScreen('detail')} style={styles.floatingBackBtn}>
          <IconArrowLeft size={26} color={Colors.textPrimary} />
        </Pressable>

        {/* Route Pin Overlay */}
        <View style={styles.mapPinOverlay}>
          <View style={styles.mapPinBubble}>
            <IconLocation size={18} color="#FFFFFF" />
            <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700' }}>
              {ev?.venue_code || 'N7'} • 250 ม. (เดิน 3 นาที)
            </Text>
          </View>
        </View>

        {/* Bottom Venue Info Card (Figma 8102:5060) */}
        <View style={styles.mapBottomCard}>
          <Image
            source={{ uri: ev?.venue_image || '/assets/figma/51eb6.png' }}
            style={styles.mapVenueThumb}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.mapVenueCode}>{ev?.venue_code || 'N7'}</Text>
            <Text style={styles.mapVenueName} numberOfLines={1}>
              {ev?.venue_name || 'อาคารปฏิบัติการทางวิทยาศาสตร์'}
            </Text>
          </View>
          <Pressable onPress={() => setSubScreen('detail')} style={styles.mapDirectionCircle}>
            <IconMap size={20} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
