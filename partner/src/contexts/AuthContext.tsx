import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState } from
'react';
import {
  deviceContext,
  property,
  seedAuditLog,
  seedLoginActivity,
  seedRoles,
  sessionConfig,
  staffAccounts,
  type AuditCategory,
  type AuditEntry,
  type LoginActivity,
  type PermissionId,
  type Role,
  type StaffUser } from
'../data/auth';

type LoginStep = 'property' | 'user' | 'password';

type AuthContextValue = {
  step: LoginStep;
  isAuthenticated: boolean;
  user: StaffUser | null;
  role: Role | null;
  isOwner: boolean;
  users: StaffUser[];
  roles: Role[];
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
  setUsers: React.Dispatch<React.SetStateAction<StaffUser[]>>;
  candidateId: string | null;
  verifyProperty: (hotelId: string, password: string) => string | null;
  selectUser: (userId: string) => void;
  verifyUserPassword: (password: string) => string | null;
  backToUsers: () => void;
  backToProperty: () => void;
  logout: (reason?: string) => void;
  can: (permission: PermissionId) => boolean;
  auditLog: AuditEntry[];
  visibleAuditLog: AuditEntry[];
  addAudit: (entry: {action: string;detail: string;category: AuditCategory;}) => void;
  loginActivity: LoginActivity[];
  warningActive: boolean;
  secondsToLogout: number;
  stayLoggedIn: () => void;
  triggerIdleWarning: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function stamp(date = new Date()): string {
  return `${date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })}, ${date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })}`;
}

export function AuthProvider({ children }: {children: React.ReactNode;}) {
  const [step, setStep] = useState<LoginStep>('property');
  const [users, setUsers] = useState<StaffUser[]>(staffAccounts);
  const [roles, setRoles] = useState<Role[]>(seedRoles);
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [user, setUser] = useState<StaffUser | null>(null);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>(seedAuditLog);
  const [loginActivity, setLoginActivity] = useState<LoginActivity[]>(seedLoginActivity);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [warningActive, setWarningActive] = useState(false);
  const [secondsToLogout, setSecondsToLogout] = useState(sessionConfig.warningSeconds);

  const lastActivity = useRef(Date.now());
  const role = useMemo(
    () => user ? roles.find((item) => item.id === user.roleId) ?? null : null,
    [user, roles]
  );
  const isOwner = role?.level === 'owner';

  const pushAudit = useCallback(
    (entry: {action: string;detail: string;category: AuditCategory;}, actor: string, roleName: string) => {
      setAuditLog((prev) => [
      {
        id: `a${Date.now()}`,
        time: stamp(),
        actor,
        role: roleName,
        ...entry
      },
      ...prev]
      );
    },
    []
  );

  const addAudit = useCallback(
    (entry: {action: string;detail: string;category: AuditCategory;}) => {
      pushAudit(entry, user?.name ?? 'Unknown user', role?.name ?? 'Unknown role');
    },
    [pushAudit, user, role]
  );

  const verifyProperty = useCallback((hotelId: string, password: string) => {
    if (hotelId.trim().toUpperCase() !== property.hotelId) return 'Hotel ID not recognised.';
    if (password !== property.password) return 'Incorrect property password.';
    setStep('user');
    return null;
  }, []);

  const selectUser = useCallback((userId: string) => {
    setCandidateId(userId);
    setStep('password');
  }, []);

  const verifyUserPassword = useCallback(
    (password: string) => {
      const candidate = users.find((item) => item.id === candidateId);
      if (!candidate) return 'Select a user to continue.';
      if (password !== candidate.password) return 'Incorrect user password.';

      const roleName = roles.find((item) => item.id === candidate.roleId)?.name ?? 'Staff';
      const newSessionId = `la${Date.now()}`;

      setUser(candidate);
      setSessionId(newSessionId);
      lastActivity.current = Date.now();
      setWarningActive(false);

      setLoginActivity((prev) => [
      {
        id: newSessionId,
        user: candidate.name,
        role: roleName,
        loginTime: stamp(),
        logoutTime: null,
        device: deviceContext.device,
        ip: deviceContext.ip,
        location: deviceContext.location
      },
      ...prev]
      );
      pushAudit(
        {
          action: 'Signed in',
          detail: `${deviceContext.device} • ${deviceContext.ip} • ${deviceContext.location}`,
          category: 'Security'
        },
        candidate.name,
        roleName
      );
      return null;
    },
    [candidateId, users, roles, pushAudit]
  );

  const logout = useCallback(
    (reason = 'Signed out') => {
      if (user) {
        pushAudit(
          {
            action: reason,
            detail: `${deviceContext.device} • ${deviceContext.ip}`,
            category: 'Security'
          },
          user.name,
          role?.name ?? 'Staff'
        );
      }
      if (sessionId) {
        setLoginActivity((prev) =>
        prev.map((entry) =>
        entry.id === sessionId ? { ...entry, logoutTime: stamp() } : entry
        )
        );
      }
      setUser(null);
      setSessionId(null);
      setCandidateId(null);
      setWarningActive(false);
      setStep('property');
    },
    [user, role, sessionId, pushAudit]
  );

  const can = useCallback(
    (permission: PermissionId) => Boolean(role?.permissions.includes(permission)),
    [role]
  );

  const stayLoggedIn = useCallback(() => {
    lastActivity.current = Date.now();
    setWarningActive(false);
    setSecondsToLogout(sessionConfig.warningSeconds);
  }, []);

  const triggerIdleWarning = useCallback(() => {
    lastActivity.current =
    Date.now() - (sessionConfig.timeoutSeconds - sessionConfig.warningSeconds) * 1000;
  }, []);

  // Track user activity to reset the inactivity window.
  useEffect(() => {
    if (!user) return;
    const mark = () => {
      if (!warningActive) lastActivity.current = Date.now();
    };
    const events: (keyof WindowEventMap)[] = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, mark));
    return () => events.forEach((event) => window.removeEventListener(event, mark));
  }, [user, warningActive]);

  // Inactivity clock: warn near the limit, then sign out.
  useEffect(() => {
    if (!user) return;
    const timer = window.setInterval(() => {
      const idle = Math.floor((Date.now() - lastActivity.current) / 1000);
      const remaining = sessionConfig.timeoutSeconds - idle;
      if (remaining <= 0) {
        logout('Signed out automatically after inactivity');
        return;
      }
      if (remaining <= sessionConfig.warningSeconds) {
        setWarningActive(true);
        setSecondsToLogout(remaining);
      } else {
        setWarningActive(false);
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [user, logout]);

  const visibleAuditLog = useMemo(() => {
    if (!role) return [];
    if (role.level === 'owner') return auditLog;
    if (role.level === 'manager')
    return auditLog.filter((entry) => entry.category !== 'Security');
    return auditLog.filter((entry) => entry.category === 'Operations');
  }, [auditLog, role]);

  const value: AuthContextValue = {
    step,
    isAuthenticated: Boolean(user),
    user,
    role,
    isOwner: Boolean(isOwner),
    users,
    roles,
    setRoles,
    setUsers,
    candidateId,
    verifyProperty,
    selectUser,
    verifyUserPassword,
    backToUsers: () => {
      setCandidateId(null);
      setStep('user');
    },
    backToProperty: () => {
      setCandidateId(null);
      setStep('property');
    },
    logout,
    can,
    auditLog,
    visibleAuditLog,
    addAudit,
    loginActivity,
    warningActive,
    secondsToLogout,
    stayLoggedIn,
    triggerIdleWarning
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}