import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BanIcon, CheckIcon, SearchCheckIcon, ShieldAlertIcon } from 'lucide-react';
import { Card, CardHeader } from '../../components/ui/Card';
import { PageHeader, Toolbar } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { SearchInput, Select } from '../../components/ui/Field';
import { Tabs } from '../../components/ui/Tabs';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/Primitives';
import { MetricTile, ExportMenu, ReasonDialog, ScoreBar } from '../../components/adminos/OsPrimitives';
import { useAdminOs } from '../../contexts/AdminOsContext';
import { riskScore } from '../../services/adminos/selectors';
import type { RiskRecord } from '../../services/adminos/store';
import { formatCurrency } from '../../utils/format';
import { cn } from '../../utils/cn';

const tabs = ['All', 'Hotels', 'Customers'];
const bandOptions = ['All bands', 'High', 'Medium', 'Low'];

const detectionRules = [
{ rule: 'Fake bookings — repeated no-show with instant refund claims', weight: 26, action: 'Hold payment, raise alert' },
{ rule: 'Excessive cancellations — above 40% in a 30-day window', weight: 22, action: 'Restrict to prepaid-only booking' },
{ rule: 'Payment abuse — 3+ cards on a single device fingerprint', weight: 24, action: 'Manual review before confirmation' },
{ rule: 'Fraudulent refund requests — 2+ rejected claims in 60 days', weight: 20, action: 'Route refunds to manual approval' },
{ rule: 'Abnormal extension activity — 8+ extensions in 24 hours', weight: 18, action: 'Flag the hotel and the guest' },
{ rule: 'Chargeback filed on a verified stay', weight: 25, action: 'Freeze partner payout for the cycle' }];


