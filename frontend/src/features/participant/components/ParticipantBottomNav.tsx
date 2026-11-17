import React from 'react';
import { View, Pressable } from 'react-native';
import {
  IconHome,
  IconLike,
  IconTicket,
  IconMessage,
  IconProfile,
} from '../../../components/Icons';
import { ParticipantSubScreen } from '../types';
import { participantStyles as styles } from '../styles/participant.styles';

type Props = {
  subScreen: ParticipantSubScreen;
  setSubScreen: (s: ParticipantSubScreen) => void;
};

export function ParticipantBottomNav({ subScreen, setSubScreen }: Props) {
  const activeTab =
    subScreen === 'favorites'
      ? 'favorites'
      : subScreen === 'my_events'
      ? 'my_events'
      : subScreen === 'chat'
      ? 'chat'
      : subScreen === 'profile'
      ? 'profile'
      : 'home';

  return (
    <View style={styles.bottomNavOuter}>
      <View style={styles.bottomNavCard}>
        <Pressable onPress={() => setSubScreen('home')} style={styles.navIconBtn}>
          <IconHome active={activeTab === 'home'} />
        </Pressable>
        <Pressable onPress={() => setSubScreen('favorites')} style={styles.navIconBtn}>
          <IconLike active={activeTab === 'favorites'} />
        </Pressable>
        <Pressable onPress={() => setSubScreen('my_events')} style={styles.navIconBtn}>
          <IconTicket active={activeTab === 'my_events'} />
        </Pressable>
        <Pressable onPress={() => setSubScreen('chat')} style={styles.navIconBtn}>
          <IconMessage active={activeTab === 'chat'} />
        </Pressable>
        <Pressable onPress={() => setSubScreen('profile')} style={styles.navIconBtn}>
          <IconProfile active={activeTab === 'profile'} />
        </Pressable>
      </View>
    </View>
  );
}
