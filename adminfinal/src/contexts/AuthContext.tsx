import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { post, get } from '../utils/http';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  role_name: string;
  token: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  signIn: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  signOut: () => void;
  isLoading: boolean;
}

const STORAGE_KEY = 'checkdin-session';

const AuthContext = createContext<AuthContextValue>({
  user: null,
  signIn: async () => ({ ok: false }),
  signOut: () => {},
  isLoading: false,
});

function readStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as AuthUser : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readStoredUser);
  const [isLoading, setIsLoading] = useState(false);

  const persist = useCallback((next: AuthUser | null) => {
    setUser(next);
    if (next) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      try {
        const response = await post<{ token: string; user: AuthUser }>('/api/auth/login/admin', { email, password });
        const userData: AuthUser = {
          ...response.user,
          token: response.token,
        };
        persist(userData);
        return { ok: true };
      } catch (error: any) {
        return { ok: false, message: error.message || 'Login failed' };
      } finally {
        setIsLoading(false);
      }
    },
    [persist]
  );

  const signOut = useCallback(() => {
    persist(null);
  }, [persist]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      signIn,
      signOut,
      isLoading,
    }),
    [user, signIn, signOut, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
