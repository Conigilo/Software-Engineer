import React from 'react';
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { Colors } from '../../../constants/colors';
import {
  IconClock,
  IconCheck,
  IconEdit,
  IconSearch,
  IconCalendar,
  IconDocument,
} from '../../../components/Icons';
import { AdminPage, AdminModalType } from '../types';
import { adminStyles as styles } from '../styles/admin.styles';

type Props = {
  counts: any;
  sortedRequests: any[];
  reqStatusFilter: 'ทั้งหมด' | 'รอตรวจสอบ' | 'อนุมัติแล้ว' | 'ส่งกลับแก้ไข';
  setReqStatusFilter: (
    s: 'ทั้งหมด' | 'รอตรวจสอบ' | 'อนุมัติแล้ว' | 'ส่งกลับแก้ไข'
  ) => void;
  reqSearch: string;
  setReqSearch: (q: string) => void;
  reqDateFilter: string;
  reqSort: 'ส่งล่าสุดก่อน' | 'ส่งเก่าสุดก่อน';
  setActiveModal: (m: AdminModalType) => void;
  onSelectRequest: (r: any) => void;
  setAdminNote: (n: string) => void;
  setPage: (p: AdminPage) => void;
};

export function RequestsListPage({
  counts,
  sortedRequests,
  reqStatusFilter,
  setReqStatusFilter,
  reqSearch,
  setReqSearch,
  reqDateFilter,
  reqSort,
  setActiveModal,
  onSelectRequest,
  setAdminNote,
  setPage,
}: Props) {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.workspaceContent}>
      <Text style={styles.pageTitle}>คำขอโพสต์กิจกรรม</Text>
      <Text style={styles.pageSubTitle}>
        ตรวจเล่มคำขอจากผู้จัด ก่อนอนุมัติให้เผยแพร่บน E-MOD
      </Text>

      {/* 3 Metric Cards (Figma 6029:3125) */}
      <View style={styles.metricsRow}>
        <Pressable
          onPress={() => setReqStatusFilter('รอตรวจสอบ')}
          style={[styles.metricCard, { backgroundColor: Colors.statusWarningCard }]}
        >
          <View style={{ flex: 1, gap: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.statusWarning }}>
              รอตรวจสอบ
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 16 }}>
              <Text style={{ fontSize: 28, fontWeight: '700', color: Colors.statusWarning }}>
                {counts.pending}
              </Text>
              <Text style={{ fontSize: 12, color: Colors.textGray }}>คำขอ รอการพิจารณา</Text>
            </View>
          </View>
          <IconClock size={24} color={Colors.statusWarning} />
        </Pressable>

        <Pressable
          onPress={() => setReqStatusFilter('อนุมัติแล้ว')}
          style={[styles.metricCard, { backgroundColor: Colors.brandAccent }]}
        >
          <View style={{ flex: 1, gap: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.brandTeal }}>
              อนุมัติแล้ว
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 16 }}>
              <Text style={{ fontSize: 28, fontWeight: '700', color: Colors.brandTealDark }}>
                {24 + counts.approved}
              </Text>
              <Text style={{ fontSize: 12, color: Colors.textGray }}>กิจกรรม เผยแพร่แล้ว</Text>
            </View>
          </View>
          <IconCheck size={24} color={Colors.brandTealDark} />
        </Pressable>

        <Pressable
          onPress={() => setReqStatusFilter('ส่งกลับแก้ไข')}
          style={[styles.metricCard, { backgroundColor: Colors.statusErrorBg }]}
        >
          <View style={{ flex: 1, gap: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.statusError }}>
              ส่งกลับแก้ไข
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 16 }}>
              <Text style={{ fontSize: 28, fontWeight: '700', color: Colors.statusError }}>
                {3 + counts.returned}
              </Text>
              <Text style={{ fontSize: 12, color: Colors.textGray }}>คำขอ รอผู้จัดส่งใหม่</Text>
            </View>
          </View>
          <IconEdit size={24} color={Colors.statusError} />
        </Pressable>
      </View>

      {/* Status Tabs Row */}
      <View style={styles.reqTabsRow}>
        {(
          [
            { id: 'รอตรวจสอบ', label: `รอตรวจสอบ  ${counts.pending}` },
            { id: 'อนุมัติแล้ว', label: `อนุมัติแล้ว  ${24 + counts.approved}` },
            { id: 'ส่งกลับแก้ไข', label: `ส่งกลับแก้ไข  ${3 + counts.returned}` },
            { id: 'ทั้งหมด', label: `ทั้งหมด  ${27 + counts.total}` },
          ] as const
        ).map((t) => {
          const active = reqStatusFilter === t.id;
          return (
            <Pressable
              key={t.id}
              onPress={() => setReqStatusFilter(t.id)}
              style={[styles.reqTabBtn, active && styles.reqTabBtnActive]}
            >
              <Text style={[styles.reqTabText, active && styles.reqTabTextActive]}>
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Search, Date Filter & Sort Row */}
      <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
        <View style={[styles.adminSearchInputWrap, { flex: 1.5 }]}>
          <IconSearch size={18} color={Colors.textGray} />
          <TextInput
            value={reqSearch}
            onChangeText={setReqSearch}
            placeholder="ค้นหาชื่อกิจกรรม ผู้จัด หรือเลขที่คำขอ"
            placeholderTextColor={Colors.textGray}
            style={styles.adminSearchInput}
          />
          <Pressable onPress={() => setActiveModal('search_requests_preset')}>
            <Text style={{ fontSize: 12, color: Colors.brandPrimary, fontWeight: '600' }}>
              ตัวอย่าง ▾
            </Text>
          </Pressable>
        </View>

        <Pressable
          onPress={() => setActiveModal('filter_date_preset')}
          style={styles.adminDateFilterBtn}
        >
          <IconCalendar size={20} color={Colors.textHeading} />
          <Text style={{ fontSize: 14, fontWeight: '500', color: Colors.textHeading }}>
            วันที่ส่งคำขอ: {reqDateFilter}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveModal('sort_requests_preset')}
          style={{ paddingHorizontal: 12, paddingVertical: 10 }}
        >
          <Text style={{ fontSize: 14, fontWeight: '500', color: Colors.textGray }}>
            เรียงตาม: {reqSort} ▾
          </Text>
        </Pressable>
      </View>

      {/* Requests Table */}
      <View style={styles.requestsTableCard}>
        <View style={styles.tableHeaderBar}>
          <Text style={[styles.tableHeaderCell, { flex: 2.2 }]}>กิจกรรม / เลขที่คำขอ</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1.3 }]}>ผู้จัดกิจกรรม</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1.3 }]}>เล่มคำขอ</Text>
          <Text style={[styles.tableHeaderCell, { flex: 1.1 }]}>สถานะ</Text>
          <Text style={[styles.tableHeaderCell, { width: 130, textAlign: 'center' }]}>
            จัดการ
          </Text>
        </View>

        {sortedRequests.map((r) => {
          const badge =
            r.status === 'อนุมัติแล้ว'
              ? { bg: Colors.statusSuccessBg, color: Colors.statusSuccessText }
              : r.status === 'ส่งกลับแก้ไข'
              ? { bg: Colors.statusErrorBg, color: Colors.statusError }
              : { bg: Colors.statusWarningBg, color: Colors.statusWarningText };

          return (
            <View key={r.id} style={styles.requestTableRow}>
              <View style={{ flex: 2.2, paddingRight: 12 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.textHeading }}>
                  {r.title}
                </Text>
                <Text style={{ fontSize: 12, color: Colors.textGray }}>
                  {r.request_code} • {r.submitted_date}
                </Text>
              </View>

              <View style={{ flex: 1.3 }}>
                <Text style={{ fontSize: 14, color: Colors.textBody }}>{r.organizer}</Text>
              </View>

              <Pressable
                onPress={() => {
                  onSelectRequest(r);
                  setActiveModal('doc_preview');
                }}
                style={{ flex: 1.3, flexDirection: 'row', alignItems: 'center', gap: 8 }}
              >
                <IconDocument size={22} color={Colors.brandPrimary} />
                <View>
                  <Text style={{ fontSize: 12, color: Colors.textBody, fontWeight: '500' }}>
                    {r.pdf_name}
                  </Text>
                  <Text style={{ fontSize: 11, color: Colors.textGray }}>
                    {r.pdf_pages} หน้า · {r.pdf_size}
                  </Text>
                </View>
              </Pressable>

              <View style={{ flex: 1.1, alignItems: 'flex-start' }}>
                <View style={[styles.reqStatusPill, { backgroundColor: badge.bg }]}>
                  <Text style={[styles.reqStatusPillText, { color: badge.color }]}>
                    {r.status}
                  </Text>
                </View>
              </View>

              <View style={{ width: 130, alignItems: 'center' }}>
                <Pressable
                  onPress={() => {
                    onSelectRequest(r);
                    setAdminNote(r.admin_note || '');
                    setPage('review');
                  }}
                  style={styles.inspectBtn}
                >
                  <Text style={styles.inspectBtnText}>ตรวจสอบ</Text>
                </Pressable>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
