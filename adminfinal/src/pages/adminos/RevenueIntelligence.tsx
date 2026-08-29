import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { SegmentedControl } from '../../components/ui/Tabs';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { NameCell } from '../../components/ui/Cells';
import { MetricTile, ExportMenu } from '../../components/adminos/OsPrimitives';
import { DonutChart, RevenueBreakdownChart } from '../../components/charts/Charts';
import {
  revenueByCity,
  revenueByDuration,
  revenueBySegment,
  revenueByPeriod } from
'../../data/adminos/intelligence';
import { useAdminOs } from '../../contexts/AdminOsContext';
import { revenueTotals } from '../../services/adminos/selectors';
import { formatCurrency } from '../../utils/format';

const periods = ['Daily', 'Weekly', 'Monthly', 'Yearly'] as const;
const breakdowns = ['City', 'Hotel', 'Duration', 'Segment'];

interface HotelRevenue {
  propertyId: string;
  propertyName: string;
  city: string;
  gross: number;
  extension: number;
  commission: number;
  net: number;
}

export function RevenueIntelligence() {
  const { state } = useAdminOs();
  const [period, setPeriod] = useState<(typeof periods)[number]>('Daily');
  const [breakdown, setBreakdown] = useState('City');

  const totals = revenueTotals(state);

  /** Per-hotel revenue built from live settlements and approved extensions. */
  const revenueByHotel = useMemo<HotelRevenue[]>(() => {
    const map = new Map<string, HotelRevenue>();
    state.settlements.forEach((settlement) => {
      const existing = map.get(settlement.propertyId);
      const extension = state.extensions.
      filter((row) => row.propertyId === settlement.propertyId && row.status === 'Approved').
      reduce((sum, row) => sum + row.revenue, 0);
      if (existing) {
        existing.gross += settlement.gross;
        existing.commission += settlement.commission;
        existing.net += settlement.net;
      } else {
        map.set(settlement.propertyId, {
          propertyId: settlement.propertyId,
          propertyName: settlement.propertyName,
          city: settlement.city,
          gross: settlement.gross + extension,
          extension,
          commission: settlement.commission,
          net: settlement.net
        });
      }
    });
    return [...map.values()].sort((a, b) => b.gross - a.gross);
  }, [state.settlements, state.extensions]);

  const hotelColumns: Column<HotelRevenue>[] = [
  {
    key: 'hotel',
    header: 'Hotel',
    render: (row) =>
    <Link to={`/properties/${row.propertyId}`} className="hover:underline">
          <NameCell primary={row.propertyName} secondary={row.city} />
        </Link>,

    sortValue: (row) => row.propertyName
  },
  {
    key: 'gross',
    header: 'Gross',
    align: 'right',
    render: (row) => <span className="font-semibold tabular-nums">{formatCurrency(row.gross)}</span>,
    sortValue: (row) => row.gross
  },
  {
    key: 'extension',
    header: 'Extension',
    align: 'right',
    render: (row) => <span className="tabular-nums text-muted">{formatCurrency(row.extension)}</span>,
    sortValue: (row) => row.extension,
    hideBelow: 'md'
  },
  {
    key: 'commission',
    header: 'Commission',
    align: 'right',
    render: (row) => <span className="tabular-nums text-muted">{formatCurrency(row.commission)}</span>,
    sortValue: (row) => row.commission,
    hideBelow: 'lg'
  },
  {
    key: 'net',
    header: 'Net to partner',
    align: 'right',
    render: (row) => <span className="tabular-nums text-ink">{formatCurrency(row.net)}</span>,
    sortValue: (row) => row.net
  }];


  return (
    <div>
      <PageHeader
        title="Revenue intelligence"
        subtitle="Where marketplace revenue comes from, what Checkdin keeps, and what refunds take back."
        actions={
        <ExportMenu
          title="Revenue by hotel"
          subtitle={`Gross ${formatCurrency(totals.gross)} · net ${formatCurrency(totals.net)}`}
          entity="Revenue"
          rows={revenueByHotel}
          columns={[
          { header: 'Hotel', value: (row: HotelRevenue) => row.propertyName },
          { header: 'City', value: (row: HotelRevenue) => row.city },
          { header: 'Gross', value: (row: HotelRevenue) => row.gross },
          { header: 'Extension', value: (row: HotelRevenue) => row.extension },
          { header: 'Commission', value: (row: HotelRevenue) => row.commission },
          { header: 'Net to partner', value: (row: HotelRevenue) => row.net }]
          } />

        } />
      

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">
        <MetricTile label="Gross revenue" value={formatCurrency(totals.gross, true)} hint="settlements plus extensions" tone="accent" onClick={() => setBreakdown('Hotel')} />
        <MetricTile label="Net revenue" value={formatCurrency(totals.net, true)} hint="after commission and GST" to="/os/settlements" />
        <MetricTile label="Extension revenue" value={formatCurrency(totals.extension, true)} hint="from approved extensions" to="/os/extensions?status=Approved" />
        <MetricTile label="Commission earned" value={formatCurrency(totals.commission, true)} hint="12.0% take rate" tone="positive" to="/os/settlements" />
        <MetricTile label="Refund impact" value={formatCurrency(totals.refundImpact, true)} hint="open disputes and refunds" tone="negative" to="/os/disputes" />
      </div>

      <Card className="mt-4">
        <CardHeader
          title="Revenue trend"
          subtitle="Gross, net, and commission side by side"
          action={<SegmentedControl options={[...periods]} value={period} onChange={(next) => setPeriod(next as typeof period)} />} />
        
        <div className="px-2 py-4">
          <RevenueBreakdownChart data={revenueByPeriod[period]} height={300} />
        </div>
      </Card>

      <Card className="mt-4">
        <CardHeader
          title="Revenue breakdown"
          subtitle="Slice the same revenue by a different dimension"
          action={<SegmentedControl options={breakdowns} value={breakdown} onChange={setBreakdown} />} />
        

        {breakdown === 'City' ?
        <>
            <div className="px-2 py-4">
              <RevenueBreakdownChart data={revenueByCity} height={290} />
            </div>
            <ul className="divide-y divide-line border-t border-line">
              {revenueByCity.map((city) =>
            <li key={city.label}>
                  <Link
                to={`/os/city-intelligence?city=${encodeURIComponent(city.label)}`}
                className="flex items-center gap-3 px-5 py-3 transition-colors duration-150 ease-smooth hover:bg-faint">
                
                    <span className="text-[13px] font-semibold text-ink">{city.label}</span>
                    <span className="ml-auto text-[13px] tabular-nums text-muted">
                      gross {formatCurrency(city.gross, true)} · commission {formatCurrency(city.commission, true)}
                    </span>
                    <Button size="sm" variant="ghost">
                      City analytics
                    </Button>
                  </Link>
                </li>
            )}
            </ul>
          </> :
        null}

        {breakdown === 'Hotel' ?
        <DataTable columns={hotelColumns} rows={revenueByHotel} rowKey={(row) => row.propertyId} pageSize={8} /> :
        null}

        {breakdown === 'Duration' ?
        <div className="px-5 py-6">
            <DonutChart data={revenueByDuration} height={230} />
          </div> :
        null}

        {breakdown === 'Segment' ?
        <div className="px-5 py-6">
            <DonutChart data={revenueBySegment} height={230} />
          </div> :
        null}
      </Card>
    </div>);

}