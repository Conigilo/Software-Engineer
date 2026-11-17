import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { Colors } from '../../../constants/colors';
import {
  IconArrowLeft,
  IconScan,
  IconClock,
} from '../../../components/Icons';
import { OrganizerSubScreen } from '../types';
import { organizerStyles as styles } from '../styles/organizer.styles';

type Props = {
  event: any;
  attendees: any[];
  onLoadAttendees: (eventId: string) => Promise<void>;
  onScanCheckIn: (eventId: string, name?: string) => Promise<void>;
  setSubScreen: (s: OrganizerSubScreen) => void;
};

export function QrCheckInScreen({
  event: ev,
  attendees,
  onLoadAttendees,
  onScanCheckIn,
  setSubScreen,
}: Props) {
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [scanSuccessBanner, setScanSuccessBanner] = useState<string | null>(null);

  useEffect(() => {
    const targetId = ev?.id || 'ev-5';
    onLoadAttendees(targetId);
  }, [ev?.id, onLoadAttendees]);

  const handleSimulateScan = async () => {
    const sampleNames = [
      'น.ส.ปภาวรินท์ ลาภอนันต์ (67090500429)',
      'นาย กิตติภพ นักพัฒนา (67090500215)',
      'น.ส.พิมพ์ลภัส ใจดี (67090500319)',
    ];
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    await onScanCheckIn(ev.id, randomName);
    setScanSuccessBanner(`เช็คชื่อสำเร็จ: ${randomName}`);
    setTimeout(() => setScanSuccessBanner(null), 3000);
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.topMenuBar}>
        <Pressable onPress={() => setSubScreen('my_events')} style={styles.iconHitBox}>
          <IconArrowLeft size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.topMenuTitle} numberOfLines={1}>
          {ev.title || 'พัฒนาบุคลิกภาพเพื่อความเริ่ด'}
        </Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Camera Preview & Scan Frame (Figma 121:3655) */}
      <View style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <Image
          source={{ uri: '/assets/figma/dd0bd.png' }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
        {!sheetExpanded && (
          <View style={styles.cameraOverlayCenter}>
            <View style={styles.scanReticleBox}>
              <View
                style={[
                  styles.scanCorner,
                  { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4 },
                ]}
              />
              <View
                style={[
                  styles.scanCorner,
                  { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4 },
                ]}
              />
              <View
                style={[
                  styles.scanCorner,
                  { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4 },
                ]}
              />
              <View
                style={[
                  styles.scanCorner,
                  { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4 },
                ]}
              />
            </View>

            {scanSuccessBanner && (
              <View style={styles.scanToastBadge}>
                <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '600' }}>
                  ✓ {scanSuccessBanner}
                </Text>
              </View>
            )}

            <Pressable onPress={handleSimulateScan} style={styles.simulateScanBtn}>
              <IconScan size={18} color="#FFFFFF" />
              <Text style={{ color: '#FFF', fontSize: 13, fontWeight: '600' }}>
                จำลองสแกน QR Code เช็คชื่อเข้างาน
              </Text>
            </Pressable>
          </View>
        )}

        {/* Bottom Sheet: รายละเอียดเช็คชื่อคนเข้างาน (Figma 8102:10902) */}
        <View
          style={[
            styles.checkinBottomSheet,
            sheetExpanded ? { top: 20 } : { top: 380 },
          ]}
        >
          <Pressable
            onPress={() => setSheetExpanded(!sheetExpanded)}
            style={styles.sheetHandleArea}
          >
            <View style={styles.sheetHandleBar} />
            <Text style={styles.sheetCountTitle}>
              จำนวนผู้เข้าร่วม {attendees.length + 32} / {ev.max_participants || 50}
            </Text>
            <Text style={{ fontSize: 11, color: Colors.textGray }}>
              {sheetExpanded ? 'แตะเพื่อย่อลง ▼' : 'แตะเพื่อดูรายชื่อทั้งหมด ▲'}
            </Text>
          </Pressable>

          <ScrollView
            style={{ flex: 1, width: '100%' }}
            contentContainerStyle={{ paddingBottom: 32 }}
          >
            <View style={styles.attendeeListBox}>
              {attendees.map((att) => (
                <View key={att.id} style={styles.attendeeRowCard}>
                  <Image source={{ uri: att.avatar }} style={styles.attendeeAvatar} />
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={styles.attendeeNameText}>{att.name}</Text>
                    <View style={styles.iconLabelRow}>
                      <IconClock size={15} color={Colors.brandPrimary} />
                      <Text style={styles.attendeeTimeText}>{att.check_in_time}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}
