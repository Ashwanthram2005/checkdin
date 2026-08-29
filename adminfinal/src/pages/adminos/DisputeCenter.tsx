import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowUpRightIcon, CheckIcon, GavelIcon, XIcon } from 'lucide-react';
import { Card, CardHeader } from '../../components/ui/Card';
import { PageHeader, Toolbar } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input, Label, SearchInput, Select } from '../../components/ui/Field';
import { Tabs } from '../../components/ui/Tabs';
import { MetricTile, ExportMenu, ReasonDialog } from '../../components/adminos/OsPrimitives';
import { EmptyState } from '../../components/ui/Primitives';
import { useAdminOs } from '../../contexts/AdminOsContext';
import type { DisputeRecord } from '../../services/adminos/store';
import { formatCurrency } from '../../utils/format';
import { cn } from '../../utils/cn';

const tabs = ['All', 'Extension', 'Refund', 'Payment', 'Booking'];
const statusOptions = ['All statuses', 'Open', 'In Review', 'Escalated', 'Resolved', 'Rejected'];
const agents = ['Karthik Raman (Super Admin)', 'Divya Menon (Support Lead)', 'Rohan Gupta (Finance)', 'Legal desk'];

type Decision = 'approve' | 'reject' | 'manual';

export function DisputeCenter() {
  const { state, run } = useAdminOs();
  const [params, setParams] = useSearchParams();

  const [tab, setTab] = useState(params.get('kind') ?? 'All');
  const [status, setStatus] = useState('All statuses');
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [decision, setDecision] = useState<Decision | null>(null);
  const [escalating, setEscalating] = useState(false);
  const [amount, setAmount] = useState(0);
  const [outcome, setOutcome] = useState('Full refund to guest');
  const [agent, setAgent] = useState(agents[0]);

  const disputes = state.disputes;

  const counts = useMemo(() => {
    const result: Record<string, number> = { All: disputes.length };
    tabs.slice(1).forEach((kind) => {
      result[kind] = disputes.filter((dispute) => dispute.kind === kind).length;
    });
    return result;
  }, [disputes]);

  const rows = useMemo(
    () =>
    disputes.filter((dispute) => {
      if (tab !== 'All' && dispute.kind !== tab) return false;
      if (status !== 'All statuses' && dispute.status !== status) return false;
      if (!query) return true;
      const needle = query.toLowerCase();
      return (
        dispute.reference.toLowerCase().includes(needle) ||
        dispute.bookingId.toLowerCase().includes(needle) ||
        dispute.raisedBy.toLowerCase().includes(needle) ||
        dispute.propertyName.toLowerCase().includes(needle));

    }),
    [disputes, tab, status, query]
  );

  const active = rows.find((dispute) => dispute.id === activeId) ?? rows[0] ?? null;
  const open = disputes.filter((dispute) => dispute.status === 'Open' || dispute.status === 'In Review');
  const escalated = disputes.filter((dispute) => dispute.status === 'Escalated');
  const exposure = open.reduce((sum, dispute) => sum + dispute.amount, 0);
  const ageing = disputes.filter((dispute) => dispute.ageHours > 72 && dispute.status !== 'Resolved').length;

  function updateTab(next: string) {
    setTab(next);
    const nextParams = new URLSearchParams(params);
    if (next === 'All') nextParams.delete('kind');else
    nextParams.set('kind', next);
    setParams(nextParams, { replace: true });
  }

  function openDecision(kind: Decision, dispute: DisputeRecord) {
    setActiveId(dispute.id);
    setAmount(dispute.amount);
    setOutcome(kind === 'reject' ? 'No refund' : 'Full refund to guest');
    setDecision(kind);
  }

  return (
    <div>
      <PageHeader
        title="Support & dispute resolution"
        subtitle="Extension, refund, payment, and booking disputes from both guests and partners."
        actions={
        <ExportMenu
          title="Dispute register"
          entity="Dispute"
          rows={rows}
          columns={[
          { header: 'Reference', value: (row: DisputeRecord) => row.reference },
          { header: 'Type', value: (row: DisputeRecord) => row.kind },
          { header: 'Status', value: (row: DisputeRecord) => row.status },
          { header: 'Raised by', value: (row: DisputeRecord) => row.raisedBy },
          { header: 'Party', value: (row: DisputeRecord) => row.party },
          { header: 'Booking', value: (row: DisputeRecord) => row.bookingId },
          { header: 'Hotel', value: (row: DisputeRecord) => row.propertyName },
          { header: 'Amount', value: (row: DisputeRecord) => row.amount },
          { header: 'Age (hours)', value: (row: DisputeRecord) => row.ageHours },
          { header: 'Assigned to', value: (row: DisputeRecord) => row.assignedTo },
          { header: 'Resolution', value: (row: DisputeRecord) => row.resolution }]
          } />

        } />
      

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <MetricTile label="Open disputes" value={String(open.length)} hint="awaiting a decision" tone="warning" onClick={() => setStatus('Open')} />
        <MetricTile label="Escalated" value={String(escalated.length)} hint="with the leadership desk" tone="negative" onClick={() => setStatus('Escalated')} />
        <MetricTile label="Money at stake" value={formatCurrency(exposure)} hint="across open cases" tone="accent" />
        <MetricTile label="Ageing over 72h" value={String(ageing)} hint="breaching the resolution SLA" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[400px_1fr]">
        <Card className="h-fit">
          <Tabs tabs={tabs} value={tab} onChange={updateTab} counts={counts} />
          <Toolbar>
            <SearchInput
              className="sm:flex-1"
              placeholder="Search reference, booking, party…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search disputes" />
            
          </Toolbar>
          <div className="border-b border-line px-4 py-2.5">
            <Select
              className="w-full"
              options={statusOptions}
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              aria-label="Filter by status" />
            
          </div>
          {rows.length === 0 ?
          <EmptyState icon={GavelIcon} title="No disputes match" description="Try a different case type or status." /> :

          <ul className="max-h-[560px] divide-y divide-line overflow-y-auto">
              {rows.map((dispute) =>
            <li key={dispute.id}>
                  <button
                onClick={() => setActiveId(dispute.id)}
                className={cn(
                  'w-full px-4 py-3.5 text-left transition-colors duration-150 ease-smooth hover:bg-faint',
                  active?.id === dispute.id && 'bg-accent/10'
                )}>
                
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-muted">{dispute.reference}</span>
                      <Badge tone="neutral">{dispute.kind}</Badge>
                      <span className="ml-auto text-[11px] text-muted">{dispute.ageHours}h old</span>
                    </div>
                    <p className="mt-1 truncate text-[13px] font-semibold text-ink">{dispute.summary.split(' — ')[0]}</p>
                    <p className="mt-0.5 truncate text-xs text-muted">
                      {dispute.party} · {dispute.raisedBy} · {dispute.status}
                    </p>
                  </button>
                </li>
            )}
            </ul>
          }
        </Card>

        {active ?
        <Card>
            <CardHeader
            title={active.summary.split(' — ')[0]}
            subtitle={`${active.reference} · ${active.kind} dispute raised by ${active.raisedBy}`}
            action={<Badge>{active.status}</Badge>} />
          
            <div className="space-y-5 px-5 py-5">
              <p className="text-[13px] leading-relaxed text-muted">{active.summary.split(' — ')[1]}</p>

              <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
                {[
              { label: 'Booking', value: active.bookingId },
              { label: 'Property', value: active.propertyName },
              { label: 'Amount', value: formatCurrency(active.amount) },
              { label: 'Assigned to', value: active.assignedTo }].
              map((item) =>
              <div key={item.label}>
                    <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted">{item.label}</dt>
                    <dd className="mt-1 text-sm font-medium text-ink">{item.value}</dd>
                  </div>
              )}
              </dl>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Case history</p>
                <ol className="mt-2 space-y-2 border-l border-line pl-4">
                  {active.history.map((entry, index) =>
                <li key={`${entry.at}-${index}`} className="relative">
                      <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-accent" />
                      <p className="text-[13px] text-ink">{entry.note}</p>
                      <p className="text-[11px] text-muted">{entry.at}</p>
                    </li>
                )}
                </ol>
              </div>

              {active.resolution ?
            <p className="rounded-xl border border-line bg-faint px-4 py-3 text-[13px] text-muted">
                  <span className="font-semibold text-ink">Resolution: </span>
                  {active.resolution}
                </p> :
            null}

              <div className="flex flex-wrap gap-2 rounded-xl border border-line bg-faint px-4 py-3.5">
                <Button size="sm" variant="primary" icon={CheckIcon} onClick={() => openDecision('approve', active)}>
                  Approve refund
                </Button>
                <Button size="sm" variant="danger" icon={XIcon} onClick={() => openDecision('reject', active)}>
                  Reject refund
                </Button>
                <Button size="sm" icon={ArrowUpRightIcon} onClick={() => {setActiveId(active.id);setEscalating(true);}}>
                  Escalate case
                </Button>
                <Button size="sm" icon={GavelIcon} onClick={() => openDecision('manual', active)}>
                  Manual resolution
                </Button>
              </div>
            </div>
          </Card> :
        null}
      </div>

      <ReasonDialog
        open={Boolean(decision)}
        onClose={() => setDecision(null)}
        title={
        decision === 'approve' ?
        `Approve refund — ${active?.reference ?? ''}` :
        decision === 'reject' ?
        `Reject refund — ${active?.reference ?? ''}` :
        `Manual resolution — ${active?.reference ?? ''}`
        }
        description="The decision is written to the case history, the audit log, and the affected party is notified."
        confirmLabel={decision === 'reject' ? 'Reject refund' : 'Process decision'}
        danger={decision === 'reject'}
        onConfirm={(reason) => {
          if (!active) return;
          run(
            {
              type: 'dispute.decide',
              id: active.id,
              outcome: decision === 'reject' ? 'Rejected' : 'Resolved',
              amount: decision === 'reject' ? 0 : amount,
              note: `${outcome} — ${reason}`
            },
            {
              permission: 'Disputes',
              success: decision === 'reject' ? 'Refund rejected and party notified' : `Refund processed — ${formatCurrency(amount)}`
            }
          );
        }}>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="dispute-outcome">Outcome</Label>
            <Select
              id="dispute-outcome"
              options={['Full refund to guest', 'Partial refund to guest', 'Charge borne by partner', 'Charge borne by Checkdin', 'No refund']}
              value={outcome}
              onChange={(event) => setOutcome(event.target.value)} />
            
          </div>
          <div>
            <Label htmlFor="dispute-amount">Amount (₹)</Label>
            <Input
              id="dispute-amount"
              type="number"
              value={amount}
              onChange={(event) => setAmount(Number(event.target.value))}
              disabled={decision === 'reject'} />
            
          </div>
        </div>
      </ReasonDialog>

      <ReasonDialog
        open={escalating}
        onClose={() => setEscalating(false)}
        title={`Escalate ${active?.reference ?? ''}`}
        description="Escalation assigns the case to a named owner and starts the leadership SLA."
        confirmLabel="Escalate case"
        onConfirm={() => {
          if (!active) return;
          run(
            { type: 'dispute.escalate', id: active.id, assignedTo: agent },
            { permission: 'Disputes', success: `Case escalated to ${agent}` }
          );
        }}>
        
        <div>
          <Label htmlFor="dispute-agent">Assign to</Label>
          <Select id="dispute-agent" options={agents} value={agent} onChange={(event) => setAgent(event.target.value)} />
        </div>
      </ReasonDialog>
    </div>);

}