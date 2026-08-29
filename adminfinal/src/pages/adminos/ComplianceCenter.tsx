import React, { useMemo, useState } from 'react';
import { CheckIcon, FileWarningIcon, XIcon } from 'lucide-react';
import { Card, CardHeader } from '../../components/ui/Card';
import { PageHeader, Toolbar } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Label, SearchInput, Select } from '../../components/ui/Field';
import { Tabs } from '../../components/ui/Tabs';
import { Modal } from '../../components/ui/Modal';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { NameCell, RowActions } from '../../components/ui/Cells';
import { MetricTile, ExportMenu, ReasonDialog } from '../../components/adminos/OsPrimitives';
import { useAdminOs } from '../../contexts/AdminOsContext';
import type { ComplianceRecordLive } from '../../services/adminos/store';
import type { ComplianceRecord, VerificationState } from '../../data/adminos/governance';
import { cn } from '../../utils/cn';

const tabs = ['All', 'Onboarding', 'Live', 'Suspended'];
const checks: {key: keyof ComplianceRecord;label: string;}[] = [
{ key: 'kyc', label: 'KYC' },
{ key: 'gst', label: 'GST' },
{ key: 'bank', label: 'Bank' },
{ key: 'property', label: 'Property' },
{ key: 'agreement', label: 'Agreement' }];


const documents = ['KYC proof', 'GST certificate', 'Cancelled cheque', 'Fire NOC', 'Signed agreement'];

function VerificationChip({ state }: {state: VerificationState;}) {
  const map: Record<VerificationState, string> = {
    Verified: 'border-positive/30 bg-positive/10 text-positive',
    Pending: 'border-warning/30 bg-warning/10 text-warning',
    Rejected: 'border-negative/30 bg-negative/10 text-negative',
    'Not submitted': 'border-line bg-faint text-muted'
  };
  const short: Record<VerificationState, string> = {
    Verified: '✓',
    Pending: '…',
    Rejected: '✕',
    'Not submitted': '–'
  };
  return (
    <span
      title={state}
      className={cn('inline-flex h-6 w-6 items-center justify-center rounded-md border text-xs font-bold', map[state])}>
      
      {short[state]}
    </span>);

}

