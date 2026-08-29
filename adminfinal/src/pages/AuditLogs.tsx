import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DownloadIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { PageHeader, Toolbar } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { SearchInput, Select } from '../components/ui/Field';
import { Tabs } from '../components/ui/Tabs';
import { DataTable, type Column } from '../components/ui/DataTable';
import { NameCell, MonoCell, StackedCell } from '../components/ui/Cells';
import { TableSkeleton, ErrorState } from '../components/ui/LoadingState';
import { useMockQuery } from '../hooks/useMockQuery';
import { api } from '../services/api';
import type { AuditLog } from '../types';

const tabs = ['All', 'Login', 'Booking', 'Property', 'Refund', 'Payout', 'Settings'];
const roles = ['All roles', 'Super Admin', 'Operations Admin', 'Finance Admin', 'Support Admin', 'Marketing Admin'];

export function AuditLogs() {
  const { data, loading, error } = useMockQuery(api.getAuditLogs, []);
  const [params] = useSearchParams();
  const [tab, setTab] = useState(params.get('category') ?? 'All');
  const [role, setRole] = useState(params.get('role') ?? 'All roles');
  const [query, setQuery] = useState(params.get('q') ?? '');

  const logs = data ?? [];

  const counts = useMemo(() => {
    const result: Record<string, number> = { All: logs.length };
    tabs.slice(1).forEach((category) => {
      result[category] = logs.filter((log) => log.category === category).length;
    });
    return result;
  }, [logs]);

  const rows = useMemo(
    () =>
    logs.filter((log) => {
      if (tab !== 'All' && log.category !== tab) return false;
      if (role !== 'All roles' && log.role !== role) return false;
      if (!query) return true;
      const needle = query.toLowerCase();
      return (
        log.actor.toLowerCase().includes(needle) ||
        log.action.toLowerCase().includes(needle) ||
        log.target.toLowerCase().includes(needle) ||
        log.ip.includes(needle));

    }),
    [logs, tab, role, query]
  );

  const columns: Column<AuditLog>[] = [
  {
    key: 'actor',
    header: 'Actor',
    render: (row) => <NameCell primary={row.actor} secondary={row.role} />,
    sortValue: (row) => row.actor
  },
  {
    key: 'action',
    header: 'Action',
    render: (row) => <StackedCell primary={row.action} secondary={row.target} />,
    sortValue: (row) => row.action
  },
  {
    key: 'category',
    header: 'Category',
    render: (row) => <Badge tone="neutral">{row.category}</Badge>,
    sortValue: (row) => row.category,
    hideBelow: 'md'
  },
  { key: 'ip', header: 'IP address', render: (row) => <MonoCell>{row.ip}</MonoCell>, sortValue: (row) => row.ip, hideBelow: 'lg' },
  {
    key: 'at',
    header: 'Timestamp',
    align: 'right',
    render: (row) => <span className="text-[13px] text-muted">{row.at}</span>,
    sortValue: (row) => row.at
  }];


  return (
    <div>
      <PageHeader
        title="Audit logs"
        subtitle="Immutable record of admin activity — logins, approvals, and money movement."
        actions={<Button icon={DownloadIcon}>Export log</Button>} />
      

      <Card>
        <Tabs tabs={tabs} value={tab} onChange={setTab} counts={counts} />
        <Toolbar>
          <SearchInput
            className="sm:max-w-xs sm:flex-1"
            placeholder="Search actor, action, target, IP…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search audit logs" />
          
          <div className="sm:ml-auto">
            <Select options={roles} value={role} onChange={(event) => setRole(event.target.value)} aria-label="Filter by role" />
          </div>
        </Toolbar>
        {loading ?
        <TableSkeleton rows={10} /> :
        error ?
        <ErrorState message={error} /> :

        <DataTable columns={columns} rows={rows} rowKey={(row) => row.id} pageSize={12} emptyLabel="No log entries match these filters" />
        }
      </Card>
    </div>);

}