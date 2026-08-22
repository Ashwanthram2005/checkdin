import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { getRole, roles, type RoleDefinition, type RoleId } from '../data/roles';

export interface AuthUser {
  name: string;
  email: string;
  roleId: RoleId;
  roleName: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  role: RoleDefinition | null;
  signIn: (email: string, password: string) => Promise<{ok: boolean;message?: string;}>;
  signInAsDemo: (roleId: RoleId) => Promise<{ok: boolean;}>;
  signOut: () => void;
}

const STORAGE_KEY = 'checkdin-session';

const AuthContext = createContext<AuthContextValue>({
  user: null,
  role: null,
  signIn: async () => ({ ok: false }),
  signInAsDemo: async () => ({ ok: false }),
  signOut: () => {}
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

export function AuthProvider({ children }: {children: React.ReactNode;}) {
  const [user, setUser] = useState<AuthUser | null>(readStoredUser);

  const persist = useCallback((next: AuthUser | null) => {
    setUser(next);
    if (next) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));else
    window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      await new Promise((resolve) => window.setTimeout(resolve, 700));
      const match = roles.find((role) => role.email.toLowerCase() === email.trim().toLowerCase());
      if (!match) return { ok: false, message: 'No admin account found for that email address.' };
      if (match.password !== password) return { ok: false, message: 'Incorrect password. Check and try again.' };
      persist({ name: match.person, email: match.email, roleId: match.id, roleName: match.name });
      return { ok: true };
    },
    [persist]
  );

  const signInAsDemo = useCallback(
    async (roleId: RoleId) => {
      await new Promise((resolve) => window.setTimeout(resolve, 500));
      const role = getRole(roleId);
      persist({ name: role.person, email: role.email, roleId: role.id, roleName: role.name });
      return { ok: true };
    },
    [persist]
  );

  const signOut = useCallback(() => persist(null), [persist]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role: user ? getRole(user.roleId) : null,
      signIn,
      signInAsDemo,
      signOut
    }),
    [user, signIn, signInAsDemo, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}