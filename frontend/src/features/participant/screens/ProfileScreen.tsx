import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Image } from 'react-native';
import { Colors } from '../../../constants/colors';
import {
  IconSetting,
  IconEdit,
  IconCalendar,
} from '../../../components/Icons';
import { ParticipantSubScreen } from '../types';
import { participantStyles as styles } from '../styles/participant.styles';
import { ParticipantBottomNav } from '../components/ParticipantBottomNav';

type Props = {
  subScreen: ParticipantSubScreen;
  setSubScreen: (s: ParticipantSubScreen) => void;
  events: any[];
  userProfile: any;
  onUpdateProfile: (data: any) => Promise<void>;
  onSelectEvent: (ev: any, targetScreen?: ParticipantSubScreen) => void;
};

export function ProfileScreen({
  subScreen,
  setSubScreen,
  events,
  userProfile,
  onUpdateProfile,
  onSelectEvent,
}: Props) {
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(
    userProfile?.name || 'ปภาวรินท์ ลาภอนันต์'
  );

  const hours = userProfile?.activity_hours ?? 20;
  const target = userProfile?.target_hours ?? 25;
  const historyEvents = events.filter((e) => e.is_registered);

  return (
    <View style={styles.screenContainer}>
      <View style={styles.topMenuBar}>
        <View style={{ width: 44 }} />
        <Text style={styles.topMenuTitle}>โปรไฟล์</Text>
        <Pressable onPress={() => setSubScreen('settings')} style={styles.iconHitBoxEnd}>
          <IconSetting size={24} color={Colors.textPrimary} />
        </Pressable>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 16, paddingBottom: 120 }}
      >
        {/* User Identity Row (Figma 121:3607) */}
        <View style={styles.profileHeaderCard}>
          <View style={{ position: 'relative' }}>
            <Image
              source={{ uri: userProfile?.avatar || '/assets/figma/2beed.png' }}
              style={styles.profileAvatar}
            />
            <Pressable
              onPress={() => setEditingProfile(!editingProfile)}
              style={styles.profileEditBadge}
            >
              <IconEdit size={13} color="#FFFFFF" />
            </Pressable>
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={styles.profileStudentId}>
              {userProfile?.student_id || '67090500429'}
            </Text>
            {editingProfile ? (
              <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                <TextInput
                  value={profileName}
                  onChangeText={setProfileName}
                  style={styles.profileEditInput}
                />
                <Pressable
                  onPress={async () => {
                    await onUpdateProfile({ name: profileName });
                    setEditingProfile(false);
                  }}
                  style={styles.saveMiniBtn}
                >
                  <Text style={{ color: '#FFF', fontSize: 11, fontWeight: '600' }}>บันทึก</Text>
                </Pressable>
              </View>
            ) : (
              <Text style={styles.profileNameText}>
                {userProfile?.name || 'ปภาวรินท์ ลาภอนันต์'}
              </Text>
            )}
            <Text style={styles.profileEmailText}>
              {userProfile?.email || 'pp.asd@kmutt.ac.th'}
            </Text>
          </View>
        </View>

        {/* Activity Hours Progress (Figma 121:3609) */}
        <Text style={styles.profileSectionHeading}>ชั่วโมงกิจกรรม</Text>
        <View style={styles.hoursProgressCard}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 14, color: '#000' }}>ความคืบหน้า</Text>
            <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.textGray }}>
              {hours}/{target} ชม.
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(100, (hours / target) * 100)}%` as any },
              ]}
            />
          </View>
          <Text style={{ fontSize: 14, color: '#000' }}>
            เหลืออีก {Math.max(0, target - hours)} ชม.
          </Text>
        </View>

        {/* Participation History (Figma 121:3611) */}
        <Text style={styles.profileSectionHeading}>ประวัติการเข้าร่วมกิจกรรม</Text>
        <View style={styles.historyListContainer}>
          {historyEvents.map((ev) => (
            <Pressable
              key={ev.id}
              onPress={() => onSelectEvent(ev, 'detail')}
              style={styles.historyRowCard}
            >
              <Image source={{ uri: ev.image }} style={styles.historyThumb} />
              <View style={{ flex: 1, gap: 6 }}>
                <Text style={styles.eventTitleText} numberOfLines={1}>
                  {ev.title}
                </Text>
                <View style={styles.iconLabelRow}>
                  <IconCalendar size={15} color={Colors.brandPrimary} />
                  <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.brandPrimary }}>
                    {ev.date} • +{ev.hours} ชม.
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <ParticipantBottomNav subScreen={subScreen} setSubScreen={setSubScreen} />
    </View>
  );
}
