import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { IconCheck } from '../../components/Icons';

type MobileLoginScreenProps = {
  onLoginSuccess: (user: any, initialMode?: 'participant' | 'organizer') => void;
  onLoginApi: (email: string) => Promise<any>;
};

export function MobileLoginScreen({ onLoginSuccess, onLoginApi }: MobileLoginScreenProps) {
  const [email, setEmail] = useState('student@kmutt.ac.th');
  const [errorState, setErrorState] = useState<'none' | 'invalid_format' | 'university_required'>(
    'none'
  );
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const trimmed = email.trim().toLowerCase();
  const isFormatValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  const isUniversityDomain =
    trimmed.endsWith('@kmutt.ac.th') ||
    trimmed.endsWith('@mail.kmutt.ac.th') ||
    trimmed.endsWith('@university.ac.th');
  const isReady = isFormatValid && isUniversityDomain;

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (errorState !== 'none') {
      setErrorState('none');
      setErrorMessage('');
    }
  };

  const handleSubmit = async (
    targetMode?: 'participant' | 'organizer',
    overrideEmail?: string
  ) => {
    const targetEmail = (overrideEmail ?? email).trim().toLowerCase();
    const validFmt = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(targetEmail);
    if (!targetEmail || !validFmt) {
      setErrorState('invalid_format');
      setErrorMessage('รูปแบบอีเมลไม่ถูกต้อง กรุณากรอกอีเมล เช่น student@kmutt.ac.th');
      return;
    }
    const validUni =
      targetEmail.endsWith('@kmutt.ac.th') ||
      targetEmail.endsWith('@mail.kmutt.ac.th') ||
      targetEmail.endsWith('@university.ac.th');
    if (!validUni) {
      setErrorState('university_required');
      setErrorMessage('กรุณาใช้อีเมลมหาวิทยาลัย (@kmutt.ac.th) เท่านั้นในการเข้าสู่ระบบ');
      return;
    }

    const inferredMode =
      targetMode ||
      (targetEmail.startsWith('organizer') || targetEmail.startsWith('club')
        ? 'organizer'
        : 'participant');

    setLoading(true);
    try {
      const res = await onLoginApi(targetEmail);
      onLoginSuccess(res.user, inferredMode);
    } catch (err: any) {
      if (err?.code === 'UNIVERSITY_EMAIL_REQUIRED') {
        setErrorState('university_required');
      } else {
        setErrorState('invalid_format');
      }
      setErrorMessage(err?.message || 'ไม่สามารถเข้าสู่ระบบได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Identity (Figma 4003:2153) */}
      <View style={styles.identityBox}>
        <View style={styles.logoMark}>
          <Text style={styles.logoMarkText}>E</Text>
        </View>
        <Text style={styles.brandTitle}>E-MOD</Text>
      </View>

      {/* Welcome (Figma 4003:2154) */}
      <View style={styles.welcomeBox}>
        <Text style={styles.welcomeHeading}>ยินดีต้อนรับสู่ E-MOD</Text>
        <Text style={styles.welcomeSub}>ค้นหากิจกรรมที่สนใจในมหาวิทยาลัย</Text>
        <Text style={styles.welcomeSub}>เริ่มต้นด้วยอีเมลมหาวิทยาลัยของคุณ</Text>
      </View>

      {/* Email Login Form (Figma 4003:2155) */}
      <View style={styles.formBox}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>อีเมลมหาวิทยาลัย</Text>
          <View
            style={[
              styles.inputWrapper,
              isReady && errorState === 'none' && styles.inputWrapperReady,
              errorState !== 'none' && styles.inputWrapperError,
            ]}
          >
            <TextInput
              value={email}
              onChangeText={handleEmailChange}
              placeholder="student@kmutt.ac.th"
              placeholderTextColor={Colors.textGray}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />
            {isReady && errorState === 'none' && (
              <View style={styles.readyBadge}>
                <IconCheck size={16} color={Colors.statusSuccess} />
              </View>
            )}
          </View>
          {errorState === 'none' ? (
            <Text style={[styles.helperText, isReady && { color: Colors.statusSuccess }]}>
              {isReady
                ? 'อีเมลมหาวิทยาลัยถูกต้อง พร้อมเข้าสู่ระบบ'
                : 'กรอกอีเมลมหาวิทยาลัยเพื่อเข้าสู่ระบบ'}
            </Text>
          ) : (
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}
        </View>

        <Pressable
          onPress={() => handleSubmit()}
          disabled={loading}
          style={({ pressed }) => [
            styles.loginButton,
            pressed && { backgroundColor: Colors.brandPrimaryHover },
          ]}
        >
          <Text style={styles.loginButtonText}>
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </Text>
        </Pressable>

        {/* Quick Role & Validation Presets */}
        <View style={styles.quickTestSection}>
          <Text style={styles.quickTestTitle}>เลือกบัญชีจำลองเพื่อเข้าใช้งานแอพมือถือ:</Text>
          <View style={styles.quickButtonsRow}>
            <Pressable
              style={[styles.quickChip, styles.quickChipPrimary]}
              onPress={() => {
                setEmail('student@kmutt.ac.th');
                setErrorState('none');
                handleSubmit('participant', 'student@kmutt.ac.th');
              }}
            >
              <Text style={styles.quickChipPrimaryText}>🙋‍♂️ นักศึกษา (ผู้เข้าร่วม)</Text>
            </Pressable>
            <Pressable
              style={[styles.quickChip, styles.quickChipPrimary]}
              onPress={() => {
                setEmail('organizer@kmutt.ac.th');
                setErrorState('none');
                handleSubmit('organizer', 'organizer@kmutt.ac.th');
              }}
            >
              <Text style={styles.quickChipPrimaryText}>📋 ชมรม (ผู้จัดกิจกรรม)</Text>
            </Pressable>
          </View>
          <View style={styles.quickButtonsRow}>
            <Pressable
              style={styles.quickChip}
              onPress={() => {
                setEmail('user@gmail.com');
                setErrorState('university_required');
                setErrorMessage('ต้องใช้อีเมลมหาวิทยาลัย (@kmutt.ac.th) เท่านั้นในการเข้าสู่ระบบ');
              }}
            >
              <Text style={styles.quickChipText}>ทดสอบอีเมลผิดโดเมน</Text>
            </Pressable>
            <Pressable
              style={styles.quickChip}
              onPress={() => {
                setEmail('invalid-email');
                setErrorState('invalid_format');
                setErrorMessage('รูปแบบอีเมลไม่ถูกต้อง กรุณากรอกอีเมลให้ครบถ้วน');
              }}
            >
              <Text style={styles.quickChipText}>ทดสอบรูปแบบอีเมลผิด</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* University access notice (Figma 8258:7896) */}
      <View style={styles.noticeBox}>
        <Text style={styles.noticeTitle}>สำหรับนักศึกษาและบุคลากรมหาวิทยาลัยเท่านั้น</Text>
        <Text style={styles.noticeSub}>รองรับโดเมน @kmutt.ac.th และ @mail.kmutt.ac.th</Text>
      </View>

      <View style={styles.footerBox}>
        <Text style={styles.footerText}>E-MOD • KMUTT Activity Mobile App</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgDefault,
    position: 'relative',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  identityBox: {
    alignItems: 'center',
    gap: 6,
  },
  logoMark: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  logoMarkText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
  brandTitle: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    color: Colors.textHeading,
    textAlign: 'center',
  },
  welcomeBox: {
    marginTop: 22,
    alignItems: 'center',
  },
  welcomeHeading: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    color: Colors.textHeading,
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSub: {
    fontSize: 13,
    lineHeight: 20,
    color: Colors.textGray,
    textAlign: 'center',
  },
  formBox: {
    marginTop: 24,
    gap: 18,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: Colors.textHeading,
  },
  inputWrapper: {
    height: 52,
    backgroundColor: Colors.bgSurface,
    borderWidth: 1,
    borderColor: Colors.borderGray,
    borderRadius: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrapperReady: {
    borderColor: Colors.statusSuccess,
  },
  inputWrapperError: {
    borderColor: Colors.statusError,
    backgroundColor: '#FFF5F5',
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.textHeading,
    outlineStyle: 'none' as any,
  },
  readyBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.statusSuccessBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helperText: {
    fontSize: 12,
    lineHeight: 18,
    color: Colors.textGray,
    minHeight: 20,
  },
  errorText: {
    fontSize: 12,
    lineHeight: 18,
    color: Colors.statusError,
    fontWeight: '500',
    minHeight: 20,
  },
  loginButton: {
    height: 50,
    backgroundColor: Colors.brandPrimary,
    borderWidth: 1,
    borderColor: Colors.brandPrimaryBorder,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  quickTestSection: {
    marginTop: 4,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F5ECE0',
    gap: 8,
  },
  quickTestTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  quickButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  quickChip: {
    flex: 1,
    minWidth: 110,
    backgroundColor: Colors.bgSurface,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    alignItems: 'center',
  },
  quickChipPrimary: {
    borderColor: Colors.brandSecondary,
  },
  quickChipPrimaryText: {
    fontSize: 11,
    color: Colors.brandPrimaryHover,
    fontWeight: '700',
  },
  quickChipText: {
    fontSize: 11,
    color: Colors.textGray,
    fontWeight: '500',
  },
  noticeBox: {
    marginTop: 18,
    alignItems: 'center',
    gap: 2,
  },
  noticeTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  noticeSub: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  footerBox: {
    marginTop: 18,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: Colors.textPlaceholder,
  },
});
