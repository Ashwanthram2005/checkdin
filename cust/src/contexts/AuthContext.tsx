import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { loginCustomer, updateProfile as apiUpdateProfile, type ApiUser } from '../api/auth';

export type Gender = 'female' | 'male' | 'other' | 'unspecified';

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  city?: string;
  gender?: Gender;
  emergencyName?: string;
  emergencyPhone?: string;
  emergencyRelation?: string;
}

interface AuthContextValue {
  user: User | null;
  authOpen: boolean;
  openAuth: (onSuccess?: () => void) => void;
  closeAuth: () => void;
  signIn: (credentials: { email?: string; phone?: string; name?: string; city?: string }) => Promise<void>;
  signInWithProvider: (user: User) => void;
  updateUser: (patch: Partial<User>) => void;
  signOut: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function mapApiUser(u: ApiUser): User {
  return {
    id: u.id,
    name: u.name,
    phone: u.phone,
    email: u.email,
    gender: u.gender as Gender | undefined,
    emergencyName: u.emergency_name,
    emergencyPhone: u.emergency_phone,
    emergencyRelation: u.emergency_relation,
  };
}

export function AuthProvider({ children }: {children: React.ReactNode;}) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('checkdin_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('checkdin_token'));
  const [authOpen, setAuthOpen] = useState(false);
  const [pending, setPending] = useState<(() => void) | null>(null);

  useEffect(() => {
    if (user) localStorage.setItem('checkdin_user', JSON.stringify(user));
    else localStorage.removeItem('checkdin_user');
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem('checkdin_token', token);
    else localStorage.removeItem('checkdin_token');
  }, [token]);

  const openAuth = useCallback((onSuccess?: () => void) => {
    setPending(() => onSuccess ?? null);
    setAuthOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setAuthOpen(false);
    setPending(null);
  }, []);

  const signIn = useCallback(
    async (credentials: { email?: string; phone?: string; name?: string; city?: string }) => {
      const res = await loginCustomer(credentials);
      const mapped = mapApiUser(res.user);
      setUser(mapped);
      setToken(res.token);
      setAuthOpen(false);
      if (pending) pending();
      setPending(null);
    },
    [pending]
  );

  const signInWithProvider = useCallback(
    (next: User) => {
      setUser(next);
      setAuthOpen(false);
      if (pending) pending();
      setPending(null);
    },
    [pending]
  );

  const signOut = useCallback(() => {
    setUser(null);
    setToken(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      authOpen,
      openAuth,
      closeAuth,
      signIn,
      signInWithProvider,
      updateUser: (patch) => {
        setUser((prev) => {
          const next = prev ? { ...prev, ...patch } : prev;
          if (next) apiUpdateProfile({
            name: patch.name,
            email: patch.email,
            phone: patch.phone,
            city: patch.city,
            gender: patch.gender,
            emergency_name: patch.emergencyName,
            emergency_phone: patch.emergencyPhone,
            emergency_relation: patch.emergencyRelation,
          }).catch(() => {});
          return next;
        });
      },
      signOut,
      token,
    }),
    [user, authOpen, openAuth, closeAuth, signIn, signInWithProvider, signOut, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export function initialsOf(name: string): string {
  return name.
  split(' ').
  filter(Boolean).
  slice(0, 2).
  map((part) => part[0]?.toUpperCase() ?? '').
  join('');
}
