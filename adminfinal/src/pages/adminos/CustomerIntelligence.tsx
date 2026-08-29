import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { SegmentedControl } from '../../components/ui/Tabs';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { MetricTile, ScoreBar, ExportMenu } from '../../components/adminos/OsPrimitives';
import { DonutChart } from '../../components/charts/Charts';
import { customerHeadline, customerSegments, type CustomerSegment } from '../../data/adminos/intelligence';
import { formatCurrency, formatNumber } from '../../utils/format';

const metrics = ['Repeat rate', 'Lifetime value', 'Retention', 'Average spend'] as const;

export function CustomerIntelligence() {
  const [metric, setMetric] = useState<(typeof metrics)[number]>('Repeat rate');

  const valueFor = (segment: CustomerSegment) => {
    if (metric === 'Repeat rate') return { display: `${segment.repeatRate}%`, score: segment.repeatRate };
    if (metric === 'Lifetime value') return { display: formatCurrency(segment.ltv), score: Math.round(segment.ltv / 30000 * 100) };
    if (metric === 'Retention') return { display: `${segment.retention}%`, score: segment.retention };
    return { display: formatCurrency(segment.avgSpend), score: Math.round(segment.avgSpend / 4500 * 100) };
  };

  const columns: Column<CustomerSegment>[] = [
  {
    key: 'name',
    header: 'Segment',
    render: (row) =>
    <div>
          <p className="text-[13px] font-semibold text-ink">{row.name}</p>
          <p className="text-xs text-muted">{row.share}% of bookings</p>
        </div>,

    sortValue: (row) => row.name
  },
  {
    key: 'customers',
    header: 'Customers',
    align: 'right',
    render: (row) => <span className="tabular-nums text-[13px]">{formatNumber(row.customers)}</span>,
    sortValue: (row) => row.customers
  },
  {
    key: 'repeat',
    header: 'Repeat rate',
    align: 'right',
    render: (row) => <span className="tabular-nums text-[13px]">{row.repeatRate}%</span>,
    sortValue: (row) => row.repeatRate,
    hideBelow: 'sm'
  },
  {
    key: 'ltv',
    header: 'Lifetime value',
    align: 'right',
    render: (row) => <span className="font-semibold tabular-nums text-[13px]">{formatCurrency(row.ltv)}</span>,
    sortValue: (row) => row.ltv
  },
  {
    key: 'retention',
    header: 'Retention',
    align: 'right',
    render: (row) => <span className="tabular-nums text-[13px]">{row.retention}%</span>,
    sortValue: (row) => row.retention,
    hideBelow: 'lg'
  },
  {
    key: 'spend',
    header: 'Avg spend',
    align: 'right',
    render: (row) => <span className="tabular-nums text-[13px]">{formatCurrency(row.avgSpend)}</span>,
    sortValue: (row) => row.avgSpend,
    hideBelow: 'md'
  }];


  return (
    <div>
      <PageHeader
        title="Customer intelligence"
        subtitle="Who books on Checkdin, how often they come back, and what they are worth."
        actions={
        <ExportMenu
          title="Customer segments"
          entity="Customer segment"
          rows={customerSegments}
          columns={[
          { header: 'Segment', value: (row: CustomerSegment) => row.name },
          { header: 'Share %', value: (row: CustomerSegment) => row.share },
          { header: 'Customers', value: (row: CustomerSegment) => row.customers },
          { header: 'Repeat rate %', value: (row: CustomerSegment) => row.repeatRate },
          { header: 'Lifetime value', value: (row: CustomerSegment) => row.ltv },
          { header: 'Average spend', value: (row: CustomerSegment) => row.avgSpend },
          { header: 'Retention %', value: (row: CustomerSegment) => row.retention }]
          } />

        } />
      

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <MetricTile label="Repeat rate" value={`${customerHeadline.repeatRate}%`} hint="of customers with 2+ bookings" tone="accent" onClick={() => setMetric('Repeat rate')} />
        <MetricTile label="Customer lifetime value" value={formatCurrency(customerHeadline.ltv)} hint="blended across segments" onClick={() => setMetric('Lifetime value')} />
        <MetricTile label="Retention (90 days)" value={`${customerHeadline.retention}%`} hint="+4.2 pts vs last quarter" tone="positive" onClick={() => setMetric('Retention')} />
        <MetricTile label="Average spend" value={formatCurrency(customerHeadline.avgSpend)} hint="per booking" onClick={() => setMetric('Average spend')} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader
            title="Segments compared"
            subtitle="Same six segments, one metric at a time"
            action={<SegmentedControl options={[...metrics]} value={metric} onChange={(next) => setMetric(next as typeof metric)} />} />
          
          <ul className="divide-y divide-line">
            {[...customerSegments].
            sort((a, b) => valueFor(b).score - valueFor(a).score).
            map((segment) => {
              const { display, score } = valueFor(segment);
              return (
                <li key={segment.name} className="flex items-center gap-3 px-5 py-4">
                    <div className="w-40 shrink-0">
                      <p className="text-[13px] font-semibold text-ink">{segment.name}</p>
                      <p className="text-xs text-muted">{formatNumber(segment.customers)} customers</p>
                    </div>
                    <div className="flex-1">
                      <ScoreBar value={Math.min(100, score)} showLabel={false} />
                    </div>
                    <span className="w-24 shrink-0 text-right text-[13px] font-semibold tabular-nums text-ink">
                      {display}
                    </span>
                  </li>);

            })}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Booking share" subtitle="Share of all bookings by segment" />
          <div className="px-5 py-5">
            <DonutChart
              data={customerSegments.map((segment) => ({ label: segment.name, value: segment.share }))}
              height={200} />
            
          </div>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader
          title="Segment detail"
          subtitle="Full metrics per segment"
          action={
          <Link to="/customers">
              <Button size="sm" variant="ghost">
                Open customer records
              </Button>
            </Link>
          } />
        
        <DataTable columns={columns} rows={customerSegments} rowKey={(row) => row.name} pageSize={6} />
      </Card>
    </div>);

}