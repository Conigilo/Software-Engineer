import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { IconCheck } from '../../components/Icons';

interface AdminLoginScreenProps {
  onLoginApi: (email: string) => Promise<any>;
  onLoginSuccess: (user: any) => void;
  onSwitchToMobileApp: () => void;
}

export function AdminLoginScreen({
  onLoginApi,
  onLoginSuccess,
  onSwitchToMobileApp,
}: AdminLoginScreenProps) {
  const [email, setEmail] = useState('staff.affairs@kmutt.ac.th');
  const [password, setPassword] = useState('••••••••••••');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const trimmed = email.trim().toLowerCase();
  const isValidKmutt =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) &&
    (trimmed.endsWith('@kmutt.ac.th') || trimmed.endsWith('@mail.kmutt.ac.th'));

  const handleLogin = async () => {
    if (!isValidKmutt) {
      setErrorMsg('กรุณาใช้อีเมลบุคลากรมหาวิทยาลัย (@kmutt.ac.th) เท่านั้น');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await onLoginApi(trimmed);
      onLoginSuccess(res.user);
    } catch (err: any) {
      setErrorMsg(err?.message || 'ไม่สามารถเข้าสู่ระบบผู้ดูแลได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.webPage}>
      {/* Top Web Header Bar for Staff Portal */}
      <View style={styles.webTopBar}>
        <View style={styles.brandRow}>
          <View style={styles.logoSquare}>
            <Text style={styles.logoLetter}>E</Text>
          </View>
          <View>
            <Text style={styles.brandTitle}>E-MOD Staff Portal</Text>
            <Text style={styles.brandSub}>
              ระบบบริหารจัดการสถานที่และอนุมัติกิจกรรม (Web Application สำหรับเจ้าหน้าที่)
            </Text>
          </View>
        </View>

        <Pressable onPress={onSwitchToMobileApp} style={styles.switchAppBtn}>
          <Text style={styles.switchAppBtnText}>
            📱 สลับไปดูฝั่งแอพมือถือ (สำหรับ User ทั่วไป)
          </Text>
        </Pressable>
      </View>

      {/* Main Split Web Login Container */}
      <View style={styles.mainContent}>
        <View style={styles.loginCard}>
          <View style={styles.badgePill}>
            <Text style={styles.badgePillText}>💻 STAFF & ADMIN WEB APPLICATION</Text>
          </View>

          <Text style={styles.heading}>เข้าสู่ระบบสำหรับเจ้าหน้าที่</Text>
          <Text style={styles.subheading}>
            ฝ่ายกิจการนักศึกษาและผู้ดูแลอาคารสถานที่ มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี
          </Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>อีเมลบุคลากร (@kmutt.ac.th)</Text>
            <View style={[styles.inputBox, isValidKmutt && styles.inputBoxValid]}>
              <TextInput
                value={email}
                onChangeText={(v) => {
                  setEmail(v);
                  setErrorMsg('');
                }}
                placeholder="staff.affairs@kmutt.ac.th"
                style={styles.input}
                autoCapitalize="none"
              />
              {isValidKmutt && (
                <View style={styles.checkCircle}>
                  <IconCheck size={14} color={Colors.statusSuccess} />
                </View>
              )}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>รหัสผ่าน (KMUTT SSO Password)</Text>
            <View style={styles.inputBox}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
              />
            </View>
          </View>

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          <Pressable
            onPress={handleLogin}
            disabled={loading}
            style={({ pressed }) => [
              styles.submitBtn,
              pressed && { backgroundColor: Colors.brandPrimaryHover },
            ]}
          >
            <Text style={styles.submitBtnText}>
              {loading
                ? 'กำลังตรวจสอบสิทธิ์...'
                : 'เข้าสู่ระบบจัดการคำขอและสถานที่ (Web Portal)'}
            </Text>
          </Pressable>

          <View style={styles.architectureNote}>
            <Text style={styles.archTitle}>
              🔗 เชื่อมต่อฐานข้อมูลเดียวกับแอพมือถือของนักศึกษา
            </Text>
            <Text style={styles.archDesc}>
              คำขอจัดกิจกรรมที่ส่งมาจากแอพมือถือ E-MOD (ฝั่งผู้จัดกิจกรรม)
              จะแสดงในตารางตรวจสอบบนหน้าเว็บนี้ทันทีแบบ Real-time
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  webPage: {
    flex: 1,
    minHeight: '100%' as any,
    backgroundColor: Colors.bgDefault,
  },
  webTopBar: {
    height: 72,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDefault,
    paddingHorizontal: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoSquare: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: Colors.brandTeal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLetter: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textHeading,
  },
  brandSub: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  switchAppBtn: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FDBA74',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  switchAppBtnText: {
    color: Colors.brandPrimaryHover,
    fontSize: 13,
    fontWeight: '700',
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loginCard: {
    width: 500,
    maxWidth: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 40,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    shadowColor: '#25352F',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 30,
    gap: 16,
  },
  badgePill: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.bgSubtle,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 99,
  },
  badgePillText: {
    color: Colors.brandTeal,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textHeading,
  },
  subheading: {
    fontSize: 13,
    lineHeight: 20,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  formGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textHeading,
  },
  inputBox: {
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.borderGray,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputBoxValid: {
    borderColor: Colors.statusSuccess,
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.textHeading,
    outlineStyle: 'none' as any,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.statusSuccessBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 12,
    color: Colors.statusError,
    fontWeight: '600',
  },
  submitBtn: {
    height: 52,
    borderRadius: 12,
    backgroundColor: Colors.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  architectureNote: {
    marginTop: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  archTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.brandTeal,
  },
  archDesc: {
    fontSize: 11,
    lineHeight: 17,
    color: Colors.textSecondary,
  },
});
