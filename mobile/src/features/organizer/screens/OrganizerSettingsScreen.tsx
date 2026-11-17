import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Colors } from '../../../constants/colors';
import { IconArrowLeft, IconChevronRight } from '../../../components/Icons';
import { OrganizerSubScreen } from '../types';
import { organizerStyles as styles } from '../styles/organizer.styles';

type Props = {
  setSubScreen: (s: OrganizerSubScreen) => void;
  onSwitchRole: (role: 'participant' | 'organizer' | 'admin') => void;
  onLogout: () => void;
};

export function OrganizerSettingsScreen({
  setSubScreen,
  onSwitchRole,
  onLogout,
}: Props) {
  return (
    <View style={styles.screenContainer}>
      <View style={styles.topMenuBar}>
        <Pressable onPress={() => setSubScreen('my_events')} style={styles.iconHitBox}>
          <IconArrowLeft size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.topMenuTitle}>การตั้งค่าผู้จัด</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={{ paddingTop: 12 }}>
        <Text style={styles.settingsGroupTitle}>บัญชี</Text>
        <View style={styles.settingsGroupBox}>
          <Pressable
            onPress={() => onSwitchRole('participant')}
            style={styles.settingsRow}
          >
            <Text style={styles.settingsRowText}>สลับไปยังโหมดผู้เข้าร่วม (Participant)</Text>
            <IconChevronRight size={18} color={Colors.textPrimary} />
          </Pressable>
          <Pressable onPress={() => onSwitchRole('admin')} style={styles.settingsRow}>
            <Text style={styles.settingsRowText}>เปิดหน้าผู้ดูแลระบบ (E-MOD Admin Web)</Text>
            <IconChevronRight size={18} color={Colors.textPrimary} />
          </Pressable>
          <Pressable
            onPress={onLogout}
            style={[styles.settingsRow, { borderBottomWidth: 0 }]}
          >
            <Text
              style={[
                styles.settingsRowText,
                { color: Colors.statusError, fontWeight: '600' },
              ]}
            >
              ออกจากระบบ
            </Text>
            <IconChevronRight size={18} color={Colors.statusError} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
