import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Colors } from '../../../constants/colors';
import { AdminModalType, AdminPage, AdminSlotKey } from '../types';
import { adminStyles as styles } from '../styles/admin.styles';

type Props = {
  activeModal: AdminModalType;
  setActiveModal: (m: AdminModalType) => void;
  setPage: (p: AdminPage) => void;
  currentReq: any;
  adminNote: string;
  setAdminNote: (val: string) => void;
  docPage: 1 | 2;
  setDocPage: (p: 1 | 2) => void;
  onConfirmApprove: () => Promise<void>;
  onConfirmReturn: () => Promise<void>;
  onLogout: () => void;
  setReqSearch: (q: string) => void;
  setReqDateFilter: (d: string) => void;
  setReqSort: (s: 'ส่งล่าสุดก่อน' | 'ส่งเก่าสุดก่อน') => void;
  venues: any[];
  editingVenue: any;
  setEditingVenueId: (id: string) => void;
  editingSlotKey: AdminSlotKey;
  setEditingSlotKey: (k: AdminSlotKey) => void;
  editingSlotVal: 'ว่าง' | 'ไม่ว่าง';
  setVenueDate: (d: string) => void;
  setUploadedVenueImg: (img: string | null) => void;
  onUpdateVenueSlots: (id: string, payload: any) => Promise<void>;
};

