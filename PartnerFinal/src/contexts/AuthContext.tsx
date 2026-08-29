import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { post, get } from '../utils/http';

type LoginStep = 'property' | 'user' | 'password';

type PartnerUser = {
  id: string;
  name: string;
  role_id: string;
  hotel_id: string;
};

type AuthContextValue = {
  step: LoginStep;
  isAuthenticated: boolean;
  user: PartnerUser | null;
  token: string | null;
  users: PartnerUser[];
  candidateId: string | null;
  verifyProperty: (hotelId: string, password: string) => Promise<string | null>;
  selectUser: (userId: string) => void;
  verifyUserPassword: (password: string) => Promise<string | null>;
  backToUsers: () => void;
  backToProperty: () => void;
  logout: () => void;
};

const STORAGE_KEY = 'checkdin-partner-session';

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredSession(): { user: PartnerUser; token: string } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const stored = readStoredSession();
  const [step, setStep] = useState<LoginStep>('property');
  const [users, setUsers] = useState<PartnerUser[]>([]);
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [user, setUser] = useState<PartnerUser | null>(stored?.user ?? null);
  const [token, setToken] = useState<string | null>(stored?.token ?? null);

  const persist = useCallback((u: PartnerUser | null, t: string | null) => {
    setUser(u);
    setToken(t);
    if (u && t) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: u, token: t }));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const verifyProperty = useCallback(async (hotelId: string, _password: string) => {
    try {
      const response = await post<{ step: number; users: PartnerUser[] }>('/api/auth/login/partner', { hotelId });
      if (response.step === 2 && response.users) {
        setUsers(response.users);
        setStep('user');
        return null;
      }
      return 'Unexpected response from server.';
    } catch (error: any) {
      return error.message || 'Failed to verify property.';
    }
  }, []);

  const selectUser = useCallback((userId: string) => {
    setCandidateId(userId);
    setStep('password');
  }, []);

  const verifyUserPassword = useCallback(
    async (password: string) => {
      const candidate = users.find((item) => item.id === candidateId);
      if (!candidate) return 'Select a user to continue.';
      try {
        const response = await post<{ token: string; user: PartnerUser }>('/api/auth/login/partner', {
          hotelId: candidate.hotel_id,
          userId: candidate.id,
          userPassword: password,
        });
        persist(response.user, response.token);
        return null;
      } catch (error: any) {
        return error.message || 'Invalid password.';
      }
    },
    [candidateId, users, persist]
  );

  const backToUsers = useCallback(() => {
    setCandidateId(null);
    setStep('user');
  }, []);

  const backToProperty = useCallback(() => {
    setCandidateId(null);
    setUsers([]);
    setStep('property');
  }, []);

  const logout = useCallback(() => {
    persist(null, null);
    setCandidateId(null);
    setUsers([]);
    setStep('property');
  }, [persist]);

  const value: AuthContextValue = useMemo(
    () => ({
      step,
      isAuthenticated: Boolean(user && token),
      user,
      token,
      users,
      candidateId,
      verifyProperty,
      selectUser,
      verifyUserPassword,
      backToUsers,
      backToProperty,
      logout,
    }),
    [step, user, token, users, candidateId, verifyProperty, selectUser, verifyUserPassword, backToUsers, backToProperty, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
