import React from 'react';
import { LockIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { PermissionId } from '../data/auth';

export function OwnerRequiredBadge({ label = 'Owner Permission Required' }: {label?: string;}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold text-ink-muted">
      <LockIcon size={12} aria-hidden="true" />
      {label}
    </span>);

}

/** Renders children for the Owner, and a locked notice for everyone else. */
export function OwnerOnly({
  children,
  title,
  description




}: {children: React.ReactNode;title: string;description?: string;}) {
  const { isOwner } = useAuth();
  if (isOwner) return <>{children}</>;

  return (
    <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/70 p-5 text-center">
      <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-card">
        <LockIcon size={17} className="text-ink-muted" aria-hidden="true" />
      </span>
      <p className="mt-3 text-[13.5px] font-semibold text-ink">{title}</p>
      <p className="mx-auto mt-1 max-w-[420px] text-[12.5px] text-ink-muted">
        {description ?? 'Owner Permission Required — ask the property owner to make this change.'}
      </p>
      <div className="mt-3">
        <OwnerRequiredBadge />
      </div>
    </div>);

}

/** Renders children only when the signed-in role holds the permission. */
export function PermissionOnly({
  permission,
  children,
  fallback




}: {permission: PermissionId;children: React.ReactNode;fallback?: React.ReactNode;}) {
  const { can } = useAuth();
  if (can(permission)) return <>{children}</>;
  return <>{fallback ?? null}</>;
}

export function PermissionNotice({ label }: {label: string;}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold text-ink-muted">
      <LockIcon size={12} aria-hidden="true" />
      {label}
    </span>);

}