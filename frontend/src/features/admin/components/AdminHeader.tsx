import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Colors } from '../../../constants/colors';
import { IconBell } from '../../../components/Icons';
import { AdminPage } from '../types';
import { adminStyles as styles } from '../styles/admin.styles';

type Props = {
  page: AdminPage;
  setPage: (p: AdminPage) => void;
  hasPending: boolean;
};

export function AdminHeader({ page, setPage, hasPending }: Props) {
  const breadcrumb =
    page === 'venues' ? 'ระบบจัดการ  /  สถานที่' : 'ระบบจัดการ  /  คำขอกิจกรรม';

  return (
    <View style={styles.headerBar}>
      <Text style={styles.breadcrumbText}>{breadcrumb}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
        <Pressable onPress={() => setPage('requests')}>
          <IconBell size={22} color={Colors.textHeading} hasBadge={hasPending} />
        </Pressable>
        <View>
          <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.textHeading }}>
            ผู้ดูแลระบบ
          </Text>
          <Text style={{ fontSize: 12, color: Colors.textGray }}>ฝ่ายกิจการนักศึกษา</Text>
        </View>
      </View>
    </View>
  );
}
