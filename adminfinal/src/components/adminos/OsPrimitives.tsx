import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, DownloadIcon, FileSpreadsheetIcon, FileTextIcon, TableIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Label, Select, Textarea } from '../ui/Field';
import { useAdminOs } from '../../contexts/AdminOsContext';
import type { ExportColumn, ExportFormat } from '../../services/adminos/exports';
import { cn } from '../../utils/cn';

const tones = {
  default: 'border-line bg-card',
  accent: 'border-accent/60 bg-accent/[0.07]',
  positive: 'border-positive/40 bg-positive/[0.06]',
  warning: 'border-warning/50 bg-warning/[0.06]',
  negative: 'border-negative/40 bg-negative/[0.06]'
};

/**
 * Compact metric tile. Pass `to` or `onClick` to make the tile a real
 * navigation target into the records behind the number.
 */
export function MetricTile({
  label,
  value,
  hint,
  tone = 'default',
  live = false,
  to,
  onClick








}: {label: string;value: string;hint?: string;tone?: keyof typeof tones;live?: boolean;to?: string;onClick?: () => void;}) {
  const interactive = Boolean(to || onClick);

  const body =
  <>
      <p className="flex items-center gap-1.5 text-[13px] font-medium text-muted">
        {live ? <LivePulse /> : null}
        {label}
        {interactive ?
      <ChevronRightIcon className="ml-auto h-3.5 w-3.5 opacity-0 transition-opacity duration-150 ease-smooth group-hover:opacity-100" /> :
      null}
      </p>
      <p className="mt-0.5 text-2xl font-bold tracking-tight tabular-nums text-ink">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </>;


  const className = cn(
    'block rounded-xl border px-5 py-4 text-left shadow-card',
    tones[tone],
    interactive &&
    'group transition-colors duration-150 ease-smooth hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
  );

  if (to) {
    return (
      <Link to={to} className={className}>
        {body}
      </Link>);

  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cn(className, 'w-full')}>
        {body}
      </button>);

  }
  return <div className={className}>{body}</div>;
}

export function LivePulse({ className }: {className?: string;}) {
  return (
    <span className={cn('relative flex h-2 w-2 shrink-0', className)}>
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-positive opacity-60" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-positive" />
    </span>);

}

/** Horizontal score bar with a 0–100 scale and a colour band. */
export function ScoreBar({ value, showLabel = true }: {value: number;showLabel?: boolean;}) {
  const tone = value >= 80 ? 'bg-positive' : value >= 60 ? 'bg-accent' : value >= 40 ? 'bg-warning' : 'bg-negative';
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-full min-w-[64px] overflow-hidden rounded-full bg-line">
        <div className={cn('h-full rounded-full', tone)} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
      {showLabel ?
      <span className="w-8 shrink-0 text-right text-[13px] font-semibold tabular-nums text-ink">{value}</span> :
      null}
    </div>);

}

/** Coloured dot + label for hotel visibility states. */
export function StatusPill({ state }: {state: 'Live' | 'Paused' | 'Offline' | 'Vacation';}) {
  const map = {
    Live: { dot: 'bg-positive', ring: 'border-positive/30 bg-positive/10 text-positive' },
    Paused: { dot: 'bg-warning', ring: 'border-warning/30 bg-warning/10 text-warning' },
    Offline: { dot: 'bg-negative', ring: 'border-negative/30 bg-negative/10 text-negative' },
    Vacation: { dot: 'bg-info', ring: 'border-info/30 bg-info/10 text-info' }
  };
  const style = map[state];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium',
        style.ring
      )}>
      
      <span className={cn('h-1.5 w-1.5 rounded-full', style.dot)} />
      {state}
    </span>);

}

/** Section heading used inside dense analytical pages. */
export function SectionTitle({ children, hint }: {children: React.ReactNode;hint?: string;}) {
  return (
    <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <h2 className="text-base font-semibold tracking-tight text-ink">{children}</h2>
      {hint ? <p className="text-[13px] text-muted">{hint}</p> : null}
    </div>);

}

