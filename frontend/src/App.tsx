import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors } from './constants/colors';
import { api } from './services';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useBrowserRouter } from './hooks/useBrowserRouter';
import {
  PhoneSimulatorFrame,
  PhoneOSState,
} from './components/simulator/PhoneSimulatorFrame';
import { MobileLoginScreen } from './features/auth/MobileLoginScreen';
import { AdminLoginScreen } from './features/auth/AdminLoginScreen';
import {
  ParticipantNavigator,
  ParticipantSubScreen,
} from './features/participant/ParticipantNavigator';
import {
  OrganizerNavigator,
  OrganizerSubScreen,
} from './features/organizer/OrganizerNavigator';
import { AdminWebPortal, AdminPage } from './features/admin/AdminWebPortal';

type PlatformTarget = 'user_mobile_app' | 'admin_web_app';

function EModPlatform() {
  const { user, setUser } = useAuth();
  const { pathname, navigate } = useBrowserRouter('/app');

  const [platform, setPlatform] = useState<PlatformTarget>(() =>
    pathname.startsWith('/admin') ? 'admin_web_app' : 'user_mobile_app'
  );

  // Mobile OS State for General Users (Application-Based)
  const [phoneState, setPhoneState] = useState<PhoneOSState>('homescreen');
  const [pendingLaunchTarget, setPendingLaunchTarget] = useState<
    'login' | 'participant' | 'organizer'
  >('login');
  const [participantSub, setParticipantSub] = useState<ParticipantSubScreen>('home');
  const [organizerSub, setOrganizerSub] = useState<OrganizerSubScreen>('my_events');

  // Web Application State for Admin (Web-Based)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(true);
  const [adminPage, setAdminPage] = useState<AdminPage>('requests');

  // Shared 3NF Relational Database State
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [venues, setVenues] = useState<any[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<any | null>(null);
  const [requestsData, setRequestsData] = useState<{ counts: any; requests: any[] }>({
    counts: { pending: 6, approved: 0, returned: 0, total: 6 },
    requests: [],
  });
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
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
        requestsRes,
        pNotifs,
        oNotifs,
        chatRes,
        recentRes,
      ] = await Promise.all([
        api.getProfile(),
        api.getEvents(),
        api.getVenues(),
        api.getRequests(),
        api.getNotifications('participant'),
        api.getNotifications('organizer'),
        api.getChat(),
        api.getRecentSearches(),
      ]);

      if (profileRes?.user) setUser(profileRes.user);
      setEvents(eventsRes);
      setSelectedEvent((prev: any) =>
        prev ? eventsRes.find((e) => e.id === prev.id) || eventsRes[1] : eventsRes[1]
      );
      setVenues(venuesRes);
      setSelectedVenue((prev: any) =>
        prev ? venuesRes.find((v) => v.id === prev.id) || venuesRes[2] : venuesRes[2]
      );
      setRequestsData(requestsRes);
      setSelectedRequest((prev: any) =>
        prev
          ? requestsRes.requests.find((r) => r.id === prev.id) || requestsRes.requests[0]
          : requestsRes.requests[0]
      );
      setParticipantNotifs(pNotifs);
      setOrganizerNotifs(oNotifs);
      setChatMessages(chatRes);
      setRecentSearches(recentRes);
    } catch {}
  }, [setUser]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    if (phoneState === 'splash') {
      const timer = setTimeout(() => {
        setPhoneState(pendingLaunchTarget);
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [phoneState, pendingLaunchTarget]);

  const launchMobileApp = (target: 'login' | 'participant' | 'organizer' = 'login') => {
    setPendingLaunchTarget(target);
    setPhoneState('splash');
  };

  const switchToAdminWeb = (targetPage: AdminPage | 'login' = 'requests') => {
    setPlatform('admin_web_app');
    if (targetPage === 'login') {
      setIsAdminLoggedIn(false);
      navigate('/admin/login');
    } else {
      setIsAdminLoggedIn(true);
      setAdminPage(targetPage);
      navigate(`/admin/${targetPage}`);
    }
  };

  const switchToUserMobileApp = (targetState?: PhoneOSState) => {
    setPlatform('user_mobile_app');
    if (targetState) setPhoneState(targetState);
    navigate('/app');
  };

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
      const res = await api.exportAttendees(eventId);
      if (res.csv && typeof window !== 'undefined') {
        const blob = new Blob(['\uFEFF' + res.csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = res.filename || 'attendees.csv';
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {}
  };

  const handleUpdateVenueSlots = async (id: string, payload: any) => {
    await api.updateVenueSlots(id, payload);
    await fetchAllData();
  };

  const handleReviewRequest = async (id: string, payload: any) => {
    const res = await api.reviewRequest(id, payload);
    await fetchAllData();
    if (res.request) setSelectedRequest(res.request);
  };

  const handleMarkNotifRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      await fetchAllData();
    } catch {}
  };

  const unreadNotifs = participantNotifs.filter((n) => !n.is_read).length || 2;

  // ============================================================================
  // PLATFORM 2: STAFF ADMIN -> FULL-SCREEN WEB APPLICATION (1440×1024)
  // ============================================================================
  if (platform === 'admin_web_app') {
    if (!isAdminLoggedIn || pathname === '/admin/login') {
      return (
        <AdminLoginScreen
          onLoginApi={api.login}
          onLoginSuccess={() => {
            setIsAdminLoggedIn(true);
            setAdminPage('requests');
            navigate('/admin/requests');
          }}
          onSwitchToMobileApp={() => switchToUserMobileApp('homescreen')}
        />
      );
    }

    return (
      <View style={{ flex: 1, height: '100%' as any, position: 'relative' }}>
        <AdminWebPortal
          page={adminPage}
          setPage={(nextPage) => {
            setAdminPage(nextPage);
            navigate(`/admin/${nextPage}`);
          }}
          venues={venues}
          onUpdateVenueSlots={handleUpdateVenueSlots}
          requestsData={requestsData}
          selectedRequest={selectedRequest}
          onSelectRequest={setSelectedRequest}
          onReviewRequest={handleReviewRequest}
          onLogout={() => {
            setIsAdminLoggedIn(false);
            navigate('/admin/login');
          }}
        />

        <View style={styles.adminFloatingBar}>
          <View style={styles.adminModeIndicator}>
            <View style={styles.greenDot} />
            <Text style={styles.adminModeText}>💻 Admin Web Application ({pathname})</Text>
          </View>
          <Pressable
            onPress={() => switchToUserMobileApp('participant')}
            style={styles.switchToMobileBtn}
          >
            <Text style={styles.switchToMobileBtnText}>
              📱 สลับไปฝั่ง User ทั่วไป (Mobile Application)
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ============================================================================
  // PLATFORM 1: GENERAL USERS (Participant & Organizer) -> 100% MOBILE APP
  // ============================================================================
  return (
    <PhoneSimulatorFrame
      phoneState={phoneState}
      setPhoneState={setPhoneState}
      launchMobileApp={launchMobileApp}
      setParticipantSub={setParticipantSub}
      user={user}
      unreadNotifs={unreadNotifs}
      pendingRequestsCount={requestsData.counts.pending}
      onSwitchToAdminWeb={() => switchToAdminWeb('requests')}
    >
      {phoneState === 'login' && (
        <MobileLoginScreen
          onLoginApi={api.login}
          onLoginSuccess={(loggedInUser, mode) => {
            setUser(loggedInUser);
            if (mode === 'organizer') {
              setPhoneState('organizer');
            } else {
              setPhoneState('participant');
            }
          }}
        />
      )}

      {phoneState === 'participant' && (
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
          userProfile={user}
          onUpdateProfile={async (data) => {
            const updated = await api.updateProfile(data);
            setUser(updated);
          }}
          onSwitchRole={(r) => {
            if (r === 'admin') switchToAdminWeb('requests');
            else setPhoneState(r);
          }}
          onLogout={() => setPhoneState('login')}
        />
      )}

      {phoneState === 'organizer' && (
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
          onSwitchRole={(r) => {
            if (r === 'admin') switchToAdminWeb('requests');
            else setPhoneState(r);
          }}
          onLogout={() => setPhoneState('login')}
        />
      )}
    </PhoneSimulatorFrame>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <EModPlatform />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  adminFloatingBar: {
    position: 'fixed' as any,
    bottom: 16,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#18181B',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: '#3F3F46',
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  adminModeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  adminModeText: {
    color: '#E4E4E7',
    fontSize: 11,
    fontWeight: '600',
  },
  switchToMobileBtn: {
    backgroundColor: Colors.brandPrimary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
  },
  switchToMobileBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});
