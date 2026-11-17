import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { Colors } from '../../../constants/colors';
import {
  IconArrowLeft,
  IconSetting,
  IconEdit,
  IconCheck,
  IconDocument,
} from '../../../components/Icons';
import { OrganizerSubScreen, OrganizerStatusVariant } from '../types';
import { organizerStyles as styles } from '../styles/organizer.styles';
import { OrganizerBottomNav } from '../components/OrganizerBottomNav';

type Props = {
  subScreen: OrganizerSubScreen;
  setSubScreen: (s: OrganizerSubScreen) => void;
  event: any;
  statusVariant: OrganizerStatusVariant;
  setStatusVariant: (v: OrganizerStatusVariant) => void;
  hasUnread: boolean;
  onExportCsv: (eventId: string) => Promise<void>;
};

export function EventStatusScreen({
  subScreen,
  setSubScreen,
  event: ev,
  statusVariant,
  setStatusVariant,
  hasUnread,
  onExportCsv,
}: Props) {
  const [exportToast, setExportToast] = useState<string | null>(null);

  const statusBadgeConfig = {
    pending: { label: 'รอเจ้าหน้าที่อนุมัติ', bg: Colors.statusWarning },
    approved: { label: 'ขอจัดกิจกรรมสำเร็จ', bg: Colors.statusSuccess },
    export_ready: { label: 'พร้อมส่งออกรายชื่อ', bg: Colors.brandTeal },
    rejected: { label: 'ส่งกลับให้แก้ไข', bg: Colors.statusError },
  }[statusVariant];

  const steps = [
    {
      title: 'ส่งคำขอแล้ว',
      date: '14 พ.ย. 2569 • 09:30 น.',
      done: true,
    },
    {
      title: 'ผู้ดูแลกำลังตรวจสอบ',
      date: '15 พ.ย. 2569 • 11:00 น.',
      done: true,
    },
    {
      title:
        statusVariant === 'rejected'
          ? 'ส่งกลับให้แก้ไข (กรุณาแนบเอกสารเพิ่มเติม)'
          : 'ผลการอนุมัติ',
      date:
        statusVariant === 'pending'
          ? 'อยู่ระหว่างการพิจารณา'
          : '17 พ.ย. 2569 • 14:20 น.',
      done: statusVariant !== 'pending',
      isError: statusVariant === 'rejected',
    },
    {
      title: 'พร้อมส่งออกรายชื่อ',
      date:
        statusVariant === 'export_ready'
          ? 'พร้อมดาวน์โหลดรายชื่อผู้เข้าร่วม (.CSV)'
          : 'หลังจบกิจกรรม',
      done: statusVariant === 'export_ready',
    },
  ];

  return (
    <View style={styles.screenContainer}>
      <View style={styles.topMenuBar}>
        <Pressable onPress={() => setSubScreen('my_events')} style={styles.iconHitBox}>
          <IconArrowLeft size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.topMenuTitle}>สถานะกิจกรรม</Text>
        <Pressable onPress={() => setSubScreen('settings')} style={styles.iconHitBoxEnd}>
          <IconSetting size={24} color={Colors.textPrimary} />
        </Pressable>
      </View>

      {/* Interactive Figma State Switcher */}
      <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 6 }}
        >
          {[
            { id: 'pending', label: 'รอตรวจสอบ' },
            { id: 'approved', label: 'ขอสำเร็จ' },
            { id: 'export_ready', label: 'ส่งออกรายชื่อได้' },
            { id: 'rejected', label: 'ขอไม่สำเร็จ' },
          ].map((st) => (
            <Pressable
              key={st.id}
              onPress={() => setStatusVariant(st.id as OrganizerStatusVariant)}
              style={[
                styles.filterPill,
                statusVariant === st.id && styles.filterPillActive,
              ]}
            >
              <Text
                style={[
                  styles.filterPillText,
                  statusVariant === st.id && styles.filterPillTextActive,
                ]}
              >
                {st.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 12, paddingBottom: 120 }}
      >
        {/* Event Summary Card (Figma 121:3734) */}
        <View style={styles.statusSummaryCard}>
          <Image
            source={{ uri: ev.image || '/assets/figma/86192.png' }}
            style={styles.statusHeroImg}
          />
          <Text style={styles.statusEventTitle}>{ev.title || 'สายลับจับคำผิด'}</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Pressable
              onPress={() => setSubScreen('edit_event')}
              style={styles.editSecondaryBtn}
            >
              <IconEdit size={18} color={Colors.textHeading} />
              <Text style={styles.editSecondaryBtnText}>แก้ไข</Text>
            </Pressable>
            <View style={[styles.statusStatePillBtn, { backgroundColor: statusBadgeConfig.bg }]}>
              <Text style={styles.statusStatePillText}>{statusBadgeConfig.label}</Text>
            </View>
          </View>
        </View>

        {/* Request Timeline Card (Figma 121:3747) */}
        <View style={styles.timelineCard}>
          <Text style={styles.timelineHeading}>สถานะคำขอกิจกรรม</Text>
          <View style={{ gap: 16, marginTop: 4 }}>
            {steps.map((step, idx) => (
              <View
                key={idx}
                style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 14 }}
              >
                <View style={{ alignItems: 'center' }}>
                  <View
                    style={[
                      styles.timelineCircle,
                      step.done && {
                        backgroundColor: Colors.statusSuccess,
                        borderColor: Colors.statusSuccess,
                      },
                      step.isError && {
                        backgroundColor: Colors.statusError,
                        borderColor: Colors.statusError,
                      },
                    ]}
                  >
                    <IconCheck
                      size={18}
                      color={step.done ? '#FFFFFF' : Colors.textPlaceholder}
                    />
                  </View>
                  {idx < steps.length - 1 && (
                    <View
                      style={[
                        styles.timelineConnector,
                        step.done && { backgroundColor: Colors.statusSuccess },
                      ]}
                    />
                  )}
                </View>
                <View style={{ flex: 1, paddingTop: 4 }}>
                  <Text
                    style={[
                      styles.timelineStepTitle,
                      step.isError && { color: Colors.statusError, fontWeight: '700' },
                    ]}
                  >
                    {step.title}
                  </Text>
                  <Text style={styles.timelineStepDate}>{step.date}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Export Attendee List & Report Card (Figma 121:3748) */}
        <View style={styles.exportReportCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={styles.notifIconBox}>
              <IconDocument size={22} color={Colors.textHeading} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.textHeading }}>
                รายชื่อและรายงานกิจกรรม
              </Text>
              <Text style={{ fontSize: 12, color: Colors.textGray }}>
                {statusVariant === 'rejected'
                  ? 'กรุณาแก้ไขคำขอตามหมายเหตุของเจ้าหน้าที่'
                  : 'คำขอได้รับการอนุมัติแล้ว'}
              </Text>
            </View>
          </View>

          {exportToast && (
            <View style={styles.exportSuccessBanner}>
              <Text
                style={{
                  fontSize: 12,
                  color: Colors.statusSuccessText,
                  fontWeight: '600',
                }}
              >
                ✓ {exportToast}
              </Text>
            </View>
          )}

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Pressable
              onPress={async () => {
                await onExportCsv(ev.id);
                setExportToast(`ดาวน์โหลดรายชื่อผู้เข้าร่วม (${ev.title}) สำเร็จ`);
                setTimeout(() => setExportToast(null), 4000);
              }}
              style={[styles.editSecondaryBtn, { flex: 1 }]}
            >
              <Text style={styles.editSecondaryBtnText}>ส่งออกรายชื่อ (.CSV)</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setExportToast(`สร้างไฟล์รายงานสรุปโครงการ (${ev.title}.pdf) สำเร็จ`);
                setTimeout(() => setExportToast(null), 4000);
              }}
              style={styles.darkReportBtn}
            >
              <Text style={{ color: '#FFF', fontSize: 14, fontWeight: '600' }}>พิมพ์รายงาน</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <OrganizerBottomNav
        subScreen={subScreen}
        setSubScreen={setSubScreen}
        hasUnread={hasUnread}
      />
    </View>
  );
}