/**
 * Export control that generates a real CSV, Excel, or PDF file from the rows
 * currently on screen and writes an audit record for the export.
 */
export function ExportMenu<T>({
  title,
  subtitle,
  columns,
  rows,
  entity,
  label = 'Export'







}: {title: string;subtitle?: string;columns: ExportColumn<T>[];rows: T[];entity?: string;label?: string;}) {
  const { download } = useAdminOs();
  const [open, setOpen] = useState(false);

  const options: {format: ExportFormat;icon: React.ComponentType<{className?: string;}>;hint: string;}[] = [
  { format: 'CSV', icon: TableIcon, hint: 'Raw comma-separated values' },
  { format: 'Excel', icon: FileSpreadsheetIcon, hint: 'Formatted workbook' },
  { format: 'PDF', icon: FileTextIcon, hint: 'Paginated report' }];


  return (
    <div className="relative">
      <Button icon={DownloadIcon} onClick={() => setOpen((prev) => !prev)} aria-expanded={open}>
        {label}
      </Button>
      {open ?
      <>
          <button
          className="fixed inset-0 z-30 cursor-default"
          aria-label="Close export menu"
          onClick={() => setOpen(false)} />
        
          <div className="absolute right-0 z-40 mt-1.5 w-56 overflow-hidden rounded-xl border border-line bg-elevated shadow-pop">
            <p className="border-b border-line px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
              {rows.length} rows
            </p>
            {options.map((option) =>
          <button
            key={option.format}
            onClick={() => {
              download({ format: option.format, title, subtitle, columns, rows, entity });
              setOpen(false);
            }}
            className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors duration-150 ease-smooth hover:bg-faint">
            
                <option.icon className="h-4 w-4 shrink-0 text-muted" />
                <span className="min-w-0">
                  <span className="block text-[13px] font-medium text-ink">Download {option.format}</span>
                  <span className="block text-[11px] text-muted">{option.hint}</span>
                </span>
              </button>
          )}
          </div>
        </> :
      null}
    </div>);

}

/**
 * Confirmation dialog that requires a written reason before the action can be
 * submitted. Used by every state-changing AdminOS action.
 */
export function ReasonDialog({
  open,
  onClose,
  title,
  description,
  reasons,
  confirmLabel,
  danger = false,
  placeholder,
  onConfirm,
  children











}: {open: boolean;onClose: () => void;title: string;description?: string;reasons?: string[];confirmLabel: string;danger?: boolean;placeholder?: string;onConfirm: (reason: string) => void;children?: React.ReactNode;}) {
  const [preset, setPreset] = useState(reasons?.[0] ?? '');
  const [note, setNote] = useState('');

  const reason = [preset, note].filter(Boolean).join(' — ');
  const valid = reason.trim().length >= 4;

  function submit() {
    if (!valid) return;
    onConfirm(reason.trim());
    setNote('');
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      footer={
      <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant={danger ? 'danger' : 'primary'} disabled={!valid} onClick={submit}>
            {confirmLabel}
          </Button>
        </>
      }>
      
      <div className="space-y-4">
        {children}
        {reasons?.length ?
        <div>
            <Label htmlFor="reason-preset">Reason</Label>
            <Select
            id="reason-preset"
            options={reasons}
            value={preset}
            onChange={(event) => setPreset(event.target.value)} />
          
          </div> :
        null}
        <div>
          <Label htmlFor="reason-note">{reasons?.length ? 'Additional note' : 'Reason (required)'}</Label>
          <Textarea
            id="reason-note"
            rows={3}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder={placeholder ?? 'Recorded on the audit trail with your name, role, and IP address.'} />
          
          {!valid ?
          <p className="mt-1.5 text-xs text-muted">A written reason is required before this action can run.</p> :
          null}
        </div>
      </div>
    </Modal>);

}