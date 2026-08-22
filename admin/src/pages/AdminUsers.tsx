import React, { useState } from 'react';
import { ShieldCheckIcon, UserPlusIcon } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input, Label, Select } from '../components/ui/Field';
import { SegmentedControl } from '../components/ui/Tabs';
import { DataTable, type Column } from '../components/ui/DataTable';
import { NameCell, RowActions } from '../components/ui/Cells';
import { Modal } from '../components/ui/Modal';
import { TableSkeleton, ErrorState } from '../components/ui/LoadingState';
import { useMockQuery } from '../hooks/useMockQuery';
import { api } from '../services/api';
import { permissionModules, rolePermissions } from '../data/governance';
import { cn } from '../utils/cn';
import type { AdminUser, AdminRole } from '../types';

const roles: AdminRole[] = [
'Super Admin',
'Operations Admin',
'Finance Admin',
'Support Admin',
'Marketing Admin'];


const accessTone: Record<string, string> = {
  Full: 'bg-accent/25 text-ink',
  Edit: 'bg-info/10 text-info',
  View: 'bg-faint text-muted',
  None: 'text-muted/50'
};

export function AdminUsers() {
  const { data, loading, error } = useMockQuery(api.getAdminUsers, []);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [role, setRole] = useState<AdminRole>('Operations Admin');

  const users = data ?? [];

  const columns: Column<AdminUser>[] = [
  {
    key: 'name',
    header: 'Admin',
    render: (row) => <NameCell primary={row.name} secondary={row.email} />,
    sortValue: (row) => row.name
  },
  { key: 'role', header: 'Role', render: (row) => <Badge tone="neutral">{row.role}</Badge>, sortValue: (row) => row.role },
  {
    key: 'twoFactor',
    header: '2FA',
    render: (row) =>
    row.twoFactor ?
    <Badge tone="positive">Enabled</Badge> :

    <Badge tone="warning">Not set up</Badge>,

    sortValue: (row) => String(row.twoFactor),
    hideBelow: 'md'
  },
  {
    key: 'lastActive',
    header: 'Last active',
    render: (row) => <span className="text-[13px] text-muted">{row.lastActive}</span>,
    sortValue: (row) => row.lastActive,
    hideBelow: 'lg'
  },
  { key: 'status', header: 'Status', render: (row) => <Badge>{row.status}</Badge>, sortValue: (row) => row.status },
  {
    key: 'actions',
    header: '',
    align: 'right',
    render: (row) =>
    <RowActions
      actions={[
      { label: 'Change role', onSelect: () => api.mutate('admin.changeRole', { id: row.id }) },
      { label: 'Reset password', onSelect: () => api.mutate('admin.resetPassword', { id: row.id }) },
      { label: 'Force 2FA setup', onSelect: () => api.mutate('admin.force2fa', { id: row.id }) },
      { label: 'Disable account', danger: true, onSelect: () => api.mutate('admin.disable', { id: row.id }) }]
      } />


  }];


  return (
    <div>
      <PageHeader
        title="Admin users"
        subtitle="Internal accounts and what each role can reach across the console."
        actions={
        <Button variant="primary" icon={UserPlusIcon} onClick={() => setInviteOpen(true)}>
            Invite admin
          </Button>
        } />
      

      <Card>
        <CardHeader title="Team" subtitle={`${users.length} accounts · 2FA required for Finance and Super Admin`} />
        {loading ?
        <TableSkeleton rows={7} /> :
        error ?
        <ErrorState message={error} /> :

        <DataTable columns={columns} rows={users} rowKey={(row) => row.id} pageSize={8} />
        }
      </Card>

      <Card className="mt-4">
        <CardHeader
          title="Role permissions"
          subtitle="What this role can do in every module"
          action={<SegmentedControl options={roles} value={role} onChange={(next) => setRole(next as AdminRole)} />} />
        
        <div className="px-5 py-5">
          <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-line bg-faint px-4 py-3">
            <ShieldCheckIcon className="h-4 w-4 text-muted" />
            <p className="text-[13px] text-muted">
              Changes to role permissions apply immediately to every admin holding that role and are written to the
              audit log.
            </p>
          </div>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {permissionModules.map((module) => {
              const access = rolePermissions[role][module];
              return (
                <li
                  key={module}
                  className="flex items-center justify-between gap-2 rounded-lg border border-line px-3 py-2.5">
                  
                  <span className="truncate text-[13px] font-medium text-ink">{module}</span>
                  <span
                    className={cn(
                      'shrink-0 rounded-md px-1.5 py-0.5 text-xs font-semibold',
                      accessTone[access]
                    )}>
                    
                    {access}
                  </span>
                </li>);

            })}
          </ul>
        </div>
      </Card>

      <Modal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Invite admin"
        description="The invite expires in 48 hours and requires 2FA setup on first sign-in."
        footer={
        <>
            <Button onClick={() => setInviteOpen(false)}>Cancel</Button>
            <Button
            variant="primary"
            onClick={() => {
              api.mutate('admin.invite');
              setInviteOpen(false);
            }}>
            
              Send invite
            </Button>
          </>
        }>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="admin-name">Full name</Label>
            <Input id="admin-name" placeholder="Priya Rangan" />
          </div>
          <div>
            <Label htmlFor="admin-email">Work email</Label>
            <Input id="admin-email" type="email" placeholder="priya@checkdin.in" />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="admin-role">Role</Label>
            <Select id="admin-role" options={roles} />
          </div>
        </div>
      </Modal>
    </div>);

}