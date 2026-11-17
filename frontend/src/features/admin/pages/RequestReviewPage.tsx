import React from 'react';
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { Colors } from '../../../constants/colors';
import {
  IconArrowLeft,
  IconCalendar,
  IconLocation,
  IconUsers,
  IconClock,
  IconDocument,
  IconCheck,
} from '../../../components/Icons';
import { AdminPage, AdminModalType } from '../types';
import { adminStyles as styles } from '../styles/admin.styles';

type Props = {
  currentReq: any;
  setPage: (p: AdminPage) => void;
  setActiveModal: (m: AdminModalType) => void;
  docPage: 1 | 2;
  setDocPage: (p: 1 | 2) => void;
  checkDoc: boolean;
  setCheckDoc: (v: boolean) => void;
  checkInfo: boolean;
  setCheckInfo: (v: boolean) => void;
  checkVenue: boolean;
  setCheckVenue: (v: boolean) => void;
  adminNote: string;
  setAdminNote: (v: string) => void;
};

export function RequestReviewPage({
  currentReq,
  setPage,
  setActiveModal,
  docPage,
  setDocPage,
  checkDoc,
  setCheckDoc,
  checkInfo,
  setCheckInfo,
  checkVenue,
  setCheckVenue,
  adminNote,
  setAdminNote,
}: Props) {
  const statusBadgeStyle =
    currentReq.status === 'อนุมัติแล้ว'
      ? { bg: Colors.statusSuccessBg, text: Colors.statusSuccessText }
      : currentReq.status === 'ส่งกลับแก้ไข'
      ? { bg: Colors.statusErrorBg, text: Colors.statusError }
      : { bg: Colors.statusWarningBg, text: Colors.statusWarningText };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.workspaceContent}>
      <Pressable
        onPress={() => setPage('requests')}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
      >
        <IconArrowLeft size={22} color={Colors.textBody} />
        <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.textBody }}>
          กลับไปหน้าคำขอ
        </Text>
      </Pressable>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 8,
        }}
      >
        <Text style={styles.pageTitle}>ตรวจสอบคำขอโพสต์กิจกรรม</Text>
        <View style={[styles.reqStatusPill, { backgroundColor: statusBadgeStyle.bg }]}>
          <Text style={[styles.reqStatusPillText, { color: statusBadgeStyle.text }]}>
            {currentReq.status}
          </Text>
        </View>
      </View>

      <Text style={styles.pageSubTitle}>
        {currentReq.request_code} • ส่งเมื่อ {currentReq.submitted_date} เวลา{' '}
        {currentReq.submitted_time}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          gap: 24,
          alignItems: 'flex-start',
          marginTop: 12,
        }}
      >
        {/* Left Column: Event Details + Document Preview */}
        <View style={{ flex: 1.9, gap: 24 }}>
          <View style={styles.reviewSectionCard}>
            <Text style={styles.reviewCardHeading}>ข้อมูลกิจกรรม</Text>
            <Text style={{ fontSize: 24, fontWeight: '700', color: Colors.textHeading }}>
              {currentReq.title}
            </Text>
            <Text style={{ fontSize: 14, lineHeight: 22, color: Colors.textGray }}>
              {currentReq.description}
            </Text>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 28, marginTop: 8 }}>
              <View style={styles.iconLabelRow}>
                <IconCalendar size={20} color={Colors.brandPrimary} />
                <Text style={{ fontSize: 14, fontWeight: '500', color: Colors.textBody }}>
                  {currentReq.event_date} · {currentReq.event_time}
                </Text>
              </View>
              <View style={styles.iconLabelRow}>
                <IconLocation size={20} color={Colors.brandPrimary} />
                <Text style={{ fontSize: 14, color: Colors.textHeading }}>
                  {currentReq.venue}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 28 }}>
              <View style={styles.iconLabelRow}>
                <IconUsers size={20} color={Colors.brandPrimary} />
                <Text style={{ fontSize: 14, fontWeight: '500', color: Colors.textBody }}>
                  รับ {currentReq.capacity} คน
                </Text>
              </View>
              <View style={styles.iconLabelRow}>
                <IconClock size={20} color={Colors.brandPrimary} />
                <Text style={{ fontSize: 14, fontWeight: '500', color: Colors.textBody }}>
                  {currentReq.hours} ชั่วโมงกิจกรรม
                </Text>
              </View>
            </View>
          </View>

          {/* Document Preview Card */}
          <View style={styles.reviewSectionCard}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View>
                <Text style={styles.reviewCardHeading}>เล่มคำขอที่ผู้จัดส่งมา</Text>
                <Text style={{ fontSize: 12, color: Colors.textGray }}>
                  เอกสารตัวอย่างสำหรับแสดงรูปแบบการตรวจสอบ
                </Text>
              </View>
              <Pressable
                onPress={() => setActiveModal('doc_preview')}
                style={styles.grayActionBtn}
              >
                <Text style={styles.grayActionBtnText}>เปิดเอกสาร</Text>
              </Pressable>
            </View>

            <View style={styles.pdfMetaBar}>
              <IconDocument size={22} color={Colors.brandPrimary} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.textHeading }}>
                  {currentReq.pdf_name}
                </Text>
                <Text style={{ fontSize: 12, color: Colors.textGray }}>
                  {currentReq.pdf_size} · {currentReq.pdf_pages} หน้า · ส่ง{' '}
                  {currentReq.submitted_date}
                </Text>
              </View>
              <Pressable onPress={() => setDocPage(docPage === 1 ? 2 : 1)}>
                <Text style={{ fontSize: 12, color: Colors.brandPrimary, fontWeight: '600' }}>
                  หน้า {docPage} / {currentReq.pdf_pages} (สลับหน้า)
                </Text>
              </Pressable>
            </View>

            <View style={styles.docInlineContainer}>
              <View style={styles.docInlinePaper}>
                <Text style={styles.docSheetHeader}>แบบเสนอโครงการกิจกรรมนักศึกษา</Text>
                <Text style={styles.docSheetSubHeader}>{currentReq.title}</Text>
                <Text style={styles.docSheetMeta}>
                  หน่วยงานผู้รับผิดชอบ: {currentReq.organizer}
                </Text>
                <Text style={styles.docSheetSection}>1. หลักการและเหตุผล</Text>
                <Text style={styles.docSheetBody}>{currentReq.description}</Text>
                <Text style={styles.docSheetSection}>
                  2. วัตถุประสงค์: สร้างจิตสาธารณะและทักษะการทำงานเป็นทีม
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Right Column: Requester + Review Decision Panel */}
        <View style={{ flex: 1, gap: 24 }}>
          <View style={styles.reviewSectionCard}>
            <Text style={styles.reviewCardHeading}>ผู้ส่งคำขอ</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.textHeading }}>
              {currentReq.organizer}
            </Text>
            <Text style={{ fontSize: 14, color: Colors.textBody }}>
              ผู้ประสานงาน: {currentReq.coordinator}
            </Text>
            <Text style={{ fontSize: 12, color: Colors.textGray }}>{currentReq.email}</Text>
          </View>

          <View style={styles.reviewSectionCard}>
            <Text style={{ fontSize: 20, fontWeight: '600', color: Colors.textHeading }}>
              พิจารณาคำขอ
            </Text>
            <Text style={{ fontSize: 14, fontWeight: '500', color: Colors.textGray }}>
              รายการตรวจสอบก่อนอนุมัติ
            </Text>

            {[
              { label: 'ได้รับเล่มคำขอเรียบร้อยแล้ว', val: checkDoc, set: setCheckDoc },
              { label: 'ข้อมูลกิจกรรมตรงกับเอกสาร', val: checkInfo, set: setCheckInfo },
              { label: 'วัน เวลา และสถานที่ถูกต้อง', val: checkVenue, set: setCheckVenue },
            ].map((item) => (
              <Pressable
                key={item.label}
                onPress={() => item.set(!item.val)}
                style={styles.checkRow}
              >
                <View style={[styles.checkBox, item.val && styles.checkBoxChecked]}>
                  {item.val && <IconCheck size={16} color="#FFFFFF" />}
                </View>
                <Text style={{ fontSize: 14, color: Colors.textBody }}>{item.label}</Text>
              </Pressable>
            ))}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 8,
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: '500', color: Colors.textHeading }}>
                หมายเหตุถึงผู้จัด
              </Text>
              <Pressable onPress={() => setActiveModal('preset_notes')}>
                <Text style={{ fontSize: 12, color: Colors.brandPrimary, fontWeight: '600' }}>
                  + เลือกข้อความตัวอย่าง
                </Text>
              </Pressable>
            </View>

            <TextInput
              value={adminNote}
              onChangeText={setAdminNote}
              placeholder="ระบุรายละเอียดที่ต้องการให้ผู้จัดแก้ไข (จำเป็นเมื่อส่งกลับแก้ไข)"
              placeholderTextColor={Colors.textGray}
              multiline
              style={styles.adminNoteInput}
            />

            <Pressable
              onPress={() => setActiveModal('confirm_approve')}
              style={styles.modalPrimaryBtn}
            >
              <Text style={styles.modalPrimaryBtnText}>อนุมัติให้เผยแพร่กิจกรรม</Text>
            </Pressable>

            <Pressable
              onPress={() => setActiveModal('confirm_return')}
              style={styles.returnDarkBtn}
            >
              <Text style={styles.returnDarkBtnText}>ส่งกลับให้ผู้จัดแก้ไข</Text>
            </Pressable>

            <Text style={{ fontSize: 12, color: Colors.textGray }}>
              เมื่ออนุมัติ กิจกรรมจะแสดงในหน้ารวมกิจกรรมทันที
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
