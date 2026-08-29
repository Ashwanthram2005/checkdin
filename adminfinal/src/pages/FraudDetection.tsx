import React, { useMemo, useState } from 'react';
import { BanIcon, CheckIcon, ShieldAlertIcon } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { PageHeader, Toolbar } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { SearchInput, Select, Label, Textarea } from '../components/ui/Field';
import { Tabs } from '../components/ui/Tabs';
import { Modal } from '../components/ui/Modal';
import { TableSkeleton, ErrorState } from '../components/ui/LoadingState';
import { EmptyState } from '../components/ui/Primitives';
import { useMockQuery } from '../hooks/useMockQuery';
import { api } from '../services/api';
import { formatCurrency } from '../utils/format';
import { cn } from '../utils/cn';
import type { FraudAlert } from '../types';

const tabs = ['All', 'Suspicious Booking', 'Duplicate Account', 'Chargeback', 'High Cancellation'];
const statusOptions = ['All statuses', 'Open', 'Reviewing', 'Cleared', 'Blocked'];

function riskTone(score: number) {
  if (score >= 85) return 'negative' as const;
  if (score >= 70) return 'warning' as const;
  return 'info' as const;
}

export function FraudDetection() {
  const { data, loading, error } = useMockQuery(api.getFraudAlerts, []);
  const [tab, setTab] = useState('All');
  const [status, setStatus] = useState('All statuses');
  const [query, setQuery] = useState('');
  const [blocking, setBlocking] = useState<FraudAlert | null>(null);

  const alerts = data ?? [];

  const counts = useMemo(() => {
    const result: Record<string, number> = { All: alerts.length };
    tabs.slice(1).forEach((type) => {
      result[type] = alerts.filter((alert) => alert.type === type).length;
    });
    return result;
  }, [alerts]);

  const rows = useMemo(
    () =>
    alerts.filter((alert) => {
      if (tab !== 'All' && alert.type !== tab) return false;
      if (status !== 'All statuses' && alert.status !== status) return false;
      if (!query) return true;
      const needle = query.toLowerCase();
      return (
        alert.subject.toLowerCase().includes(needle) ||
        alert.reference.toLowerCase().includes(needle) ||
        alert.detail.toLowerCase().includes(needle));

    }),
    [alerts, tab, status, query]
  );

  const exposure = alerts.
  filter((alert) => alert.status === 'Open' || alert.status === 'Reviewing').
  reduce((sum, alert) => sum + alert.amount, 0);

  return (
    <div>
      <PageHeader
        title="Fraud detection"
        subtitle="Risk signals raised by the rules engine, ranked by score and money at stake." />
      

      <div className="mb-4 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Card className="border-negative/40 bg-negative/[0.06] px-5 py-4">
          <p className="text-[13px] font-medium text-muted">Open exposure</p>
          <p className="mt-0.5 text-2xl font-bold tracking-tight text-ink">{formatCurrency(exposure)}</p>
          <p className="mt-1 text-xs text-muted">
            {alerts.filter((alert) => alert.status === 'Open').length} unreviewed alerts
          </p>
        </Card>
        {['Suspicious Booking', 'Duplicate Account', 'Chargeback'].map((type) =>
        <Card key={type} className="px-5 py-4">
            <p className="text-[13px] font-medium text-muted">{type}</p>
            <p className="mt-0.5 text-2xl font-bold tracking-tight text-ink">{counts[type] ?? 0}</p>
            <p className="mt-1 text-xs text-muted">last 7 days</p>
          </Card>
        )}
      </div>

      <Card>
        <Tabs tabs={tabs} value={tab} onChange={setTab} counts={counts} />
        <Toolbar>
          <SearchInput
            className="sm:max-w-xs sm:flex-1"
            placeholder="Search subject, reference, signal…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search fraud alerts" />
          
          <div className="sm:ml-auto">
            <Select options={statusOptions} value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by status" />
          </div>
        </Toolbar>

        {loading ?
        <TableSkeleton rows={5} /> :
        error ?
        <ErrorState message={error} /> :
        rows.length === 0 ?
        <EmptyState
          icon={ShieldAlertIcon}
          title="No alerts match these filters"
          description="The rules engine re-scores every booking within a minute of payment." /> :


        <ul className="divide-y divide-line">
            {rows.map((alert) =>
          <li key={alert.id} className="px-5 py-4">
                <div className="flex flex-wrap items-start gap-3">
                  <div
                className={cn(
                  'flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl border text-xs font-bold',
                  riskTone(alert.riskScore) === 'negative' && 'border-negative/30 bg-negative/10 text-negative',
                  riskTone(alert.riskScore) === 'warning' && 'border-warning/30 bg-warning/10 text-warning',
                  riskTone(alert.riskScore) === 'info' && 'border-info/30 bg-info/10 text-info'
                )}>
                
                    {alert.riskScore}
                    <span className="text-[9px] font-medium uppercase tracking-wide">risk</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-ink">{alert.subject}</p>
                      <Badge tone="neutral">{alert.type}</Badge>
                      <Badge>{alert.status}</Badge>
                      <span className="ml-auto text-xs text-muted">{alert.detectedAt}</span>
                    </div>
                    <p className="mt-1.5 text-[13px] text-muted">{alert.detail}</p>
                    <p className="mt-1.5 font-mono text-xs text-muted">
                      {alert.reference}
                      {alert.amount ? ` · ${formatCurrency(alert.amount)} at risk` : ''}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button size="sm" icon={CheckIcon} onClick={() => api.mutate('fraud.clear', { id: alert.id })}>
                        Mark cleared
                      </Button>
                      <Button size="sm" onClick={() => api.mutate('fraud.review', { id: alert.id })}>
                        Start review
                      </Button>
                      <Button size="sm" variant="danger" icon={BanIcon} onClick={() => setBlocking(alert)}>
                        Block account
                      </Button>
                    </div>
                  </div>
                </div>
              </li>
          )}
          </ul>
        }
      </Card>

      <Card className="mt-4">
        <CardHeader title="Active detection rules" subtitle="Tuned by the risk team" />
        <ul className="divide-y divide-line">
          {[
          { rule: 'Velocity — 5+ bookings per card in 1 hour', action: 'Hold payment, raise alert', status: 'Active' },
          { rule: 'Device fingerprint shared across 3+ accounts', action: 'Flag duplicate accounts', status: 'Active' },
          { rule: 'Cancellation rate above 40% in 30 days', action: 'Restrict prepaid-only booking', status: 'Active' },
          { rule: 'First-seen card above ₹25,000', action: 'Manual review before confirmation', status: 'Active' },
          { rule: 'Chargeback filed on completed stay', action: 'Freeze partner payout for the booking', status: 'Active' }].
          map((item) =>
          <li key={item.rule} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-ink">{item.rule}</p>
                <p className="text-xs text-muted">{item.action}</p>
              </div>
              <Badge>{item.status}</Badge>
            </li>
          )}
        </ul>
      </Card>

      <Modal
        open={Boolean(blocking)}
        onClose={() => setBlocking(null)}
        title={`Block ${blocking?.subject ?? ''}`}
        description="Blocking cancels open bookings, freezes refunds, and bans future sign-ins from linked devices."
        width="sm"
        footer={
        <>
            <Button onClick={() => setBlocking(null)}>Cancel</Button>
            <Button
            variant="danger"
            onClick={() => {
              api.mutate('fraud.block', { id: blocking?.id });
              setBlocking(null);
            }}>
            
              Block account
            </Button>
          </>
        }>
        
        <Label htmlFor="block-note">Investigation note</Label>
        <Textarea id="block-note" placeholder="Summarise the evidence — this is attached to the audit log." />
      </Modal>
    </div>);

}