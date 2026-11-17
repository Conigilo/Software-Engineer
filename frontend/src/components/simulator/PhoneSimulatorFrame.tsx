import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { IconCalendar, IconLocation, IconBell } from '../Icons';
import { ParticipantSubScreen } from '../../features/participant/types';

export type PhoneOSState = 'homescreen' | 'splash' | 'login' | 'participant' | 'organizer';

type Props = {
  phoneState: PhoneOSState;
  setPhoneState: (s: PhoneOSState) => void;
  launchMobileApp: (target: 'login' | 'participant' | 'organizer') => void;
  setParticipantSub: (s: ParticipantSubScreen) => void;
  user: any;
  unreadNotifs: number;
  pendingRequestsCount: number;
  onSwitchToAdminWeb: () => void;
  children: React.ReactNode;
};

export function PhoneSimulatorFrame({
  phoneState,
  setPhoneState,
  launchMobileApp,
  setParticipantSub,
  user,
  unreadNotifs,
  pendingRequestsCount,
  onSwitchToAdminWeb,
  children,
}: Props) {
  return (
    <View style={styles.simulatorBackdrop}>
      {/* Realistic iPhone 14 Pro Hardware Bezel */}
      <View style={styles.iphoneHardwareShell}>
        <View style={styles.hwButtonSilent} />
        <View style={styles.hwButtonVolUp} />
        <View style={styles.hwButtonVolDown} />
        <View style={styles.hwButtonPower} />

        {/* 390×844 Native Mobile Screen */}
        <View style={styles.iphoneScreenViewport}>
          {/* iOS Status Bar + Dynamic Island */}
          <View
            style={[
              styles.iosStatusBar,
              phoneState === 'homescreen' && { backgroundColor: 'transparent' },
            ]}
          >
            <Text
              style={[
                styles.iosClockText,
                phoneState === 'homescreen' && { color: '#FFFFFF' },
              ]}
            >
              09:41
            </Text>
            <View style={styles.dynamicIsland}>
              <View style={styles.islandCameraDot} />
            </View>
            <View style={styles.iosStatusRight}>
              <Text
                style={[
                  styles.iosSignalText,
                  phoneState === 'homescreen' && { color: '#FFFFFF' },
                ]}
              >
                5G
              </Text>
              <View
                style={[
                  styles.batteryBody,
                  phoneState === 'homescreen' && { borderColor: '#FFFFFF' },
                ]}
              >
                <View
                  style={[
                    styles.batteryFill,
                    phoneState === 'homescreen' && { backgroundColor: '#FFFFFF' },
                  ]}
                />
              </View>
            </View>
          </View>

          {/* 1. PHONE HOME SCREEN */}
          {phoneState === 'homescreen' && (
            <View style={styles.iosHomeScreen}>
              <Pressable
                onPress={() => launchMobileApp('participant')}
                style={styles.iosWidgetCard}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <View style={styles.widgetBadge}>
                    <Text style={styles.widgetBadgeText}>E-MOD • KMUTT</Text>
                  </View>
                  <Text style={{ color: '#FDE68A', fontSize: 11, fontWeight: '600' }}>
                    {user.activity_hours} / {user.target_hours} ชม. กิจกรรม
                  </Text>
                </View>
                <Text style={styles.widgetTitle}>Mod-Hack(kathon) 2026</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <IconCalendar size={14} color="#FED7AA" />
                  <Text style={styles.widgetSub}>18-11-2026 • อาคาร N16 (18/20 คน)</Text>
                </View>
              </Pressable>

              <Pressable
                onPress={() => {
                  setParticipantSub('detail');
                  launchMobileApp('participant');
                }}
                style={styles.pushNotificationBanner}
              >
                <View style={styles.pushIconBox}>
                  <Text style={{ color: '#FFF', fontWeight: '800', fontSize: 15 }}>E</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.pushTitle}>E-MOD แจ้งเตือนกิจกรรม</Text>
                    <Text style={styles.pushTime}>เมื่อสักครู่</Text>
                  </View>
                  <Text style={styles.pushBody} numberOfLines={1}>
                    แตะเพื่อเปิดแอพ E-MOD และดูบัตรเข้างานของคุณ
                  </Text>
                </View>
              </Pressable>

              <View style={styles.appGrid}>
                <Pressable onPress={() => launchMobileApp('login')} style={styles.appIconItem}>
                  <View style={styles.emodAppIcon}>
                    <Text style={styles.emodAppIconLetter}>E</Text>
                    <Text style={styles.emodAppIconSub}>MOD</Text>
                    {unreadNotifs > 0 && (
                      <View style={styles.appIconBadge}>
                        <Text style={styles.appIconBadgeText}>{unreadNotifs}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.appIconLabel}>E-MOD</Text>
                </Pressable>

                <Pressable
                  onPress={() => launchMobileApp('participant')}
                  style={styles.appIconItem}
                >
                  <View style={[styles.otherAppIcon, { backgroundColor: '#176B5B' }]}>
                    <Text style={{ fontSize: 24 }}>🙋‍♂️</Text>
                  </View>
                  <Text style={styles.appIconLabel}>ผู้เข้าร่วม</Text>
                </Pressable>

                <Pressable
                  onPress={() => launchMobileApp('organizer')}
                  style={styles.appIconItem}
                >
                  <View style={[styles.otherAppIcon, { backgroundColor: '#25352F' }]}>
                    <Text style={{ fontSize: 24 }}>📋</Text>
                  </View>
                  <Text style={styles.appIconLabel}>ผู้จัดกิจกรรม</Text>
                </Pressable>
              </View>

              <View style={styles.homePromptBox}>
                <Text style={styles.homePromptText}>
                  👆 แตะไอคอน{' '}
                  <Text style={{ fontWeight: '700', color: '#FDBA74' }}>E-MOD</Text>{' '}
                  เพื่อเปิดแอพมือถือสำหรับ User ทั่วไป
                </Text>
              </View>

              <View style={styles.iosBottomDock}>
                <Pressable onPress={() => launchMobileApp('login')} style={styles.dockIcon}>
                  <View
                    style={[
                      styles.emodAppIcon,
                      { width: 54, height: 54, borderRadius: 14 },
                    ]}
                  >
                    <Text style={{ color: '#FFF', fontSize: 20, fontWeight: '800' }}>E</Text>
                  </View>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setParticipantSub('map_route');
                    launchMobileApp('participant');
                  }}
                  style={styles.dockIcon}
                >
                  <View
                    style={[
                      styles.otherAppIcon,
                      {
                        width: 54,
                        height: 54,
                        borderRadius: 14,
                        backgroundColor: '#2563EB',
                      },
                    ]}
                  >
                    <IconLocation size={26} color="#FFFFFF" />
                  </View>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setParticipantSub('notifications');
                    launchMobileApp('participant');
                  }}
                  style={styles.dockIcon}
                >
                  <View
                    style={[
                      styles.otherAppIcon,
                      {
                        width: 54,
                        height: 54,
                        borderRadius: 14,
                        backgroundColor: '#D97706',
                      },
                    ]}
                  >
                    <IconBell size={26} color="#FFFFFF" hasBadge />
                  </View>
                </Pressable>
              </View>
            </View>
          )}

          {/* 2. MOBILE APP SPLASH SCREEN */}
          {phoneState === 'splash' && (
            <View style={styles.splashScreen}>
              <View style={styles.splashLogoSquare}>
                <Text style={styles.splashLogoE}>E</Text>
                <Text style={styles.splashLogoMod}>MOD</Text>
              </View>
              <Text style={styles.splashBrandName}>E-MOD</Text>
              <Text style={styles.splashTagline}>KMUTT Activity Mobile Application</Text>
              <View style={styles.splashLoadingBarTrack}>
                <View style={styles.splashLoadingBarFill} />
              </View>
            </View>
          )}

          {/* 3. ACTIVE MOBILE APP SCREENS */}
          {children}

          {/* Bottom iOS Home Indicator Bar */}
          <Pressable
            onPress={() => setPhoneState('homescreen')}
            style={styles.iosHomeIndicatorArea}
          >
            <View
              style={[
                styles.iosHomeIndicatorPill,
                phoneState === 'homescreen' && {
                  backgroundColor: 'rgba(255,255,255,0.5)',
                },
              ]}
            />
          </Pressable>
        </View>
      </View>

      {/* Platform Switcher Bar */}
      <View style={styles.externalDeviceControls}>
        <View style={styles.controlGroup}>
          <Text style={styles.controlGroupLabel}>📱 User ทั่วไป (Mobile App):</Text>
          <Pressable
            onPress={() => setPhoneState('homescreen')}
            style={[
              styles.extControlBtn,
              phoneState === 'homescreen' && styles.extControlBtnActive,
            ]}
          >
            <Text style={styles.extControlText}>🏠 หน้าโฮม</Text>
          </Pressable>
          <Pressable
            onPress={() => setPhoneState('login')}
            style={[
              styles.extControlBtn,
              phoneState === 'login' && styles.extControlBtnActive,
            ]}
          >
            <Text style={styles.extControlText}>🔐 Login</Text>
          </Pressable>
          <Pressable
            onPress={() => setPhoneState('participant')}
            style={[
              styles.extControlBtn,
              phoneState === 'participant' && styles.extControlBtnActive,
            ]}
          >
            <Text style={styles.extControlText}>🙋‍♂️ แอพผู้เข้าร่วม</Text>
          </Pressable>
          <Pressable
            onPress={() => setPhoneState('organizer')}
            style={[
              styles.extControlBtn,
              phoneState === 'organizer' && styles.extControlBtnActive,
            ]}
          >
            <Text style={styles.extControlText}>📋 แอพผู้จัดกิจกรรม</Text>
          </Pressable>
        </View>

        <View style={styles.controlDivider} />

        <View style={styles.controlGroup}>
          <Text style={styles.controlGroupLabel}>💻 สำหรับ Admin (Web App):</Text>
          <Pressable
            onPress={onSwitchToAdminWeb}
            style={[styles.extControlBtn, styles.adminWebBtn]}
          >
            <Text style={[styles.extControlText, { color: '#FFFFFF' }]}>
              🖥️ เปิดหน้าเว็บ Admin ({pendingRequestsCount} คำขอรออนุมัติ)
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  simulatorBackdrop: {
    flex: 1,
    height: '100%' as any,
    backgroundColor: '#0F1115',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  iphoneHardwareShell: {
    width: 414,
    height: 876,
    borderRadius: 54,
    backgroundColor: '#27272A',
    padding: 12,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.65,
    shadowRadius: 40,
    borderWidth: 2,
    borderColor: '#3F3F46',
  },
  hwButtonSilent: {
    position: 'absolute',
    left: -4,
    top: 115,
    width: 4,
    height: 28,
    backgroundColor: '#52525B',
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },
  hwButtonVolUp: {
    position: 'absolute',
    left: -4,
    top: 165,
    width: 4,
    height: 54,
    backgroundColor: '#52525B',
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },
  hwButtonVolDown: {
    position: 'absolute',
    left: -4,
    top: 232,
    width: 4,
    height: 54,
    backgroundColor: '#52525B',
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },
  hwButtonPower: {
    position: 'absolute',
    right: -4,
    top: 185,
    width: 4,
    height: 76,
    backgroundColor: '#52525B',
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  iphoneScreenViewport: {
    flex: 1,
    width: 390,
    height: 844,
    borderRadius: 44,
    overflow: 'hidden',
    backgroundColor: Colors.bgDefault,
    position: 'relative',
  },
  iosStatusBar: {
    height: 44,
    paddingHorizontal: 26,
    paddingTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.bgDefault,
    zIndex: 20,
  },
  iosClockText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textHeading,
  },
  dynamicIsland: {
    width: 112,
    height: 28,
    borderRadius: 16,
    backgroundColor: '#000000',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 10,
  },
  islandCameraDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1E293B',
  },
  iosStatusRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iosSignalText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textHeading,
  },
  batteryBody: {
    width: 22,
    height: 11,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: Colors.textHeading,
    padding: 1.5,
  },
  batteryFill: {
    flex: 1,
    backgroundColor: Colors.textHeading,
    borderRadius: 1,
  },
  iosHomeScreen: {
    flex: 1,
    backgroundColor: '#1E293B',
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 28,
    justifyContent: 'space-between',
  },
  iosWidgetCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.78)',
    borderRadius: 22,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.45)',
  },
  widgetBadge: {
    backgroundColor: Colors.brandPrimary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  widgetBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  widgetTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  widgetSub: {
    color: '#FED7AA',
    fontSize: 12,
  },
  pushNotificationBanner: {
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderRadius: 18,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pushIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: Colors.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pushTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textHeading,
  },
  pushTime: {
    fontSize: 11,
    color: Colors.textGray,
  },
  pushBody: {
    fontSize: 12,
    color: Colors.textBody,
    marginTop: 2,
  },
  appGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 24,
    paddingHorizontal: 8,
    marginTop: 12,
  },
  appIconItem: {
    width: 74,
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  emodAppIcon: {
    width: 62,
    height: 62,
    borderRadius: 16,
    backgroundColor: Colors.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1.5,
    borderColor: '#FDBA74',
  },
  emodAppIconLetter: {
    color: '#FFFFFF',
    fontSize: 26,
    lineHeight: 28,
    fontWeight: '900',
  },
  emodAppIconSub: {
    color: '#FFF7ED',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  appIconBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: '#1E293B',
  },
  appIconBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  otherAppIcon: {
    width: 62,
    height: 62,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appIconLabel: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  homePromptBox: {
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  homePromptText: {
    color: '#E2E8F0',
    fontSize: 12,
  },
  iosBottomDock: {
    height: 82,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 14,
  },
  dockIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashScreen: {
    flex: 1,
    backgroundColor: Colors.brandTeal,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  splashLogoSquare: {
    width: 92,
    height: 92,
    borderRadius: 26,
    backgroundColor: Colors.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  splashLogoE: {
    color: '#FFFFFF',
    fontSize: 42,
    lineHeight: 44,
    fontWeight: '900',
  },
  splashLogoMod: {
    color: '#FFF7ED',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },
  splashBrandName: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 1,
  },
  splashTagline: {
    color: '#A8C9B5',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  splashLoadingBarTrack: {
    width: 160,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  splashLoadingBarFill: {
    width: '75%',
    height: '100%',
    backgroundColor: Colors.brandPrimary,
    borderRadius: 3,
  },
  iosHomeIndicatorArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  iosHomeIndicatorPill: {
    width: 134,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(37, 53, 47, 0.35)',
  },
  externalDeviceControls: {
    position: 'fixed' as any,
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(24, 24, 27, 0.94)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3F3F46',
    zIndex: 999,
  },
  controlGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  controlGroupLabel: {
    color: '#A1A1AA',
    fontSize: 11,
    fontWeight: '700',
    marginRight: 2,
  },
  controlDivider: {
    width: 1,
    height: 22,
    backgroundColor: '#3F3F46',
  },
  extControlBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#27272A',
  },
  extControlBtnActive: {
    backgroundColor: Colors.brandPrimary,
  },
  adminWebBtn: {
    backgroundColor: Colors.brandTeal,
  },
  extControlText: {
    color: '#F4F4F5',
    fontSize: 11,
    fontWeight: '600',
  },
});
