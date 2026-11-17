import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from './src/constants/colors';
import { api } from './src/services';
import { MobileLoginScreen } from './src/features/auth/MobileLoginScreen';
import {
  ParticipantNavigator,
  ParticipantSubScreen,
} from './src/features/participant/ParticipantNavigator';
import {
  OrganizerNavigator,
  OrganizerSubScreen,
} from './src/features/organizer/OrganizerNavigator';

type NativeAppStage = 'splash' | 'login' | 'participant' | 'organizer';

export default function App() {
  const [stage, setStage] = useState<NativeAppStage>('splash');
  const [participantSub, setParticipantSub] = useState<ParticipantSubScreen>('home');
  const [organizerSub, setOrganizerSub] = useState<OrganizerSubScreen>('my_events');

  const [userProfile, setUserProfile] = useState<any>({
    id: 'u-1',
    student_id: '67090500429',
    name: 'ปภาวรินท์ ลาภอนันต์',
    email: 'pp.asd@kmutt.ac.th',
    avatar: '/assets/figma/2beed.png',
    activity_hours: 20,
    target_hours: 25,
    organization: 'ชมรมสืบสวนเยาวชน',
    role: 'participant',
  });
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [venues, setVenues] = useState<any[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<any | null>(null);
  const [attendees, setAttendees] = useState<any[]>([]);
  const [participantNotifs, setParticipantNotifs] = useState<any[]>([]);
  const [organizerNotifs, setOrganizerNotifs] = useState<any[]>([]);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState<any[]>([]);

  const fetchAllData = useCallback(async () => {
    try {
      const [
        profileRes,
        eventsRes,
        venuesRes,
        pNotifs,
        oNotifs,
        chatRes,
        recentRes,
      ] = await Promise.all([
        api.getProfile(),
        api.getEvents(),
        api.getVenues(),
        api.getNotifications('participant'),
        api.getNotifications('organizer'),
        api.getChat(),
        api.getRecentSearches(),
      ]);

      if (profileRes?.user) setUserProfile(profileRes.user);
      setEvents(eventsRes);
      setSelectedEvent((prev: any) =>
        prev ? eventsRes.find((e) => e.id === prev.id) || eventsRes[1] : eventsRes[1]
      );
      setVenues(venuesRes);
      setSelectedVenue((prev: any) =>
        prev ? venuesRes.find((v) => v.id === prev.id) || venuesRes[2] : venuesRes[2]
      );
      setParticipantNotifs(pNotifs);
      setOrganizerNotifs(oNotifs);
      setChatMessages(chatRes);
      setRecentSearches(recentRes);
    } catch {}
  }, []);

  useEffect(() => {
    fetchAllData();
    const timer = setTimeout(() => {
      setStage('login');
    }, 1000);
    return () => clearTimeout(timer);
  }, [fetchAllData]);

  const handleToggleFavorite = async (id: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, is_favorite: !e.is_favorite } : e))
    );
    try {
      await api.toggleFavorite(id);
      await fetchAllData();
    } catch {}
  };

  const handleToggleRegister = async (id: string) => {
    try {
      await api.toggleRegister(id);
      await fetchAllData();
    } catch {}
  };

  const handleAddRecentSearch = async (ev: any) => {
    try {
      const updated = await api.addRecentSearch({
        event_id: ev.id,
        title: ev.title,
        date_label: ev.date,
        image: ev.image,
      });
      setRecentSearches(updated);
    } catch {}
  };

  const handleSendChat = async (text: string) => {
    try {
      const res = await api.sendChat(text);
      if (res.messages) setChatMessages(res.messages);
    } catch {}
  };

  const handleCreateEvent = async (payload: any) => {
    const res = await api.createEvent(payload);
    await fetchAllData();
    setSelectedEvent(res.event);
    return res;
  };

  const handleUpdateEvent = async (id: string, payload: any) => {
    const res = await api.updateEvent(id, payload);
    await fetchAllData();
    setSelectedEvent(res.event);
  };

  const handleLoadAttendees = useCallback(async (eventId: string) => {
    try {
      const res = await api.getAttendees(eventId);
      setAttendees(res.attendees || []);
    } catch {}
  }, []);

  const handleScanCheckIn = async (eventId: string, name?: string) => {
    try {
      const res = await api.checkInAttendee(eventId, { name });
      if (res.attendees) setAttendees(res.attendees);
      await fetchAllData();
    } catch {}
  };

  const handleExportCsv = async (eventId: string) => {
    try {
      await api.exportAttendees(eventId);
    } catch {}
  };

  const handleMarkNotifRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      await fetchAllData();
    } catch {}
  };

  return (
    <View style={styles.nativeContainer}>
      {stage === 'splash' && (
        <View style={styles.splashScreen}>
          <View style={styles.splashLogoBox}>
            <Text style={styles.splashLogoE}>E</Text>
            <Text style={styles.splashLogoMod}>MOD</Text>
          </View>
          <Text style={styles.splashTitle}>E-MOD</Text>
          <Text style={styles.splashSubtitle}>KMUTT Activity Mobile Application</Text>
        </View>
      )}

      {stage === 'login' && (
        <MobileLoginScreen
          onLoginApi={api.login}
          onLoginSuccess={(user, mode) => {
            setUserProfile(user);
            if (mode === 'organizer') {
              setStage('organizer');
            } else {
              setStage('participant');
            }
          }}
        />
      )}

      {stage === 'participant' && (
        <ParticipantNavigator
          subScreen={participantSub}
          setSubScreen={setParticipantSub}
          events={events}
          selectedEvent={selectedEvent}
          onSelectEvent={(ev, target) => {
            setSelectedEvent(ev);
            if (target) setParticipantSub(target);
          }}
          onToggleFavorite={handleToggleFavorite}
          onToggleRegister={handleToggleRegister}
          notifications={participantNotifs}
          onMarkNotifRead={handleMarkNotifRead}
          chatMessages={chatMessages}
          onSendChat={handleSendChat}
          recentSearches={recentSearches}
          onAddRecentSearch={handleAddRecentSearch}
          userProfile={userProfile}
          onUpdateProfile={async (data) => {
            const updated = await api.updateProfile(data);
            setUserProfile(updated);
          }}
          onSwitchRole={(role) => {
            if (role === 'organizer') setStage('organizer');
            else setStage('participant');
          }}
          onLogout={() => setStage('login')}
        />
      )}

      {stage === 'organizer' && (
        <OrganizerNavigator
          subScreen={organizerSub}
          setSubScreen={setOrganizerSub}
          events={events}
          selectedEvent={selectedEvent}
          onSelectEvent={(ev, target) => {
            setSelectedEvent(ev);
            if (target) setOrganizerSub(target);
          }}
          onCreateEvent={handleCreateEvent}
          onUpdateEvent={handleUpdateEvent}
          venues={venues}
          selectedVenue={selectedVenue}
          onSelectVenue={setSelectedVenue}
          attendees={attendees}
          onLoadAttendees={handleLoadAttendees}
          onScanCheckIn={handleScanCheckIn}
          onExportCsv={handleExportCsv}
          notifications={organizerNotifs}
          onMarkNotifRead={handleMarkNotifRead}
          onSwitchRole={(role) => {
            if (role === 'participant') setStage('participant');
            else setStage('organizer');
          }}
          onLogout={() => setStage('login')}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  nativeContainer: {
    flex: 1,
    backgroundColor: Colors.bgDefault,
  },
  splashScreen: {
    flex: 1,
    backgroundColor: Colors.brandTeal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashLogoBox: {
    width: 92,
    height: 92,
    borderRadius: 26,
    backgroundColor: Colors.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
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
  splashTitle: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
  },
  splashSubtitle: {
    color: Colors.brandAccent,
    fontSize: 13,
    marginTop: 6,
  },
});
