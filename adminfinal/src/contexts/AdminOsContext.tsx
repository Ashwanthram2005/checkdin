import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import { makeLiveEvent } from '../data/adminos/liveEvents';
import {
  hydrate,
  persist,
  reduce,
  resetPersisted,
  sessionIp,
  type AdminOsState,
  type OsAction,
  type OsActor } from
'../services/adminos/store';
import { exportRows, type ExportColumn, type ExportFormat } from '../services/adminos/exports';

interface RunOptions {
  /** Toast shown when the action succeeds. */
  success?: string;
  /** Permission required to run the action, checked against the signed-in role. */
  permission?: string;
}

interface AdminOsContextValue {
  state: AdminOsState;
  actor: OsActor;
  /** Applies an action: mutates state, writes the audit record, fires notifications. */
  run: (action: OsAction, options?: RunOptions) => boolean;
  can: (permission: string) => boolean;
  streaming: boolean;
  setStreaming: (next: boolean) => void;
  download: <T>(options: {
    format: ExportFormat;
    title: string;
    subtitle?: string;
    columns: ExportColumn<T>[];
    rows: T[];
    entity?: string;
  }) => void;
  reset: () => void;
}

const AdminOsContext = createContext<AdminOsContextValue | null>(null);

interface ReducerAction {
  action: OsAction;
  actor: OsActor;
}

function rootReducer(state: AdminOsState, incoming: ReducerAction): AdminOsState {
  return reduce(state, incoming.action, incoming.actor);
}

export function AdminOsProvider({ children }: {children: React.ReactNode;}) {
  const { user, role } = useAuth();
  const [state, dispatch] = useReducer(rootReducer, undefined, hydrate);
  const [streaming, setStreamingState] = React.useState(true);
  const streamingRef = useRef(streaming);
  streamingRef.current = streaming;

  const actor = useMemo<OsActor>(
    () => ({
      name: user?.name ?? 'System',
      email: user?.email ?? 'system@checkdin.com',
      role: user?.roleName ?? 'Automation',
      roleId: user?.roleId ?? 'system',
      ip: sessionIp()
    }),
    [user]
  );

  useEffect(() => {
    persist(state);
  }, [state]);

  /** Event stream: pushes marketplace events into shared state on an interval. */
  useEffect(() => {
    if (!streaming) return;
    const id = window.setInterval(() => {
      dispatch({ action: { type: 'events.push', event: makeLiveEvent() }, actor });
    }, 3400);
    return () => window.clearInterval(id);
  }, [streaming, actor]);

  /** Extension SLA worker: expires pending requests that pass the response window. */
  useEffect(() => {
    const id = window.setInterval(() => {
      const stale = state.extensions.find((row) => row.status === 'Pending');
      if (!stale) return;
      dispatch({ action: { type: 'extension.expire', id: stale.id }, actor });
    }, 120000);
    return () => window.clearInterval(id);
  }, [state.extensions, actor]);

  const can = useCallback(
    (permission: string) => {
      if (!role) return false;
      if (role.id === 'super') return true;
      return role.modules.includes(permission);
    },
    [role]
  );

  const run = useCallback(
    (action: OsAction, options?: RunOptions) => {
      if (options?.permission && !can(options.permission)) {
        toast.error('Permission denied', {
          description: `Your ${role?.name ?? 'current'} role cannot perform this action.`
        });
        return false;
      }
      dispatch({ action, actor });
      if (options?.success) toast.success(options.success);
      return true;
    },
    [actor, can, role]
  );

  const download = useCallback<AdminOsContextValue['download']>(
    ({ format, title, subtitle, columns, rows, entity }) => {
      if (!rows.length) {
        toast.error('Nothing to export', { description: 'Adjust the filters so the export has rows.' });
        return;
      }
      const fileName = exportRows({ format, title, subtitle, columns, rows });
      dispatch({
        action: {
          type: 'audit.record',
          entry: {
            action: `Export ${format}`,
            entityType: entity ?? 'Report',
            entityId: fileName,
            entityLabel: title,
            previousState: '—',
            newState: `${rows.length} rows exported as ${format}`,
            reason: 'Data export requested from AdminOS'
          }
        },
        actor
      });
      toast.success(`${format} downloaded`, { description: `${fileName} · ${rows.length} rows` });
    },
    [actor]
  );

  const setStreaming = useCallback((next: boolean) => setStreamingState(next), []);

  const reset = useCallback(() => {
    resetPersisted();
    window.location.reload();
  }, []);

  const value = useMemo<AdminOsContextValue>(
    () => ({ state, actor, run, can, streaming, setStreaming, download, reset }),
    [state, actor, run, can, streaming, setStreaming, download, reset]
  );

  return <AdminOsContext.Provider value={value}>{children}</AdminOsContext.Provider>;
}

export function useAdminOs(): AdminOsContextValue {
  const context = useContext(AdminOsContext);
  if (!context) throw new Error('useAdminOs must be used inside AdminOsProvider');
  return context;
}