import React from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Image } from 'react-native';
import { Colors } from '../../../constants/colors';
import {
  IconLocation,
  IconCheck,
  IconClock,
  IconSearch,
  IconCalendar,
} from '../../../components/Icons';
import { AdminModalType, AdminSlotKey } from '../types';
import { adminStyles as styles } from '../styles/admin.styles';

type Props = {
  venues: any[];
  venueSearch: string;
  setVenueSearch: (q: string) => void;
  venueDate: string;
  editingVenueId: string;
  setEditingVenueId: (id: string) => void;
  editingVenue: any;
  editingSlotKey: AdminSlotKey;
  editingSlotVal: 'ว่าง' | 'ไม่ว่าง';
  setEditingSlotVal: (val: 'ว่าง' | 'ไม่ว่าง') => void;
  uploadedVenueImg: string | null;
  onSelectVenueSlotCell: (
    venue: any,
    slotLabel: AdminSlotKey,
    currentVal: 'ว่าง' | 'ไม่ว่าง'
  ) => void;
  onSaveVenueAvailability: () => Promise<void>;
  setActiveModal: (m: AdminModalType) => void;
};

export function VenueManagePage({
  venues,
  venueSearch,
  setVenueSearch,
  venueDate,
  editingVenueId,
  setEditingVenueId,
  editingVenue,
  editingSlotKey,
  editingSlotVal,
  setEditingSlotVal,
  uploadedVenueImg,
  onSelectVenueSlotCell,
  onSaveVenueAvailability,
  setActiveModal,
}: Props) {
  const allDayFreeCount = venues.filter(
    (v) => v.slot_morning === 'ว่าง' && v.slot_afternoon === 'ว่าง' && v.slot_evening === 'ว่าง'
  ).length;
  const partialBusyCount = venues.length - allDayFreeCount;

  const filteredVenues = venues.filter((v) => {
    if (!venueSearch.trim()) return true;
    const q = venueSearch.trim().toLowerCase();
    return v.name.toLowerCase().includes(q) || v.code.toLowerCase().includes(q);
  });

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.workspaceContent}>
      <Text style={styles.pageTitle}>จัดการสถานที่</Text>
      <Text style={styles.pageSubTitle}>
        อัปเดตช่วงเวลาว่าง เพื่อให้ผู้จัดเลือกสถานที่ได้อย่างถูกต้อง
      </Text>

      {/* 3 Metric Cards (Figma 6029:3016) */}
      <View style={styles.metricsRow}>
        <View style={[styles.metricCard, { backgroundColor: Colors.brandPrimary }]}>
          <View style={{ flex: 1, gap: 8 }}>
            <Text style={styles.metricTitleWhite}>สถานที่ทั้งหมด</Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 16 }}>
              <Text style={styles.metricValueWhite}>200</Text>
              <Text style={styles.metricSubWhite}>แห่งในระบบ ({venues.length} อาคารหลัก)</Text>
            </View>
          </View>
          <IconLocation size={24} color="#FFFFFF" />
        </View>

        <View style={[styles.metricCard, { backgroundColor: Colors.brandPrimary }]}>
          <View style={{ flex: 1, gap: 8 }}>
            <Text style={styles.metricTitleWhite}>ว่างตลอดวัน</Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 16 }}>
              <Text style={styles.metricValueWhite}>{14 + allDayFreeCount}</Text>
              <Text style={styles.metricSubWhite}>แห่ง พร้อมเปิดให้จอง</Text>
            </View>
          </View>
          <IconCheck size={24} color="#FFFFFF" />
        </View>

        <View
          style={[
            styles.metricCard,
            { backgroundColor: Colors.bgSurface, borderWidth: 1, borderColor: Colors.brandPrimary },
          ]}
        >
          <View style={{ flex: 1, gap: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: '500', color: Colors.textMuted }}>
              มีการใช้งาน
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 16 }}>
              <Text style={{ fontSize: 28, fontWeight: '700', color: Colors.textPrimary }}>
                {partialBusyCount}
              </Text>
              <Text style={{ fontSize: 12, color: Colors.statusError }}>แห่ง บางช่วงเวลาไม่ว่าง</Text>
            </View>
          </View>
          <IconClock size={24} color={Colors.statusError} />
        </View>
      </View>

      {/* Search & Date Filter Row (Figma 6029:3017) */}
      <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center', marginTop: 8 }}>
        <View style={styles.adminSearchInputWrap}>
          <IconSearch size={18} color={Colors.textMuted} />
          <TextInput
            value={venueSearch}
            onChangeText={setVenueSearch}
            placeholder="ค้นหาชื่อสถานที่หรืออาคาร"
            placeholderTextColor={Colors.textMuted}
            style={styles.adminSearchInput}
          />
        </View>

        <Pressable
          onPress={() => setActiveModal('select_venue_date_modal')}
          style={styles.adminDateFilterBtn}
        >
          <IconCalendar size={20} color={Colors.brandPrimary} />
          <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.brandPrimary }}>
            {venueDate}
          </Text>
          <Text style={{ fontSize: 12, color: Colors.textMuted, marginLeft: 12 }}>เลือกวันที่</Text>
        </Pressable>
      </View>

      {/* Daily Venue Availability Table + Right Editor (Figma 6029:3019) */}
      <View style={{ flexDirection: 'row', gap: 24, alignItems: 'flex-start', marginTop: 8 }}>
        {/* Left Table */}
        <View style={styles.venueTableCard}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View>
              <Text style={{ fontSize: 18, fontWeight: '600', color: Colors.textHeading }}>
                ตารางสถานที่ว่าง
              </Text>
              <Text style={{ fontSize: 12, color: Colors.textGray }}>{venueDate}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={styles.slotBadgeAvail}>
                <Text style={styles.slotBadgeAvailText}>ว่าง</Text>
              </View>
              <View style={styles.slotBadgeBusy}>
                <Text style={styles.slotBadgeBusyText}>ไม่ว่าง</Text>
              </View>
            </View>
          </View>

          <View style={styles.tableHeaderBar}>
            <Text style={[styles.tableHeaderCell, { flex: 1.8 }]}>สถานที่ / ความจุ</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>08:00–12:00</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>12:00–16:00</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>16:00–20:00</Text>
          </View>

          {filteredVenues.map((v) => {
            const isSelectedVenue = v.id === editingVenueId;
            const cells: Array<{
              label: AdminSlotKey;
              val: 'ว่าง' | 'ไม่ว่าง';
            }> = [
              { label: '08:00 – 12:00 น.', val: v.slot_morning },
              { label: '12:00 – 16:00 น.', val: v.slot_afternoon },
              { label: '16:00 – 20:00 น.', val: v.slot_evening },
            ];

            return (
              <View
                key={v.id}
                style={[
                  styles.venueTableRow,
                  isSelectedVenue && { backgroundColor: '#FFF8EF' },
                ]}
              >
                <Pressable
                  onPress={() => setEditingVenueId(v.id)}
                  style={{ flex: 1.8, paddingRight: 8 }}
                >
                  <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.textHeading }}>
                    {v.name}
                  </Text>
                  <Text style={{ fontSize: 12, color: Colors.textGray }}>
                    ความจุ · {v.capacity} คน
                  </Text>
                </Pressable>

                {cells.map((c) => {
                  const isAvail = c.val === 'ว่าง';
                  const isCellSelected = isSelectedVenue && editingSlotKey === c.label;
                  return (
                    <Pressable
                      key={c.label}
                      onPress={() => onSelectVenueSlotCell(v, c.label, c.val)}
                      style={[
                        isAvail ? styles.slotBadgeAvail : styles.slotBadgeBusy,
                        { flex: 1, marginHorizontal: 4 },
                        isCellSelected && {
                          borderWidth: 2,
                          borderColor: Colors.brandPrimary,
                        },
                      ]}
                    >
                      <Text
                        style={
                          isAvail ? styles.slotBadgeAvailText : styles.slotBadgeBusyText
                        }
                      >
                        {c.val}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            );
          })}
        </View>

        {/* Right Editor Panel (Figma 8182:17790 อัปเดตสถานที่ว่าง) */}
        <View style={styles.venueEditorCard}>
          <Text style={styles.editorLabel}>สถานที่</Text>
          <Pressable onPress={() => setActiveModal('select_venue_modal')}>
            <Text style={styles.editorVenueTitle}>{editingVenue?.name}</Text>
          </Pressable>

          <Text style={styles.editorLabel}>วันที่</Text>
          <Pressable
            onPress={() => setActiveModal('select_venue_date_modal')}
            style={styles.editorFieldBtn}
          >
            <Text style={styles.editorFieldText}>{venueDate}</Text>
            <IconCalendar size={20} color={Colors.textHeading} />
          </Pressable>

          <Text style={styles.editorLabel}>ช่วงเวลา</Text>
          <Pressable
            onPress={() => setActiveModal('select_timeslot_modal')}
            style={styles.editorFieldBtn}
          >
            <Text style={styles.editorFieldText}>{editingSlotKey}</Text>
            <IconClock size={20} color={Colors.textHeading} />
          </Pressable>

          <Text style={styles.editorLabel}>สถานะการใช้สถานที่</Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Pressable
              onPress={() => setEditingSlotVal('ว่าง')}
              style={[
                styles.slotBadgeAvail,
                { flex: 1, height: 36 },
                editingSlotVal === 'ว่าง' && {
                  borderWidth: 2,
                  borderColor: Colors.statusSuccess,
                },
              ]}
            >
              <Text style={styles.slotBadgeAvailText}>✓ ว่าง</Text>
            </Pressable>
            <Pressable
              onPress={() => setEditingSlotVal('ไม่ว่าง')}
              style={[
                styles.slotBadgeBusy,
                { flex: 1, height: 36 },
                editingSlotVal === 'ไม่ว่าง' && {
                  borderWidth: 2,
                  borderColor: Colors.statusError,
                },
              ]}
            >
              <Text style={styles.slotBadgeBusyText}>✕ ไม่ว่าง</Text>
            </Pressable>
          </View>

          <Pressable
            onPress={onSaveVenueAvailability}
            style={[styles.modalPrimaryBtn, { marginTop: 18 }]}
          >
            <Text style={styles.modalPrimaryBtnText}>บันทึกการเปลี่ยนแปลง</Text>
          </Pressable>
        </View>
      </View>

      {/* Bottom Venue Image Upload Card (Figma 8174:4455) */}
      <View style={styles.venuePhotoUploadCard}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.textPrimary }}>
            รูปภาพสถานที่
          </Text>
          <Text style={{ fontSize: 14, color: Colors.textHeading }}>
            {editingVenue?.name}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 28, alignItems: 'center' }}>
          <Pressable
            onPress={() => setActiveModal('upload_venue_image_modal')}
            style={styles.venuePhotoDropzone}
          >
            {editingVenue?.image ? (
              <Image
                source={{ uri: uploadedVenueImg || editingVenue.image }}
                style={{ width: '100%', height: '100%', borderRadius: 8 }}
                resizeMode="cover"
              />
            ) : (
              <Text
                style={{ fontSize: 12, fontWeight: '600', color: Colors.textSecondary }}
              >
                + เพิ่มรูปภาพ
              </Text>
            )}
          </Pressable>

          <View style={{ flex: 1, gap: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.textPrimary }}>
              เพิ่มรูปภาพเพื่อให้ผู้จัดเห็นบรรยากาศของสถานที่
            </Text>
            <Text style={{ fontSize: 14, color: Colors.textSecondary }}>
              ลากรูปภาพมาวางในกรอบ หรือเลือกไฟล์จากอุปกรณ์
            </Text>
            <Text style={{ fontSize: 12, color: Colors.textSecondary }}>
              รูปภาพจะใช้แสดงในหน้ารายละเอียดสถานที่บนแอปผู้จัดและผู้เข้าร่วม
            </Text>
            <Pressable
              onPress={() => setActiveModal('upload_venue_image_modal')}
              style={[styles.modalPrimaryBtn, { width: 188, marginTop: 4 }]}
            >
              <Text style={styles.modalPrimaryBtnText}>เลือกไฟล์รูปภาพ</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
