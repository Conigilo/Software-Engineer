import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';

interface AuthContextValue {
  user: UserProfile;
  role: UserRole;
  token: string | null;
  isAuthenticated: boolean;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  setRole: (role: UserRole) => void;
  loginSession: (user: UserProfile, role: UserRole, token?: string) => void;
  logoutSession: () => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'u-1',
  student_id: '67090500429',
  name: 'ปภาวรินท์ ลาภอนันต์',
  email: 'pp.asd@kmutt.ac.th',
  avatar: '/assets/figma/2beed.png',
  activity_hours: 20,
  target_hours: 25,
  organization: 'ชมรมสืบสวนเยาวชน',
  role: 'participant',
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [role, setRoleState] = useState<UserRole>('participant');
  const [token, setToken] = useState<string | null>('emod.demo-session-token');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  useEffect(() => {
    try {
      const savedRole = window.localStorage.getItem('emod_active_role') as UserRole | null;
      if (savedRole && ['participant', 'organizer', 'admin'].includes(savedRole)) {
        setRoleState(savedRole);
      }
    } catch {}
  }, []);

  const setRole = (nextRole: UserRole) => {
    setRoleState(nextRole);
    try {
      window.localStorage.setItem('emod_active_role', nextRole);
    } catch {}
  };

  const loginSession = (loggedInUser: UserProfile, nextRole: UserRole, authToken?: string) => {
    setUser(loggedInUser);
    setRole(nextRole);
    setToken(authToken || 'emod.kmutt-session-token');
    setIsAuthenticated(true);
  };

  const logoutSession = () => {
    setIsAuthenticated(false);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        isAuthenticated,
        setUser,
        setRole,
        loginSession,
        logoutSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}
