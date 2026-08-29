import React, { useState } from 'react';
import { DownloadIcon, IndianRupeeIcon, PercentIcon, ReceiptIndianRupeeIcon, WalletIcon } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { SegmentedControl } from '../components/ui/Tabs';
import { KpiCard } from '../components/dashboard/KpiCard';
import { DataTable, type Column } from '../components/ui/DataTable';
import { StackedCell } from '../components/ui/Cells';
import { ProgressBar } from '../components/ui/Primitives';
import { DonutChart, RevenueBreakdownChart } from '../components/charts/Charts';
import { dailyRevenue, monthlyRevenue, revenueSummary, weeklyRevenue } from '../data/finance';
import { channelSplit } from '../data/analytics';
import { properties } from '../data/properties';
import { formatCurrency } from '../utils/format';
import type { Property } from '../types';

const grains = ['Daily', 'Weekly', 'Monthly'];

export function Revenue() {
  const [grain, setGrain] = useState('Monthly');
  const series = grain === 'Daily' ? dailyRevenue : grain === 'Weekly' ? weeklyRevenue : monthlyRevenue;

  const columns: Column<Property>[] = [
  {
    key: 'property',
    header: 'Property',
    render: (row) => <StackedCell primary={row.name} secondary={`${row.city} · ${row.partnerName}`} />,
    sortValue: (row) => row.name
  },
  {
    key: 'gross',
    header: 'Gross',
    align: 'right',
    render: (row) => <span className="tabular-nums">{formatCurrency(row.revenue, true)}</span>,
    sortValue: (row) => row.revenue
  },
  {
    key: 'commission',
    header: 'Commission',
    align: 'right',
    render: (row) => <span className="tabular-nums text-muted">{formatCurrency(Math.round(row.revenue * 0.12), true)}</span>,
    sortValue: (row) => row.revenue * 0.12,
    hideBelow: 'sm'
  },
  {
    key: 'net',
    header: 'Net to partner',
    align: 'right',
    render: (row) =>
    <span className="font-semibold tabular-nums text-ink">{formatCurrency(Math.round(row.revenue * 0.88), true)}</span>,

    sortValue: (row) => row.revenue * 0.88
  },
  {
    key: 'occupancy',
    header: 'Occupancy',
    render: (row) => <ProgressBar value={row.occupancy} />,
    sortValue: (row) => row.occupancy,
    className: 'w-40',
    hideBelow: 'lg'
  }];


  return (
    <div>
      <PageHeader
        title="Revenue"
        subtitle="Gross booking value, commission earned, and tax collected across the platform."
        actions={<Button icon={DownloadIcon}>Export ledger</Button>} />
      

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Gross revenue"
          value={formatCurrency(revenueSummary.gross, true)}
          delta={revenueSummary.grossChange}
          hint="month to date"
          icon={IndianRupeeIcon}
          featured />
        
        <KpiCard
          label="Net revenue"
          value={formatCurrency(revenueSummary.net, true)}
          delta={revenueSummary.netChange}
          hint="after partner settlement"
          icon={WalletIcon} />
        
        <KpiCard
          label="Commission earned"
          value={formatCurrency(revenueSummary.commission, true)}
          delta={revenueSummary.commissionChange}
          hint="avg 12.4% take rate"
          icon={PercentIcon} />
        
        <KpiCard
          label="Taxes collected"
          value={formatCurrency(revenueSummary.taxes, true)}
          delta={revenueSummary.taxChange}
          hint="GST payable"
          icon={ReceiptIndianRupeeIcon} />
        
      </div>

      <Card className="mt-4">
        <CardHeader
          title="Revenue breakdown"
          subtitle="Gross, net, and commission over time"
          action={<SegmentedControl options={grains} value={grain} onChange={setGrain} />} />
        
        <div className="px-2 py-5">
          <RevenueBreakdownChart data={series} height={300} />
        </div>
      </Card>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Revenue by property" subtitle="Lifetime gross value and partner settlement" />
          <DataTable columns={columns} rows={properties} rowKey={(row) => row.id} pageSize={7} />
        </Card>
        <Card>
          <CardHeader title="Revenue by channel" subtitle="Share of gross booking value" />
          <div className="px-5 py-5">
            <DonutChart data={channelSplit} height={196} />
          </div>
        </Card>
      </div>
    </div>);

}