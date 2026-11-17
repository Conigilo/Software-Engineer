import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Colors } from '../../../constants/colors';
import {
  IconCalendar,
  IconHeart,
  IconLocation,
  IconUsers,
} from '../../../components/Icons';
import { participantStyles as styles } from '../styles/participant.styles';

type Props = {
  event: any;
  onPress: () => void;
  onToggleFavorite: (id: string) => void;
};

export function ParticipantEventCard({ event: ev, onPress, onToggleFavorite }: Props) {
  const isFull = ev.current_participants >= ev.max_participants;

  return (
    <Pressable onPress={onPress} style={styles.eventCard}>
      <View style={styles.eventImageWrap}>
        <Image source={{ uri: ev.image }} style={styles.eventImage} resizeMode="cover" />
      </View>
      <View style={styles.eventCardBody}>
        <View style={styles.eventCardTopRow}>
          <View style={styles.iconLabelRow}>
            <IconCalendar size={16} color={Colors.textSecondary} />
            <Text style={styles.eventDateText}>{ev.date}</Text>
          </View>
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onToggleFavorite(ev.id);
            }}
            style={{ padding: 2 }}
          >
            <IconHeart size={22} active={Boolean(ev.is_favorite)} />
          </Pressable>
        </View>
        <Text style={styles.eventTitleText} numberOfLines={1}>
          {ev.title}
        </Text>
        <View style={styles.iconLabelRow}>
          <IconLocation size={16} color={Colors.textMuted} />
          <Text style={styles.eventMetaText} numberOfLines={1}>
            {ev.venue_full}
          </Text>
        </View>
        <View style={styles.iconLabelRow}>
          <IconUsers size={16} color={isFull ? Colors.statusError : Colors.textMuted} />
          <Text
            style={[
              styles.eventMetaText,
              isFull && { color: Colors.statusError, fontWeight: '600' },
            ]}
          >
            {ev.current_participants}/{ev.max_participants}
            {isFull ? ' (ที่นั่งเต็ม)' : ''}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
