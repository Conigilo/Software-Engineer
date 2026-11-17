import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Image } from 'react-native';
import { Colors } from '../../../constants/colors';
import {
  IconArrowLeft,
  IconSetting,
  IconDocument,
  IconCalendar,
} from '../../../components/Icons';
import { OrganizerSubScreen, OrganizerStatusVariant } from '../types';
import { organizerStyles as styles } from '../styles/organizer.styles';

type Props = {
  isEdit: boolean;
  selectedEvent: any | null;
  venueFull: string;
  setVenueFull: (v: string) => void;
  onCreateEvent: (payload: any) => Promise<{ event: any; requestCode: string }>;
  onUpdateEvent: (id: string, payload: any) => Promise<void>;
  setStatusVariant: (v: OrganizerStatusVariant) => void;
  setSubScreen: (s: OrganizerSubScreen) => void;
};

export function EventFormScreen({
  isEdit,
  selectedEvent,
  venueFull,
  setVenueFull,
  onCreateEvent,
  onUpdateEvent,
  setStatusVariant,
  setSubScreen,
}: Props) {
  const [orgName, setOrgName] = useState('ชมรมสืบสวนเยาวชน');
  const [title, setTitle] = useState('สายลับจับคำผิด');
  const [description, setDescription] = useState(
    'กิจกรรมบอร์ดเกมเสริมสร้างพัฒนาการและการเข้าสังคมกับคนหมู่มาก เพื่อความเข้ากันได้ และลดความเครียดจากการศึกษาของนักศึกษาภายในมหาวิทยาลัย'
  );
  const [maxParticipants, setMaxParticipants] = useState('30');
  const [hours, setHours] = useState('3');
  const [dateStr, setDateStr] = useState('30 กันยายน 2027');
  const [startTime, setStartTime] = useState('09 : 00');
  const [endTime, setEndTime] = useState('12 : 00');
  const [coverImage, setCoverImage] = useState('/assets/figma/86192.png');
  const [pdfUploaded, setPdfUploaded] = useState(true);
  const [pdfFileName] = useState('เล่มคำขอโครงการ_สายลับจับคำผิด.pdf');
  const [formValidationError, setFormValidationError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit && selectedEvent) {
      setOrgName(selectedEvent.organization || 'ชมรมสืบสวนเยาวชน');
      setTitle(selectedEvent.title || '');
      setDescription(selectedEvent.description || '');
      setMaxParticipants(String(selectedEvent.max_participants || 30));
      setHours(String(selectedEvent.hours || 3));
      setDateStr(selectedEvent.date || '18-11-2026');
      setVenueFull(selectedEvent.venue_full || 'Learning Space (N7)');
      setCoverImage(selectedEvent.image || '/assets/figma/62d1b.png');
    }
  }, [isEdit, selectedEvent, setVenueFull]);

  const coverOptions = [
    '/assets/figma/86192.png',
    '/assets/figma/62d1b.png',
    '/assets/figma/38f5d.png',
    '/assets/figma/f9c4c.png',
  ];

  const handleFormSubmit = async () => {
    if (!orgName.trim() || !title.trim() || !description.trim() || (!isEdit && !pdfUploaded)) {
      setFormValidationError(true);
      return;
    }
    setFormValidationError(false);
    setSubmitting(true);
    try {
      if (isEdit && selectedEvent) {
        await onUpdateEvent(selectedEvent.id, {
          title,
          organization: orgName,
          description,
          date: dateStr,
          start_time: startTime,
          end_time: endTime,
          venue_full: venueFull,
          max_participants: Number(maxParticipants) || 30,
          hours: Number(hours) || 3,
        });
        setSubScreen('my_events');
      } else {
        await onCreateEvent({
          title,
          organization: orgName,
          description,
          date: dateStr,
          start_time: startTime,
          end_time: endTime,
          venue_full: venueFull,
          max_participants: Number(maxParticipants) || 30,
          hours: Number(hours) || 3,
          image: coverImage,
          pdf_name: pdfFileName,
        });
        setStatusVariant('pending');
        setSubScreen('event_status');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.topMenuBar}>
        <Pressable onPress={() => setSubScreen('my_events')} style={styles.iconHitBox}>
          <IconArrowLeft size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.topMenuTitle}>{isEdit ? 'แก้ไขกิจกรรม' : 'สร้างกิจกรรม'}</Text>
        <Pressable onPress={() => setSubScreen('settings')} style={styles.iconHitBoxEnd}>
          <IconSetting size={24} color={Colors.textPrimary} />
        </Pressable>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 14, paddingBottom: 40 }}
      >
        {/* Notice Banner (Figma 8102:9933) */}
        <View style={styles.orangeNoticeCard}>
          <View style={styles.orangeNoticeIcon}>
            <IconDocument size={22} color={Colors.brandPrimary} />
          </View>
          <Text style={styles.orangeNoticeText}>ต้องใช้เอกสารโครงการเพื่อขอสร้างกิจกรรม</Text>
        </View>

        {/* Quick toggle to test Figma validation state 8202:20279 */}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Pressable
            onPress={() => {
              setTitle('');
              setPdfUploaded(false);
              setFormValidationError(true);
            }}
            style={styles.demoStateChip}
          >
            <Text style={styles.demoStateChipText}>จำลองสถานะ &quot;ใส่ไม่ครบ&quot;</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setOrgName('ชมรมสืบสวนเยาวชน');
              setTitle('สายลับจับคำผิด');
              setPdfUploaded(true);
              setFormValidationError(false);
            }}
            style={styles.demoStateChip}
          >
            <Text style={styles.demoStateChipText}>กรอกข้อมูลครบถ้วน</Text>
          </Pressable>
        </View>

        {formValidationError && (
          <View style={styles.validationBanner}>
            <Text style={styles.validationBannerText}>
              ! กรุณากรอกข้อมูลที่มีเครื่องหมายจำเป็น และแนบเอกสารยืนยันโครงการให้ครบถ้วน
            </Text>
          </View>
        )}

        {/* Section 1: ข้อมูลผู้จัดกิจกรรม */}
        <View style={styles.formSectionCard}>
          <Text style={styles.formSectionHeading}>1. ข้อมูลผู้จัดกิจกรรม</Text>
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>
              ชื่อองค์กร{' '}
              <Text style={styles.fieldHint}>เช่น ชมรมจิตอาสา ชมรมกีฬา สภานักศึกษา</Text>
            </Text>
            <TextInput
              value={orgName}
              onChangeText={setOrgName}
              placeholder="ระบุชื่อชมรมหรือองค์กร"
              style={[
                styles.textInputBox,
                formValidationError && !orgName.trim() && styles.textInputError,
              ]}
            />
          </View>
        </View>

        {/* Section 2: ข้อมูลกิจกรรม */}
        <View style={styles.formSectionCard}>
          <Text style={styles.formSectionHeading}>2. ข้อมูลกิจกรรม</Text>
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>ชื่อกิจกรรม</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="ระบุชื่อกิจกรรม"
              style={[
                styles.textInputBox,
                formValidationError && !title.trim() && styles.textInputError,
              ]}
            />
          </View>
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>รายละเอียดกิจกรรม</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              style={[
                styles.textInputBox,
                { height: 100, textAlignVertical: 'top', paddingTop: 10 },
              ]}
            />
          </View>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={[styles.fieldWrap, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>จำนวนผู้เข้าร่วม</Text>
              <TextInput
                value={maxParticipants}
                onChangeText={setMaxParticipants}
                keyboardType="numeric"
                style={styles.textInputBox}
              />
            </View>
            <View style={[styles.fieldWrap, { flex: 1 }]}>
              <Text style={styles.fieldLabel}>ชั่วโมงกิจกรรม</Text>
              <TextInput
                value={hours}
                onChangeText={setHours}
                keyboardType="numeric"
                style={styles.textInputBox}
              />
            </View>
          </View>
        </View>

        {/* Section 3: วันที่และสถานที่ */}
        <View style={styles.formSectionCard}>
          <Text style={styles.formSectionHeading}>3. วันที่</Text>
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>วันที่จัดกิจกรรม</Text>
            <View style={styles.inputWithIconBox}>
              <TextInput
                value={dateStr}
                onChangeText={setDateStr}
                style={[styles.inputInner, { flex: 1 }]}
              />
              <IconCalendar size={20} color={Colors.textHeading} />
            </View>
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>เวลา</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <TextInput
                value={startTime}
                onChangeText={setStartTime}
                style={[styles.textInputBox, { flex: 1, textAlign: 'center' }]}
              />
              <Text style={{ fontWeight: '700', color: Colors.textGray }}>—</Text>
              <TextInput
                value={endTime}
                onChangeText={setEndTime}
                style={[styles.textInputBox, { flex: 1, textAlign: 'center' }]}
              />
            </View>
          </View>

          <View style={styles.fieldWrap}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.fieldLabel}>สถานที่</Text>
              <Pressable onPress={() => setSubScreen('venues')}>
                <Text style={{ fontSize: 12, color: Colors.brandPrimary, fontWeight: '600' }}>
                  ดูตารางสถานที่ว่าง →
                </Text>
              </Pressable>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              {[
                'N10 : อาคารสำนักหอสมุด',
                'Learning Space (N7)',
                'N16 : อาคารการเรียนรู้พหุวิทยาการ',
                'S14 : อาคารพระจอมเกล้าราชานุสรณ์ 190 ปี',
              ].map((v) => {
                const selected = venueFull === v;
                return (
                  <Pressable
                    key={v}
                    onPress={() => setVenueFull(v)}
                    style={[styles.filterPill, selected && styles.filterPillActive]}
                  >
                    <Text
                      style={[styles.filterPillText, selected && styles.filterPillTextActive]}
                    >
                      {v}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>

        {/* Section 4: รูปภาพ */}
        <View style={styles.formSectionCard}>
          <Text style={styles.formSectionHeading}>4. รูปภาพ (1 / 10)</Text>
          <View style={styles.dashedUploadBox}>
            <Image
              source={{ uri: coverImage }}
              style={{ width: 64, height: 64, borderRadius: 8 }}
            />
            <Text style={styles.uploadHintText}>
              รูปภาพรูปแรกจะเป็นหน้าปก (คลิกเลือกรูปด้านล่าง)
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {coverOptions.map((img) => (
              <Pressable
                key={img}
                onPress={() => setCoverImage(img)}
                style={[
                  styles.coverOptionThumbWrap,
                  coverImage === img && { borderColor: Colors.brandPrimary, borderWidth: 2 },
                ]}
              >
                <Image source={{ uri: img }} style={{ width: '100%', height: '100%' }} />
              </Pressable>
            ))}
          </View>
        </View>

        {/* Section 5: เอกสารยืนยันโครงการ */}
        <View style={styles.formSectionCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Text style={styles.formSectionHeading}>5. เอกสารยืนยันโครงการ</Text>
            <View style={styles.requiredOrangeBadge}>
              <Text style={styles.requiredOrangeBadgeText}>จำเป็น</Text>
            </View>
          </View>
          <Pressable
            onPress={() => setPdfUploaded(!pdfUploaded)}
            style={[
              styles.dashedUploadBox,
              { backgroundColor: pdfUploaded ? Colors.statusSuccessBg : '#E0E0E0' },
              formValidationError && !pdfUploaded && { borderColor: Colors.statusError },
            ]}
          >
            <IconDocument
              size={24}
              color={pdfUploaded ? Colors.statusSuccess : Colors.textGray}
            />
            <Text
              style={[
                styles.uploadHintText,
                pdfUploaded && { color: Colors.statusSuccessText, fontWeight: '700' },
              ]}
            >
              {pdfUploaded
                ? `✓ แนบไฟล์แล้ว: ${pdfFileName} (2.6 MB)`
                : 'คลิกเพื่ออัปโหลดรูปเล่มโครงการ (.pdf)'}
            </Text>
          </Pressable>
        </View>

        <Pressable
          onPress={handleFormSubmit}
          disabled={submitting}
          style={[
            styles.submitBtn,
            (!orgName.trim() || !title.trim() || (!isEdit && !pdfUploaded)) && {
              backgroundColor: Colors.darkGray,
            },
          ]}
        >
          <Text style={styles.submitBtnText}>
            {submitting
              ? 'กำลังบันทึกข้อมูล...'
              : isEdit
              ? 'บันทึกการแก้ไขกิจกรรม'
              : 'ส่งคำขอสร้างกิจกรรม'}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