export function ComplianceCenter() {
  const { state, run } = useAdminOs();
  const [tab, setTab] = useState('All');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All checks');
  const [requesting, setRequesting] = useState<ComplianceRecordLive | null>(null);
  const [document, setDocument] = useState(documents[0]);
  const [reviewing, setReviewing] = useState<ComplianceRecordLive | null>(null);
  const [rejecting, setRejecting] = useState<{record: ComplianceRecordLive;check: keyof ComplianceRecord;} | null>(null);
  const [suspending, setSuspending] = useState<ComplianceRecordLive | null>(null);

  const records = state.compliance;

  const counts = useMemo(() => {
    const result: Record<string, number> = { All: records.length };
    tabs.slice(1).forEach((stage) => {
      result[stage] = records.filter((record) => record.stage === stage).length;
    });
    return result;
  }, [records]);

  const rows = useMemo(
    () =>
    records.filter((record) => {
      if (tab !== 'All' && record.stage !== tab) return false;
      if (filter === 'Incomplete only' && checks.every((check) => record[check.key] === 'Verified')) return false;
      if (filter === 'Rejected documents' && !checks.some((check) => record[check.key] === 'Rejected')) return false;
      if (!query) return true;
      const needle = query.toLowerCase();
      return (
        record.propertyName.toLowerCase().includes(needle) ||
        record.partnerName.toLowerCase().includes(needle) ||
        record.city.toLowerCase().includes(needle));

    }),
    [records, tab, filter, query]
  );

  const fullyVerified = records.filter((record) => checks.every((check) => record[check.key] === 'Verified')).length;
  const blocked = records.filter((record) => checks.some((check) => record[check.key] === 'Rejected')).length;
  const awaiting = records.filter((record) =>
  checks.some((check) => record[check.key] === 'Pending' || record[check.key] === 'Not submitted')
  ).length;

  const columns: Column<ComplianceRecordLive>[] = [
  {
    key: 'hotel',
    header: 'Hotel',
    render: (row) => <NameCell primary={row.propertyName} secondary={`${row.city} · ${row.partnerName}`} />,
    sortValue: (row) => row.propertyName
  },
  ...checks.map((check) => ({
    key: check.key as string,
    header: check.label,
    render: (row: ComplianceRecordLive) => <VerificationChip state={row[check.key] as VerificationState} />,
    sortValue: (row: ComplianceRecordLive) => String(row[check.key]),
    hideBelow: (check.key === 'kyc' ? undefined : check.key === 'gst' ? 'sm' : check.key === 'bank' ? 'md' : 'lg') as
    'sm' |
    'md' |
    'lg' |
    undefined
  })),
  { key: 'stage', header: 'Stage', render: (row) => <Badge>{row.stage === 'Live' ? 'Active' : row.stage}</Badge>, sortValue: (row) => row.stage },
  {
    key: 'actions',
    header: '',
    align: 'right',
    render: (row) =>
    <div className="flex items-center justify-end gap-1.5">
          <Button size="sm" onClick={() => setReviewing(row)}>
            Review
          </Button>
          <RowActions
        actions={[
        {
          label: 'Approve hotel',
          onSelect: () =>
          run(
            { type: 'compliance.setStage', propertyId: row.propertyId, stage: 'Live', reason: 'All verifications cleared' },
            { permission: 'Compliance', success: `${row.propertyName} approved` }
          )
        },
        { label: 'Request documents', onSelect: () => setRequesting(row) },
        { label: 'Suspend hotel', onSelect: () => setSuspending(row) },
        {
          label: 'Reject hotel',
          danger: true,
          onSelect: () =>
          run(
            { type: 'compliance.setStage', propertyId: row.propertyId, stage: 'Onboarding', reason: 'Application rejected' },
            { permission: 'Compliance', success: `${row.propertyName} returned to onboarding` }
          )
        }]
        } />
      
        </div>

  }];


  return (
    <div>
      <PageHeader
        title="Onboarding & compliance"
        subtitle="KYC, GST, bank, property, and agreement verification for every hotel on the marketplace."
        actions={
        <ExportMenu
          title="Compliance register"
          entity="Compliance"
          rows={rows}
          columns={[
          { header: 'Hotel', value: (row: ComplianceRecordLive) => row.propertyName },
          { header: 'City', value: (row: ComplianceRecordLive) => row.city },
          { header: 'Partner', value: (row: ComplianceRecordLive) => row.partnerName },
          { header: 'KYC', value: (row: ComplianceRecordLive) => row.kyc },
          { header: 'GST', value: (row: ComplianceRecordLive) => row.gst },
          { header: 'Bank', value: (row: ComplianceRecordLive) => row.bank },
          { header: 'Property', value: (row: ComplianceRecordLive) => row.property },
          { header: 'Agreement', value: (row: ComplianceRecordLive) => row.agreement },
          { header: 'Stage', value: (row: ComplianceRecordLive) => row.stage },
          { header: 'Open document requests', value: (row: ComplianceRecordLive) => row.requestedDocuments.join(' | ') }]
          } />

        } />
      

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <MetricTile label="Fully verified" value={String(fullyVerified)} hint="all five checks cleared" tone="positive" onClick={() => setFilter('All checks')} />
        <MetricTile label="Awaiting documents" value={String(awaiting)} hint="pending or not submitted" tone="warning" onClick={() => setFilter('Incomplete only')} />
        <MetricTile label="Rejected documents" value={String(blocked)} hint="blocking go-live" tone="negative" onClick={() => setFilter('Rejected documents')} />
        <MetricTile label="In onboarding" value={String(counts.Onboarding ?? 0)} hint="not yet live" tone="accent" onClick={() => setTab('Onboarding')} />
      </div>

      <Card className="mt-4">
        <Tabs tabs={tabs} value={tab} onChange={setTab} counts={counts} />
        <Toolbar>
          <SearchInput
            className="sm:max-w-xs sm:flex-1"
            placeholder="Search hotel, partner, city…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search compliance records" />
          
          <div className="sm:ml-auto">
            <Select
              options={['All checks', 'Incomplete only', 'Rejected documents']}
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              aria-label="Filter by verification state" />
            
          </div>
        </Toolbar>
        <DataTable columns={columns} rows={rows} rowKey={(row) => row.propertyId} pageSize={10} emptyLabel="No hotels match these filters" />
        <div className="flex flex-wrap items-center gap-3 border-t border-line px-5 py-3 text-xs text-muted">
          <span className="font-medium">Legend</span>
          {(['Verified', 'Pending', 'Rejected', 'Not submitted'] as VerificationState[]).map((verification) =>
          <span key={verification} className="flex items-center gap-1.5">
              <VerificationChip state={verification} />
              {verification}
            </span>
          )}
        </div>
      </Card>

      <Card className="mt-4">
        <CardHeader title="Go-live requirements" subtitle="A hotel cannot accept bookings until all five clear" />
        <ul className="divide-y divide-line">
          {[
          { label: 'KYC status', detail: 'Partner identity and address proof verified against the PAN record.' },
          { label: 'GST verification', detail: 'GSTIN validated with the tax portal and matched to the legal entity.' },
          { label: 'Bank verification', detail: 'Penny-drop confirmation on the settlement account.' },
          { label: 'Property verification', detail: 'Trade licence, fire NOC, and on-site photo audit.' },
          { label: 'Agreement status', detail: 'Signed commercial agreement with the current commission schedule.' }].
          map((item) =>
          <li key={item.label} className="flex items-start gap-3 px-5 py-3.5">
              <FileWarningIcon className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
              <div>
                <p className="text-[13px] font-semibold text-ink">{item.label}</p>
                <p className="text-xs text-muted">{item.detail}</p>
              </div>
            </li>
          )}
        </ul>
      </Card>

      <Modal
        open={Boolean(reviewing)}
        onClose={() => setReviewing(null)}
        title={`Verification review — ${reviewing?.propertyName ?? ''}`}
        description="Approve or reject each check individually. The partner is notified on every decision."
        footer={<Button onClick={() => setReviewing(null)}>Done</Button>}>
        
        {reviewing ?
        <div className="space-y-4">
            <ul className="divide-y divide-line rounded-xl border border-line">
              {checks.map((check) => {
              const current = state.compliance.find((row) => row.propertyId === reviewing.propertyId);
              const value = (current?.[check.key] ?? reviewing[check.key]) as VerificationState;
              return (
                <li key={String(check.key)} className="flex flex-wrap items-center gap-3 px-4 py-3">
                    <VerificationChip state={value} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold text-ink">{check.label}</p>
                      <p className="text-xs text-muted">{value}</p>
                    </div>
                    <Button
                    size="sm"
                    variant="primary"
                    icon={CheckIcon}
                    disabled={value === 'Verified'}
                    onClick={() =>
                    run(
                      {
                        type: 'compliance.setCheck',
                        propertyId: reviewing.propertyId,
                        check: check.key,
                        state: 'Verified',
                        reason: 'Document verified against the source record'
                      },
                      { permission: 'Compliance', success: `${check.label} approved` }
                    )
                    }>
                    
                      Approve
                    </Button>
                    <Button
                    size="sm"
                    variant="danger"
                    icon={XIcon}
                    onClick={() => setRejecting({ record: reviewing, check: check.key })}>
                    
                      Reject
                    </Button>
                  </li>);

            })}
            </ul>
            {reviewing.notes.length ?
          <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Review notes</p>
                <ul className="mt-1.5 space-y-1">
                  {state.compliance.
              find((row) => row.propertyId === reviewing.propertyId)?.
              notes.map((note) =>
              <li key={note} className="text-xs text-muted">
                        {note}
                      </li>
              )}
                </ul>
              </div> :
          null}
          </div> :
        null}
      </Modal>

      <ReasonDialog
        open={Boolean(rejecting)}
        onClose={() => setRejecting(null)}
        title={`Reject ${rejecting ? String(rejecting.check).toUpperCase() : ''}`}
        description="The rejection reason is sent to the partner and stored against the property record."
        reasons={[
        'Document is illegible',
        'Name does not match the PAN record',
        'Certificate has expired',
        'Bank account belongs to a different entity']
        }
        confirmLabel="Reject document"
        danger
        onConfirm={(reason) => {
          if (!rejecting) return;
          run(
            {
              type: 'compliance.setCheck',
              propertyId: rejecting.record.propertyId,
              check: rejecting.check,
              state: 'Rejected',
              reason
            },
            { permission: 'Compliance', success: 'Document rejected and partner notified' }
          );
        }} />
      

      <ReasonDialog
        open={Boolean(requesting)}
        onClose={() => setRequesting(null)}
        title={`Request documents — ${requesting?.propertyName ?? ''}`}
        description="The partner receives an email and a PartnerOS task with your checklist."
        confirmLabel="Send request"
        onConfirm={(note) => {
          if (!requesting) return;
          run(
            { type: 'compliance.requestDocuments', propertyId: requesting.propertyId, documents: document, note },
            { permission: 'Compliance', success: `${document} requested from ${requesting.partnerName}` }
          );
        }}>
        
        <div>
          <Label htmlFor="doc-type">Documents required</Label>
          <Select id="doc-type" options={documents} value={document} onChange={(event) => setDocument(event.target.value)} />
        </div>
      </ReasonDialog>

      <ReasonDialog
        open={Boolean(suspending)}
        onClose={() => setSuspending(null)}
        title={`Suspend ${suspending?.propertyName ?? ''}`}
        description="Suspension restricts platform access and takes the listing offline immediately."
        reasons={['Fire NOC expired', 'Trade licence lapsed', 'Failed on-site audit', 'Unverified bank account']}
        confirmLabel="Suspend hotel"
        danger
        onConfirm={(reason) => {
          if (!suspending) return;
          run(
            { type: 'compliance.setStage', propertyId: suspending.propertyId, stage: 'Suspended', reason },
            { permission: 'Compliance', success: `${suspending.propertyName} suspended and taken offline` }
          );
        }} />
      
    </div>);

}