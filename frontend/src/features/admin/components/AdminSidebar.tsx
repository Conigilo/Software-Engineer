import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Colors } from '../../../constants/colors';
import {
  IconLocation,
  IconDocument,
  IconLogout,
} from '../../../components/Icons';
import { AdminPage, AdminModalType } from '../types';
import { adminStyles as styles } from '../styles/admin.styles';

type Props = {
  page: AdminPage;
  setPage: (p: AdminPage) => void;
  pendingCount: number;
  onOpenModal: (m: AdminModalType) => void;
};

export function AdminSidebar({ page, setPage, pendingCount, onOpenModal }: Props) {
  const isVenues = page === 'venues';
  const isRequests = page === 'requests' || page === 'review';

  return (
    <View style={styles.sidebar}>
      <View style={{ paddingHorizontal: 12, gap: 2 }}>
        <Text style={styles.sidebarLogo}>E-MOD</Text>
        <Text style={styles.sidebarSubtitle}>ระบบจัดการกิจกรรม</Text>
      </View>

      <Text style={styles.sidebarSectionLabel}>ADMIN WORKSPACE</Text>

      <Pressable
        onPress={() => setPage('venues')}
        style={[styles.sidebarNavItem, isVenues && styles.sidebarNavItemActive]}
      >
        <IconLocation size={22} color={isVenues ? Colors.brandPrimary : Colors.textGray} />
        <Text style={[styles.sidebarNavText, isVenues && styles.sidebarNavTextActive]}>
          จัดการสถานที่
        </Text>
      </Pressable>

      <Pressable
        onPress={() => setPage('requests')}
        style={[styles.sidebarNavItem, isRequests && styles.sidebarNavItemActive]}
      >
        <IconDocument size={22} active={isRequests} color={Colors.textGray} />
        <Text
          style={[
            styles.sidebarNavText,
            isRequests && styles.sidebarNavTextActive,
            { flex: 1 },
          ]}
        >
          คำขอโพสต์กิจกรรม
        </Text>
        <View style={styles.pendingCountBadge}>
          <Text style={styles.pendingCountText}>{pendingCount}</Text>
        </View>
      </Pressable>

      <View style={{ flex: 1 }} />

      <View style={styles.sidebarDivider} />

      <View style={{ paddingHorizontal: 12, gap: 2 }}>
        <Text style={styles.sidebarRoleTitle}>ฝ่ายกิจการนักศึกษา</Text>
        <Text style={styles.sidebarRoleSub}>ผู้ดูแลระบบ</Text>
      </View>

      <Pressable
        onPress={() => onOpenModal('logout_confirm')}
        style={styles.sidebarLogoutBtn}
      >
        <IconLogout size={20} color={Colors.statusError} />
        <Text style={styles.sidebarLogoutText}>ออกจากระบบ</Text>
      </Pressable>
    </View>
  );
}
