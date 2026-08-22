import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type Gender = 'female' | 'male' | 'other' | 'unspecified';

export interface User {
  name: string;
  phone: string;
  email: string;
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
  signIn: (user: User) => void;
  updateUser: (patch: Partial<User>) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: {children: React.ReactNode;}) {
  const [user, setUser] = useState<User | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [pending, setPending] = useState<(() => void) | null>(null);

  const openAuth = useCallback((onSuccess?: () => void) => {
    setPending(() => onSuccess ?? null);
    setAuthOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setAuthOpen(false);
    setPending(null);
  }, []);

  const signIn = useCallback(
    (next: User) => {
      setUser(next);
      setAuthOpen(false);
      if (pending) pending();
      setPending(null);
    },
    [pending]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      authOpen,
      openAuth,
      closeAuth,
      signIn,
      updateUser: (patch) =>
      setUser((prev) => prev ? { ...prev, ...patch } : prev),
      signOut: () => setUser(null)
    }),
    [user, authOpen, openAuth, closeAuth, signIn]
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