export function RiskCenter() {
  const { state, run } = useAdminOs();
  const [params] = useSearchParams();

  const [tab, setTab] = useState('All');
  const [band, setBand] = useState('All bands');
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [blocking, setBlocking] = useState<RiskRecord | null>(null);
  const [investigating, setInvestigating] = useState<RiskRecord | null>(null);
  const [profile, setProfile] = useState<RiskRecord | null>(null);

  /** Scores are recomputed from live signals, disputes, and exposure. */
  const scored = useMemo(
    () =>
    state.risks.
    map((entity) => {
      const score = riskScore(entity, state);
      return {
        ...entity,
        score,
        band: score >= 75 ? 'High' as const : score >= 45 ? 'Medium' as const : 'Low' as const
      };
    }).
    sort((a, b) => b.score - a.score),
    [state]
  );

  const counts = useMemo(
    () => ({
      All: scored.length,
      Hotels: scored.filter((entity) => entity.type === 'Hotel').length,
      Customers: scored.filter((entity) => entity.type === 'Customer').length
    }),
    [scored]
  );

  const rows = useMemo(
    () =>
    scored.filter((entity) => {
      if (tab === 'Hotels' && entity.type !== 'Hotel') return false;
      if (tab === 'Customers' && entity.type !== 'Customer') return false;
      if (band !== 'All bands' && entity.band !== band) return false;
      if (!query) return true;
      const needle = query.toLowerCase();
      return (
        entity.name.toLowerCase().includes(needle) ||
        entity.city.toLowerCase().includes(needle) ||
        entity.signals.join(' ').toLowerCase().includes(needle));

    }),
    [scored, tab, band, query]
  );

  const high = scored.filter((entity) => entity.band === 'High');
  const exposure = scored.reduce((sum, entity) => sum + entity.exposure, 0);

  return (
    <div>
      <PageHeader
        title="Fraud & risk detection"
        subtitle="Risk-scored hotels and customers, recalculated from live signals, disputes, and exposure."
        actions={
        <ExportMenu
          title="Risk register"
          entity="Risk"
          rows={rows}
          columns={[
          { header: 'Entity', value: (row: RiskRecord) => row.name },
          { header: 'Type', value: (row: RiskRecord) => row.type },
          { header: 'City', value: (row: RiskRecord) => row.city },
          { header: 'Score', value: (row: RiskRecord) => row.score },
          { header: 'Band', value: (row: RiskRecord) => row.band },
          { header: 'Status', value: (row: RiskRecord) => row.status },
          { header: 'Exposure', value: (row: RiskRecord) => row.exposure },
          { header: 'Signals', value: (row: RiskRecord) => row.signals.join(' | ') },
          { header: 'Note', value: (row: RiskRecord) => row.note }]
          } />

        } />
      

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <MetricTile label="High risk" value={String(high.length)} hint="score 75 and above" tone="negative" onClick={() => setBand('High')} />
        <MetricTile label="Medium risk" value={String(scored.filter((e) => e.band === 'Medium').length)} hint="score 45–74" tone="warning" onClick={() => setBand('Medium')} />
        <MetricTile label="Low risk" value={String(scored.filter((e) => e.band === 'Low').length)} hint="score below 45" tone="positive" onClick={() => setBand('Low')} />
        <MetricTile label="Total exposure" value={formatCurrency(exposure)} hint="value tied to flagged entities" tone="accent" />
      </div>

      <Card className="mt-4">
        <Tabs tabs={tabs} value={tab} onChange={setTab} counts={counts} />
        <Toolbar>
          <SearchInput
            className="sm:max-w-xs sm:flex-1"
            placeholder="Search entity, city, or signal…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search risk entities" />
          
          <div className="sm:ml-auto">
            <Select options={bandOptions} value={band} onChange={(event) => setBand(event.target.value)} aria-label="Filter by risk band" />
          </div>
        </Toolbar>

        {rows.length === 0 ?
        <EmptyState
          icon={ShieldAlertIcon}
          title="No entities match these filters"
          description="Scores are recomputed on every payment, cancellation, and dispute decision." /> :


        <ul className="divide-y divide-line">
            {rows.map((entity) =>
          <li key={entity.id} className="flex flex-wrap items-start gap-3 px-5 py-4">
                <div
              className={cn(
                'flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl border text-xs font-bold',
                entity.band === 'High' && 'border-negative/30 bg-negative/10 text-negative',
                entity.band === 'Medium' && 'border-warning/30 bg-warning/10 text-warning',
                entity.band === 'Low' && 'border-positive/30 bg-positive/10 text-positive'
              )}>
              
                  {entity.score}
                  <span className="text-[9px] font-medium uppercase tracking-wide">risk</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-ink">{entity.name}</p>
                    <Badge tone="neutral">{entity.type}</Badge>
                    <Badge tone={entity.band === 'High' ? 'negative' : entity.band === 'Medium' ? 'warning' : 'positive'}>
                      {entity.band} risk
                    </Badge>
                    <Badge tone={entity.status === 'Blocked' ? 'negative' : entity.status === 'Cleared' ? 'positive' : 'neutral'}>
                      {entity.status}
                    </Badge>
                    <span className="ml-auto text-xs text-muted">{entity.lastEvent}</span>
                  </div>
                  <ul className="mt-1.5 space-y-1">
                    {entity.signals.map((signal) =>
                <li key={signal} className="text-[13px] text-muted">
                        · {signal}
                      </li>
                )}
                  </ul>
                  <p className="mt-1.5 text-xs text-muted">
                    {entity.city} · {formatCurrency(entity.exposure)} at risk
                    {entity.note ? ` · ${entity.note}` : ''}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button size="sm" onClick={() => setProfile(entity)}>
                      View risk profile
                    </Button>
                    <Button size="sm" icon={SearchCheckIcon} onClick={() => setInvestigating(entity)}>
                      Investigate
                    </Button>
                    <Button
                  size="sm"
                  icon={CheckIcon}
                  onClick={() =>
                  run(
                    { type: 'risk.setStatus', id: entity.id, status: 'Cleared', note: 'Reviewed and cleared by the risk desk' },
                    { permission: 'Risk & Fraud', success: `${entity.name} cleared` }
                  )
                  }>
                  
                      Clear flag
                    </Button>
                    <Button size="sm" variant="danger" icon={BanIcon} onClick={() => setBlocking(entity)}>
                      {entity.type === 'Hotel' ? 'Suspend hotel' : 'Block customer'}
                    </Button>
                  </div>
                </div>
              </li>
          )}
          </ul>
        }
      </Card>

      <Card className="mt-4">
        <CardHeader title="Detection rules" subtitle="Signal weights that build the score" />
        <ul className="divide-y divide-line">
          {detectionRules.map((item) =>
          <li key={item.rule} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-ink">{item.rule}</p>
                <p className="text-xs text-muted">{item.action}</p>
              </div>
              <span className="text-[13px] font-semibold tabular-nums text-ink">+{item.weight}</span>
              <Badge tone="positive">Active</Badge>
            </li>
          )}
        </ul>
      </Card>

      <Modal
        open={Boolean(profile)}
        onClose={() => setProfile(null)}
        title={`Risk profile — ${profile?.name ?? ''}`}
        description={profile ? `${profile.type} · ${profile.city} · ${profile.status}` : undefined}
        footer={<Button onClick={() => setProfile(null)}>Close</Button>}>
        
        {profile ?
        <div className="space-y-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Composite score</p>
              <div className="mt-1.5">
                <ScoreBar value={profile.score} />
              </div>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Contributing signals</p>
              <ul className="mt-2 divide-y divide-line rounded-xl border border-line">
                {profile.signals.map((signal) =>
              <li key={signal} className="px-4 py-2.5 text-[13px] text-ink">
                    {signal}
                  </li>
              )}
              </ul>
            </div>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted">Exposure</dt>
                <dd className="mt-1 text-sm font-medium text-ink">{formatCurrency(profile.exposure)}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted">Open disputes linked</dt>
                <dd className="mt-1 text-sm font-medium text-ink">
                  {
                state.disputes.filter(
                  (dispute) =>
                  (dispute.propertyName === profile.name || dispute.raisedBy === profile.name) &&
                  dispute.status !== 'Resolved' &&
                  dispute.status !== 'Rejected'
                ).length
                }
                </dd>
              </div>
            </dl>
          </div> :
        null}
      </Modal>

      <ReasonDialog
        open={Boolean(investigating)}
        onClose={() => setInvestigating(null)}
        title={`Open investigation — ${investigating?.name ?? ''}`}
        description="Creates an investigation case, freezes automated payouts for the entity, and notifies the risk desk."
        reasons={['Manual review of booking pattern', 'Payment forensics required', 'Partner explanation requested']}
        confirmLabel="Create case"
        onConfirm={(reason) => {
          if (!investigating) return;
          run(
            { type: 'risk.setStatus', id: investigating.id, status: 'Investigating', note: reason },
            { permission: 'Risk & Fraud', success: `Investigation opened for ${investigating.name}` }
          );
        }} />
      

      <ReasonDialog
        open={Boolean(blocking)}
        onClose={() => setBlocking(null)}
        title={`${blocking?.type === 'Hotel' ? 'Suspend' : 'Block'} ${blocking?.name ?? ''}`}
        description="This cancels open bookings, freezes refunds, and blocks linked devices from signing in."
        reasons={['Confirmed fraudulent activity', 'Chargeback ring', 'Repeated policy violation']}
        confirmLabel="Confirm block"
        danger
        onConfirm={(reason) => {
          if (!blocking) return;
          run(
            { type: 'risk.setStatus', id: blocking.id, status: 'Blocked', note: reason },
            { permission: 'Risk & Fraud', success: `${blocking.name} blocked` }
          );
        }} />
      
    </div>);

}