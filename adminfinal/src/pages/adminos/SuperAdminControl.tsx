import React, { useState } from 'react';
import { AlertTriangleIcon, LockIcon, ShieldCheckIcon } from 'lucide-react';
import { Card, CardHeader } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input, Label, Select, Textarea } from '../../components/ui/Field';
import { Modal } from '../../components/ui/Modal';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { MonoCell, StackedCell } from '../../components/ui/Cells';
import { EmptyState } from '../../components/ui/Primitives';
import { ExportMenu } from '../../components/adminos/OsPrimitives';
import { controlActions, partnerNames, type ControlAction } from '../../data/adminos/governance';
import { properties } from '../../data/properties';
import { useAuth } from '../../contexts/AuthContext';
import { useAdminOs } from '../../contexts/AdminOsContext';
import type { OsAuditRecord } from '../../services/adminos/store';
import { cn } from '../../utils/cn';

const targets = [...properties.map((property) => `${property.name} — ${property.city}`), ...partnerNames];

export function SuperAdminControl() {
  const { user } = useAuth();
  const { state, run } = useAdminOs();
  const isSuperAdmin = user?.roleId === 'super';

  const [pending, setPending] = useState<ControlAction | null>(null);
  const [confirmText, setConfirmText] = useState('');
  const [reason, setReason] = useState('');
  const [target, setTarget] = useState(targets[0]);

  const columns: Column<OsAuditRecord>[] = [
  {
    key: 'action',
    header: 'Action',
    render: (row) => <StackedCell primary={row.action} secondary={row.entityLabel} />,
    sortValue: (row) => row.action
  },
  {
    key: 'change',
    header: 'State change',
    render: (row) =>
    <span className="text-[13px] text-muted">
          {row.previousState} → <span className="text-ink">{row.newState}</span>
        </span>,

    hideBelow: 'lg'
  },
  {
    key: 'reason',
    header: 'Reason',
    render: (row) => <span className="text-[13px] text-muted">{row.reason}</span>,
    hideBelow: 'xl'
  },
  {
    key: 'by',
    header: 'Performed by',
    render: (row) => <StackedCell primary={row.adminName} secondary={row.role} />,
    sortValue: (row) => row.adminName,
    hideBelow: 'md'
  },
  { key: 'ip', header: 'IP', render: (row) => <MonoCell>{row.ip}</MonoCell>, hideBelow: 'xl' },
  {
    key: 'at',
    header: 'When',
    align: 'right',
    render: (row) => <span className="text-[13px] text-muted">{row.at}</span>,
    sortValue: (row) => row.iso
  }];


  const overrideLog = state.audit.filter((row) => row.entityType === 'Platform override');

  function execute() {
    if (!pending || confirmText !== 'CONFIRM' || reason.trim().length < 8) return;
    const ok = run(
      { type: 'super.execute', actionId: pending.id, label: pending.label, target, reason: reason.trim() },
      { permission: 'Control Center', success: `${pending.label} executed` }
    );
    if (ok) {
      setPending(null);
      setConfirmText('');
      setReason('');
    }
  }

  if (!isSuperAdmin) {
    return (
      <div>
        <PageHeader title="Super Admin control center" subtitle="Restricted platform overrides." />
        <Card>
          <EmptyState
            icon={LockIcon}
            title="Super Admin access required"
            description="These controls can force hotels offline, freeze payouts, and push manual refunds. Only the Super Admin role can open them." />
          
        </Card>
      </div>);

  }

  return (
    <div>
      <PageHeader
        title="Super Admin control center"
        subtitle="Platform overrides that bypass normal workflow. Every action needs a written reason and typed confirmation."
        actions={
        <ExportMenu
          title="Override audit log"
          entity="Audit"
          rows={state.audit}
          columns={[
          { header: 'Timestamp', value: (row: OsAuditRecord) => row.at },
          { header: 'Admin', value: (row: OsAuditRecord) => row.adminName },
          { header: 'Email', value: (row: OsAuditRecord) => row.adminEmail },
          { header: 'Role', value: (row: OsAuditRecord) => row.role },
          { header: 'Action', value: (row: OsAuditRecord) => row.action },
          { header: 'Entity type', value: (row: OsAuditRecord) => row.entityType },
          { header: 'Entity ID', value: (row: OsAuditRecord) => row.entityId },
          { header: 'Entity', value: (row: OsAuditRecord) => row.entityLabel },
          { header: 'Previous state', value: (row: OsAuditRecord) => row.previousState },
          { header: 'New state', value: (row: OsAuditRecord) => row.newState },
          { header: 'Reason', value: (row: OsAuditRecord) => row.reason },
          { header: 'IP address', value: (row: OsAuditRecord) => row.ip }]
          }
          label="Export audit log" />

        } />
      

      <Card className="mb-4 border-negative/40 bg-negative/[0.05]">
        <div className="flex flex-wrap items-start gap-3 px-5 py-4">
          <AlertTriangleIcon className="mt-0.5 h-4 w-4 shrink-0 text-negative" />
          <p className="min-w-0 flex-1 text-[13px] leading-relaxed text-muted">
            These actions take effect immediately across the Customer Platform and PartnerOS. Each one records your
            name, role, IP address, the previous and new state, and your written reason. Reversing an override requires
            a second override.
          </p>
          <Badge tone="negative">Sensitive</Badge>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {controlActions.map((action) =>
        <Card key={action.id} className={cn('flex flex-col p-5', action.tone === 'danger' && 'border-negative/30')}>
            <p className="text-[13px] font-semibold text-ink">{action.label}</p>
            <p className="mt-1 flex-1 text-xs leading-relaxed text-muted">{action.description}</p>
            <Button
            size="sm"
            variant={action.tone === 'danger' ? 'danger' : 'outline'}
            className="mt-4 w-full"
            onClick={() => {
              setPending(action);
              setConfirmText('');
              setReason('');
            }}>
            
              {action.label}
            </Button>
          </Card>
        )}
      </div>

      <Card className="mt-4">
        <CardHeader
          title="Override audit log"
          subtitle={`${overrideLog.length} platform overrides recorded`}
          action={<ShieldCheckIcon className="h-4 w-4 text-muted" />} />
        
        {overrideLog.length ?
        <DataTable columns={columns} rows={overrideLog} rowKey={(row) => row.id} pageSize={8} /> :

        <EmptyState
          icon={ShieldCheckIcon}
          title="No overrides executed"
          description="Platform overrides appear here the moment one is executed, with the full before-and-after state." />

        }
      </Card>

      <Card className="mt-4">
        <CardHeader title="Full AdminOS audit trail" subtitle="Every action across every module, newest first" />
        {state.audit.length ?
        <DataTable columns={columns} rows={state.audit} rowKey={(row) => row.id} pageSize={12} /> :

        <EmptyState
          icon={ShieldCheckIcon}
          title="Audit trail is empty"
          description="Approve an extension, release a settlement, or change a hotel's visibility and the record appears here." />

        }
      </Card>

      <Modal
        open={Boolean(pending)}
        onClose={() => setPending(null)}
        title={pending?.label ?? ''}
        description={pending?.confirm}
        footer={
        <>
            <Button onClick={() => setPending(null)}>Cancel</Button>
            <Button
            variant="danger"
            disabled={confirmText !== 'CONFIRM' || reason.trim().length < 8}
            onClick={execute}>
            
              Execute action
            </Button>
          </>
        }>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="control-target">Target</Label>
            <Select
              id="control-target"
              options={targets}
              value={target}
              onChange={(event) => setTarget(event.target.value)} />
            
          </div>
          <div>
            <Label htmlFor="control-reason">Written reason (required)</Label>
            <Textarea
              id="control-reason"
              rows={3}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Fire NOC expired on 31 Jul and the partner has not responded in 9 days." />
            
            {reason.trim().length < 8 ?
            <p className="mt-1.5 text-xs text-muted">At least a short sentence is required.</p> :
            null}
          </div>
          <div>
            <Label htmlFor="control-confirm">Type CONFIRM to enable the action</Label>
            <Input
              id="control-confirm"
              value={confirmText}
              onChange={(event) => setConfirmText(event.target.value)}
              placeholder="CONFIRM" />
            
          </div>
        </div>
      </Modal>
    </div>);

}