export function AdminModals({
  activeModal,
  setActiveModal,
  setPage,
  currentReq,
  adminNote,
  setAdminNote,
  docPage,
  setDocPage,
  onConfirmApprove,
  onConfirmReturn,
  onLogout,
  setReqSearch,
  setReqDateFilter,
  setReqSort,
  venues,
  editingVenue,
  setEditingVenueId,
  editingSlotKey,
  setEditingSlotKey,
  editingSlotVal,
  setVenueDate,
  setUploadedVenueImg,
  onUpdateVenueSlots,
}: Props) {
  if (!activeModal) return null;

  return (
    <View style={styles.modalBackdrop}>
      <View style={styles.modalCard}>
        {activeModal === 'confirm_approve' && (
          <>
            <Text style={styles.modalTitle}>ยืนยันอนุมัติคำขอ</Text>
            <Text style={styles.modalSub}>
              อนุมัติและเผยแพร่กิจกรรม &quot;{currentReq?.title}&quot; ไปยังหน้ารวมกิจกรรมของนักศึกษา
            </Text>
            <Pressable onPress={onConfirmApprove} style={styles.modalPrimaryBtn}>
              <Text style={styles.modalPrimaryBtnText}>ยืนยันอนุมัติ</Text>
            </Pressable>
            <Pressable onPress={() => setActiveModal(null)} style={styles.modalSecondaryBtn}>
              <Text style={styles.modalSecondaryBtnText}>ปิด</Text>
            </Pressable>
          </>
        )}

        {activeModal === 'approved_done' && (
          <>
            <Text style={styles.modalTitle}>อนุมัติคำขอแล้ว</Text>
            <Text style={styles.modalSub}>
              สถานะของคำขอเปลี่ยนเป็น “อนุมัติแล้ว” และเผยแพร่บนแอป E-MOD เรียบร้อยแล้ว
            </Text>
            <Pressable
              onPress={() => {
                setActiveModal(null);
                setPage('requests');
              }}
              style={styles.modalPrimaryBtn}
            >
              <Text style={styles.modalPrimaryBtnText}>กลับไปหน้าคำขอ</Text>
            </Pressable>
            <Pressable onPress={() => setActiveModal(null)} style={styles.modalSecondaryBtn}>
              <Text style={styles.modalSecondaryBtnText}>ปิด</Text>
            </Pressable>
          </>
        )}

        {activeModal === 'confirm_return' && (
          <>
            <Text style={styles.modalTitle}>ยืนยันส่งกลับแก้ไข</Text>
            <Text style={styles.modalSub}>
              หมายเหตุถึงผู้จัด: &quot;{adminNote || 'กรุณาตรวจสอบวัน เวลา และสถานที่ให้ตรงกับเอกสาร'}&quot;
            </Text>
            <Pressable
              onPress={() => setActiveModal('preset_notes')}
              style={styles.modalSecondaryBtn}
            >
              <Text style={styles.modalSecondaryBtnText}>เลือกข้อความหมายเหตุตัวอย่าง</Text>
            </Pressable>
            <Pressable onPress={onConfirmReturn} style={styles.modalDangerBtn}>
              <Text style={styles.modalPrimaryBtnText}>ยืนยันส่งกลับแก้ไข</Text>
            </Pressable>
            <Pressable onPress={() => setActiveModal(null)} style={styles.modalSecondaryBtn}>
              <Text style={styles.modalSecondaryBtnText}>ปิด</Text>
            </Pressable>
          </>
        )}

        {activeModal === 'returned_done' && (
          <>
            <Text style={styles.modalTitle}>ส่งกลับแก้ไขแล้ว</Text>
            <Text style={styles.modalSub}>
              สถานะของคำขอเปลี่ยนเป็น “ส่งกลับแก้ไข” พร้อมแจ้งเตือนไปยังผู้จัดกิจกรรมแล้ว
            </Text>
            <Pressable
              onPress={() => {
                setActiveModal(null);
                setPage('requests');
              }}
              style={styles.modalPrimaryBtn}
            >
              <Text style={styles.modalPrimaryBtnText}>กลับไปหน้าคำขอ</Text>
            </Pressable>
            <Pressable onPress={() => setActiveModal(null)} style={styles.modalSecondaryBtn}>
              <Text style={styles.modalSecondaryBtnText}>ปิด</Text>
            </Pressable>
          </>
        )}

        {activeModal === 'preset_notes' && (
          <>
            <Text style={styles.modalTitle}>หมายเหตุถึงผู้จัด</Text>
            <Text style={styles.modalSub}>เลือกข้อความตัวอย่างสำหรับส่งกลับให้ผู้จัดแก้ไข</Text>
            {[
              'กรุณาตรวจสอบวัน เวลา และสถานที่ให้ตรงกับเอกสาร',
              'กรุณาแนบเอกสารประกอบให้ครบถ้วน',
              'กรุณาปรับปรุงรายละเอียดกิจกรรมก่อนส่งใหม่',
            ].map((note) => (
              <Pressable
                key={note}
                onPress={() => {
                  setAdminNote(note);
                  setActiveModal(null);
                }}
                style={styles.modalOptionBtn}
              >
                <Text style={styles.modalOptionBtnText}>{note}</Text>
              </Pressable>
            ))}
            <Pressable onPress={() => setActiveModal(null)} style={styles.modalSecondaryBtn}>
              <Text style={styles.modalSecondaryBtnText}>ปิด</Text>
            </Pressable>
          </>
        )}

        {activeModal === 'doc_preview' && (
          <>
            <Text style={styles.modalTitle}>
              เล่มคำขอ · ตัวอย่างเอกสาร (หน้า {docPage} / {currentReq?.pdf_pages || 12})
            </Text>
            <Text style={styles.modalSub}>
              ไฟล์: {currentReq?.pdf_name || 'เล่มคำขอ.pdf'} • {currentReq?.pdf_size || '2.4 MB'}
            </Text>
            <View style={styles.docModalPreviewSheet}>
              {docPage === 1 ? (
                <>
                  <Text style={styles.docSheetHeader}>แบบเสนอโครงการกิจกรรมนักศึกษา</Text>
                  <Text style={styles.docSheetSubHeader}>
                    {currentReq?.title || 'โครงการอาสาพัฒนาชุมชน'}
                  </Text>
                  <Text style={styles.docSheetMeta}>
                    หน่วยงานผู้รับผิดชอบ: {currentReq?.organizer || 'ชมรมจิตอาสา'}
                  </Text>
                  <Text style={styles.docSheetSection}>1. หลักการและเหตุผล</Text>
                  <Text style={styles.docSheetBody}>
                    {currentReq?.description ||
                      'ส่งเสริมให้นักศึกษามีส่วนร่วมในการพัฒนาชุมชน และเรียนรู้การทำงานร่วมกันผ่านกิจกรรมอาสาที่ตอบโจทย์ความต้องการของพื้นที่รอบมหาวิทยาลัย'}
                  </Text>
                  <Text style={styles.docSheetSection}>
                    2. วัตถุประสงค์: สร้างจิตสาธารณะและทักษะการทำงานเป็นทีม
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.docSheetHeader}>หน้าที่ 2 · แผนการดำเนินงานและงบประมาณ</Text>
                  <Text style={styles.docSheetSection}>3. สถานที่และระยะเวลาดำเนินการ</Text>
                  <Text style={styles.docSheetBody}>
                    สถานที่: {currentReq?.venue} • วันที่ {currentReq?.event_date} ({currentReq?.event_time})
                  </Text>
                  <Text style={styles.docSheetSection}>4. จำนวนผู้เข้าร่วมและชั่วโมงกิจกรรม</Text>
                  <Text style={styles.docSheetBody}>
                    จำนวนนักศึกษาที่เปิดรับ {currentReq?.capacity} คน • ได้รับ {currentReq?.hours} ชั่วโมงกิจกรรม
                  </Text>
                </>
              )}
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Pressable
                onPress={() => setDocPage(docPage === 1 ? 2 : 1)}
                style={[styles.modalOptionBtn, { flex: 1 }]}
              >
                <Text style={styles.modalOptionBtnText}>
                  {docPage === 1 ? 'เปิดดูหน้าที่ 2 →' : '← กลับไปหน้าที่ 1'}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setActiveModal(null)}
                style={[styles.modalSecondaryBtn, { flex: 1 }]}
              >
                <Text style={styles.modalSecondaryBtnText}>ปิด</Text>
              </Pressable>
            </View>
          </>
        )}

        {activeModal === 'logout_confirm' && (
          <>
            <Text style={styles.modalTitle}>ออกจากระบบ · ผู้ดูแลระบบ</Text>
            <Text style={styles.modalSub}>
              คุณต้องการออกจากระบบจัดการกิจกรรม E-MOD Admin หรือไม่?
            </Text>
            <Pressable
              onPress={() => {
                setActiveModal(null);
                onLogout();
              }}
              style={styles.modalDangerBtn}
            >
              <Text style={styles.modalPrimaryBtnText}>กลับสู่หน้าจอเริ่มต้น (Login)</Text>
            </Pressable>
            <Pressable onPress={() => setActiveModal(null)} style={styles.modalSecondaryBtn}>
              <Text style={styles.modalSecondaryBtnText}>ปิด</Text>
            </Pressable>
          </>
        )}

        {activeModal === 'search_requests_preset' && (
          <>
            <Text style={styles.modalTitle}>ค้นหาคำขอ · ตัวอย่าง</Text>
            <Text style={styles.modalSub}>เลือกชื่อกิจกรรมเพื่อกรองรายการคำขออย่างรวดเร็ว</Text>
            {[
              'ค่ายอาสารักน้ำ รักปลา รักเราด้วยนะ',
              'เปิดโลกกิจกรรมแล้วทำไงจะได้ใจเธอ',
              'วิ่งเพื่อสุขภาพปากดีแล้ว สุขภาพต้องดีด้วย',
              'มาปั้นเซรามิกด้วยกันไหม',
              'สายลับจับคำผิด',
              'ใครอยากเป็นเศรษฐี',
            ].map((q) => (
              <Pressable
                key={q}
                onPress={() => {
                  setReqSearch(q);
                  setActiveModal(null);
                }}
                style={styles.modalOptionBtn}
              >
                <Text style={styles.modalOptionBtnText}>{q}</Text>
              </Pressable>
            ))}
            <Pressable
              onPress={() => {
                setReqSearch('');
                setActiveModal(null);
              }}
              style={styles.modalSecondaryBtn}
            >
              <Text style={styles.modalSecondaryBtnText}>ล้างการค้นหา</Text>
            </Pressable>
          </>
        )}

        {activeModal === 'filter_date_preset' && (
          <>
            <Text style={styles.modalTitle}>วันที่ส่งคำขอ</Text>
            <Text style={styles.modalSub}>กรองรายการคำขอตามวันที่ผู้จัดส่งเข้ามา</Text>
            {['ทั้งหมด', '14 พ.ย. 2569', '13 พ.ย. 2569', '12 พ.ย. 2569'].map((d) => (
              <Pressable
                key={d}
                onPress={() => {
                  setReqDateFilter(d);
                  setActiveModal(null);
                }}
                style={styles.modalOptionBtn}
              >
                <Text style={styles.modalOptionBtnText}>{d}</Text>
              </Pressable>
            ))}
            <Pressable onPress={() => setActiveModal(null)} style={styles.modalSecondaryBtn}>
              <Text style={styles.modalSecondaryBtnText}>ปิด</Text>
            </Pressable>
          </>
        )}

        {activeModal === 'sort_requests_preset' && (
          <>
            <Text style={styles.modalTitle}>เรียงรายการคำขอ</Text>
            <Text style={styles.modalSub}>เลือกลำดับการแสดงผลคำขอโพสต์กิจกรรม</Text>
            {(['ส่งล่าสุดก่อน', 'ส่งเก่าสุดก่อน'] as const).map((s) => (
              <Pressable
                key={s}
                onPress={() => {
                  setReqSort(s);
                  setActiveModal(null);
                }}
                style={styles.modalOptionBtn}
              >
                <Text style={styles.modalOptionBtnText}>{s}</Text>
              </Pressable>
            ))}
            <Pressable onPress={() => setActiveModal(null)} style={styles.modalSecondaryBtn}>
              <Text style={styles.modalSecondaryBtnText}>ปิด</Text>
            </Pressable>
          </>
        )}

        {activeModal === 'select_venue_modal' && (
          <>
            <Text style={styles.modalTitle}>เลือกสถานที่</Text>
            <Text style={styles.modalSub}>เลือกอาคารหรือสถานที่ที่ต้องการอัปเดตสถานะว่าง</Text>
            {venues.map((v) => (
              <Pressable
                key={v.id}
                onPress={() => {
                  setEditingVenueId(v.id);
                  setActiveModal(null);
                }}
                style={styles.modalOptionBtn}
              >
                <Text style={styles.modalOptionBtnText}>{v.name}</Text>
              </Pressable>
            ))}
            <Pressable onPress={() => setActiveModal(null)} style={styles.modalSecondaryBtn}>
              <Text style={styles.modalSecondaryBtnText}>ปิด</Text>
            </Pressable>
          </>
        )}

        {activeModal === 'select_timeslot_modal' && (
          <>
            <Text style={styles.modalTitle}>เลือกช่วงเวลา</Text>
            <Text style={styles.modalSub}>เลือกช่วงเวลาที่ต้องการกำหนดสถานะว่าง / ไม่ว่าง</Text>
            {(['08:00 – 12:00 น.', '12:00 – 16:00 น.', '16:00 – 20:00 น.'] as const).map(
              (slot) => (
                <Pressable
                  key={slot}
                  onPress={() => {
                    setEditingSlotKey(slot);
                    setActiveModal(null);
                  }}
                  style={styles.modalOptionBtn}
                >
                  <Text style={styles.modalOptionBtnText}>{slot}</Text>
                </Pressable>
              )
            )}
            <Pressable onPress={() => setActiveModal(null)} style={styles.modalSecondaryBtn}>
              <Text style={styles.modalSecondaryBtnText}>ปิด</Text>
            </Pressable>
          </>
        )}

        {activeModal === 'select_venue_date_modal' && (
          <>
            <Text style={styles.modalTitle}>เลือกวันที่</Text>
            <Text style={styles.modalSub}>
              เลือกวันที่ต้องการตรวจสอบและอัปเดตตารางสถานที่ว่าง
            </Text>
            {['18 พฤศจิกายน 2569', '24 พฤศจิกายน 2569'].map((d) => (
              <Pressable
                key={d}
                onPress={() => {
                  setVenueDate(d);
                  setActiveModal(null);
                }}
                style={styles.modalOptionBtn}
              >
                <Text style={styles.modalOptionBtnText}>{d}</Text>
              </Pressable>
            ))}
            <Pressable onPress={() => setActiveModal(null)} style={styles.modalSecondaryBtn}>
              <Text style={styles.modalSecondaryBtnText}>ปิด</Text>
            </Pressable>
          </>
        )}

        {activeModal === 'venue_saved_modal' && (
          <>
            <Text style={styles.modalTitle}>บันทึกการเปลี่ยนแปลงแล้ว</Text>
            <Text style={styles.modalSub}>
              อัปเดตตารางช่วงเวลาว่างของ &quot;{editingVenue?.name}&quot; ({editingSlotKey}: {editingSlotVal}) เรียบร้อยแล้ว
            </Text>
            <Pressable onPress={() => setActiveModal(null)} style={styles.modalPrimaryBtn}>
              <Text style={styles.modalPrimaryBtnText}>ตกลง / ปิด</Text>
            </Pressable>
          </>
        )}

        {activeModal === 'upload_venue_image_modal' && (
          <>
            <Text style={styles.modalTitle}>เลือกไฟล์รูปภาพสถานที่</Text>
            <Text style={styles.modalSub}>
              เลือกรูปภาพตัวอย่างสำหรับแสดงในหน้ารายละเอียดสถานที่ของ &quot;{editingVenue?.name}&quot;
            </Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {['/assets/figma/51eb6.png', '/assets/figma/9b2af.png', '/assets/figma/e9192.png'].map(
                (img) => (
                  <Pressable
                    key={img}
                    onPress={async () => {
                      setUploadedVenueImg(img);
                      if (editingVenue) {
                        await onUpdateVenueSlots(editingVenue.id, { image: img });
                      }
                      setActiveModal(null);
                    }}
                    style={{
                      flex: 1,
                      height: 90,
                      borderRadius: 8,
                      overflow: 'hidden',
                      borderWidth: 2,
                      borderColor: Colors.brandPrimary,
                    }}
                  >
                    <Image source={{ uri: img }} style={{ width: '100%', height: '100%' }} />
                  </Pressable>
                )
              )}
            </View>
            <Pressable onPress={() => setActiveModal(null)} style={styles.modalSecondaryBtn}>
              <Text style={styles.modalSecondaryBtnText}>ปิด</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}
