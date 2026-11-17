import React from 'react';
import { View, Pressable } from 'react-native';
import { Colors } from '../../../constants/colors';
import {
  IconHome,
  IconLocation,
  IconBell,
  IconDocument,
} from '../../../components/Icons';
import { OrganizerSubScreen } from '../types';
import { organizerStyles as styles } from '../styles/organizer.styles';

type Props = {
  subScreen: OrganizerSubScreen;
  setSubScreen: (s: OrganizerSubScreen) => void;
  hasUnread: boolean;
};

export function OrganizerBottomNav({ subScreen, setSubScreen, hasUnread }: Props) {
  const active =
    subScreen === 'venues' || subScreen === 'venue_detail'
      ? 'venues'
      : subScreen === 'notifications'
      ? 'notifications'
      : subScreen === 'event_status'
      ? 'status'
      : 'home';

  return (
    <View style={styles.bottomNavOuter}>
      <View style={styles.bottomNavCard}>
        <Pressable onPress={() => setSubScreen('my_events')} style={styles.navIconBtn}>
          <IconHome active={active === 'home'} />
        </Pressable>
        <Pressable onPress={() => setSubScreen('venues')} style={styles.navIconBtn}>
          <IconLocation
            size={24}
            color={active === 'venues' ? Colors.brandPrimary : Colors.textPrimary}
          />
        </Pressable>
        <Pressable onPress={() => setSubScreen('notifications')} style={styles.navIconBtn}>
          <IconBell
            size={24}
            color={active === 'notifications' ? Colors.brandPrimary : Colors.textPrimary}
            hasBadge={hasUnread}
          />
        </Pressable>
        <Pressable onPress={() => setSubScreen('event_status')} style={styles.navIconBtn}>
          <IconDocument size={24} active={active === 'status'} />
        </Pressable>
      </View>
    </View>
  );
}
