import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { Colors } from '../../../constants/colors';
import { IconArrowLeft, IconUsers } from '../../../components/Icons';
import { ParticipantSubScreen } from '../types';
import { participantStyles as styles } from '../styles/participant.styles';

type Props = {
  chatMessages: any[];
  onSendChat: (text: string) => Promise<void>;
  setSubScreen: (s: ParticipantSubScreen) => void;
};

export function SupportChatScreen({ chatMessages, onSendChat, setSubScreen }: Props) {
  const [chatInput, setChatInput] = useState('');

  const handleSend = async () => {
    if (!chatInput.trim()) return;
    const text = chatInput;
    setChatInput('');
    await onSendChat(text);
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.topMenuBar}>
        <Pressable onPress={() => setSubScreen('home')} style={styles.iconHitBox}>
          <IconArrowLeft size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.topMenuTitle}>ศูนย์ช่วยเหลือ</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 14 }}>
        <Text style={styles.chatDateText}>วันนี้ · 10:30 น.</Text>

        {chatMessages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <View
              key={msg.id}
              style={{
                alignItems: isUser ? 'flex-end' : 'flex-start',
                gap: 4,
              }}
            >
              {!isUser && <Text style={styles.chatSenderName}>E-MOD Assistant</Text>}
              <View style={isUser ? styles.chatBubbleUser : styles.chatBubbleBot}>
                <Text style={isUser ? styles.chatTextUser : styles.chatTextBot}>
                  {msg.text}
                </Text>
                {msg.subtext ? (
                  <Text style={[styles.chatTextBot, { marginTop: 8 }]}>{msg.subtext}</Text>
                ) : null}
              </View>
              {isUser && <Text style={styles.chatTimeSmall}>{msg.time}</Text>}
            </View>
          );
        })}

        {/* Quick Question Prompts */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
          {[
            'ดู QR Code เข้างานได้ที่ไหนคะ',
            'ตรวจสอบชั่วโมงกิจกรรมสะสม',
            'ขอจัดกิจกรรมต้องทำอย่างไร',
          ].map((q) => (
            <Pressable key={q} onPress={() => onSendChat(q)} style={styles.quickChatChip}>
              <Text style={styles.quickChatChipText}>{q}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View style={styles.chatComposerWrap}>
        <Pressable
          onPress={() => onSendChat('ต้องการติดต่อเจ้าหน้าที่ฝ่ายกิจการนักศึกษา')}
          style={styles.humanSupportRow}
        >
          <IconUsers size={16} color={Colors.textGray} />
          <Text style={{ fontSize: 12, color: Colors.textGray }}>
            ต้องการความช่วยเหลือเพิ่มเติม?
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: Colors.textHeading,
              textDecorationLine: 'underline',
              fontWeight: '600',
            }}
          >
            ติดต่อเจ้าหน้าที่
          </Text>
        </Pressable>

        <View style={styles.chatInputRow}>
          <View style={styles.chatTextFieldBox}>
            <TextInput
              value={chatInput}
              onChangeText={setChatInput}
              placeholder="พิมพ์ข้อความของคุณ..."
              placeholderTextColor={Colors.textGray}
              style={styles.chatTextInput}
              onSubmitEditing={handleSend}
            />
          </View>
          <Pressable onPress={handleSend} style={styles.chatSendBtn}>
            <Text style={{ color: '#FFF', fontSize: 14, fontWeight: '600' }}>ส่ง</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
