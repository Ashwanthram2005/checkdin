import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRightIcon,
  BuildingIcon,
  CalendarCheckIcon,
  IndianRupeeIcon,
  PauseIcon,
  PlugZapIcon,
  UsersIcon } from
'lucide-react';
import { Card, CardHeader } from '../../components/ui/Card';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Toggle } from '../../components/ui/Field';
import { MetricTile, LivePulse, SectionTitle } from '../../components/adminos/OsPrimitives';
import { RevenueAreaChart, DonutChart } from '../../components/charts/Charts';
import { revenueTrend } from '../../data/analytics';
import { revenueByDuration, customerHeadline } from '../../data/adminos/intelligence';
import { useAdminOs } from '../../contexts/AdminOsContext';
import { revenueTotals, supplyTotals, extensionTotals } from '../../services/adminos/selectors';
import { useLiveCounter } from '../../hooks/useLiveTicker';
import { formatCurrency, formatNumber } from '../../utils/format';

export function PlatformOverview() {
  const { state, streaming, setStreaming } = useAdminOs();

  const revenue = revenueTotals(state);
  const supply = supplyTotals(state);
  const extensions = extensionTotals(state.extensions);

  const bookings = useLiveCounter(18422 + state.events.length, 3, 4000, streaming);
  const activeStays = useLiveCounter(1284, 2, 4000, streaming);
  const checkIns = useLiveCounter(
    286 + state.events.filter((event) => event.kind === 'Check-in').length,
    1,
    6000,
    streaming
  );
  const checkOuts = useLiveCounter(
    241 + state.events.filter((event) => event.kind === 'Check-out').length,
    1,
    7000,
    streaming
  );
  const todayRevenue = useLiveCounter(Math.round(revenue.gross / 32), 9000, 4000, streaming);

  return (
    <div>
      <PageHeader
        title="Platform overview"
        subtitle="Live marketplace state across revenue, supply, demand, and operations."
        actions={
        <div className="flex items-center gap-2.5 rounded-lg border border-line bg-card px-3 py-1.5">
            <LivePulse />
            <span className="text-[13px] font-medium text-ink">{streaming ? 'Live stream on' : 'Stream paused'}</span>
            <Toggle checked={streaming} onChange={setStreaming} label="Live stream" />
          </div>
        } />
      

      <SectionTitle hint="Click any figure to open the records behind it">Revenue</SectionTitle>
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">
        <MetricTile
          label="Today"
          value={formatCurrency(todayRevenue, true)}
          hint="rolling since 00:00 IST"
          tone="accent"
          live={streaming}
          to="/os/revenue-intelligence" />
        
        <MetricTile label="Gross revenue" value={formatCurrency(revenue.gross, true)} hint="month to date" to="/os/revenue-intelligence" />
        <MetricTile label="Net revenue" value={formatCurrency(revenue.net, true)} hint="after commission and GST" to="/os/revenue-intelligence" />
        <MetricTile
          label="Extension revenue"
          value={formatCurrency(revenue.extension, true)}
          hint={`${extensions.approved} approved extensions`}
          to="/os/extensions?status=Approved" />
        
        <MetricTile label="Commission earned" value={formatCurrency(revenue.commission, true)} hint="12.0% take rate" to="/os/settlements" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Revenue trend"
            subtitle="Last 14 days, gross value"
            action={
            <Link to="/os/revenue-intelligence">
                <Button size="sm" variant="ghost">
                  Revenue intelligence <ArrowRightIcon className="h-3.5 w-3.5" />
                </Button>
              </Link>
            } />
          
          <div className="px-2 py-4">
            <RevenueAreaChart data={revenueTrend} />
          </div>
        </Card>
        <Card>
          <CardHeader title="Booking duration mix" subtitle="Share of gross revenue" />
          <div className="px-5 py-5">
            <DonutChart data={revenueByDuration} height={190} />
          </div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader
            title="Hotels"
            subtitle={`${supply.total} on the marketplace`}
            action={
            <Link to="/os/hotel-status">
                <Button size="sm" variant="ghost">
                  Status board <ArrowRightIcon className="h-3.5 w-3.5" />
                </Button>
              </Link>
            } />
          
          <ul className="divide-y divide-line">
            {[
            { label: 'Total hotels', value: supply.total, icon: BuildingIcon, to: '/os/hotel-status' },
            { label: 'Active hotels', value: supply.live, icon: PlugZapIcon, to: '/os/hotel-status?state=Live' },
            { label: 'Paused hotels', value: supply.paused, icon: PauseIcon, to: '/os/hotel-status?state=Paused' },
            {
              label: 'Offline hotels',
              value: supply.offline + supply.vacation,
              icon: PlugZapIcon,
              to: '/os/hotel-status?state=Offline'
            }].
            map((row) =>
            <li key={row.label}>
                <Link
                to={row.to}
                className="flex items-center gap-3 px-5 py-3.5 transition-colors duration-150 ease-smooth hover:bg-faint">
                
                  <row.icon className="h-4 w-4 text-muted" />
                  <span className="text-[13px] text-ink">{row.label}</span>
                  <span className="ml-auto text-lg font-bold tabular-nums text-ink">{row.value}</span>
                  <ArrowRightIcon className="h-3.5 w-3.5 text-muted" />
                </Link>
              </li>
            )}
          </ul>
        </Card>

        <Card>
          <CardHeader
            title="Customers"
            subtitle="Guest base across all cities"
            action={
            <Link to="/os/customer-intelligence">
                <Button size="sm" variant="ghost">
                  Intelligence <ArrowRightIcon className="h-3.5 w-3.5" />
                </Button>
              </Link>
            } />
          
          <ul className="divide-y divide-line">
            {[
            { label: 'Total customers', value: formatNumber(customerHeadline.total), to: '/customers' },
            { label: 'Active customers', value: formatNumber(customerHeadline.active), to: '/customers' },
            { label: 'Repeat customers', value: formatNumber(customerHeadline.repeat), to: '/os/customer-intelligence' },
            { label: 'New this month', value: formatNumber(customerHeadline.newThisMonth), to: '/os/customer-intelligence' }].
            map((row) =>
            <li key={row.label}>
                <Link
                to={row.to}
                className="flex items-center gap-3 px-5 py-3.5 transition-colors duration-150 ease-smooth hover:bg-faint">
                
                  <UsersIcon className="h-4 w-4 text-muted" />
                  <span className="text-[13px] text-ink">{row.label}</span>
                  <span className="ml-auto text-lg font-bold tabular-nums text-ink">{row.value}</span>
                  <ArrowRightIcon className="h-3.5 w-3.5 text-muted" />
                </Link>
              </li>
            )}
          </ul>
        </Card>

        <Card>
          <CardHeader
            title="Operations"
            subtitle="Updating live"
            action={
            <Link to="/os/command-center">
                <Button size="sm" variant="ghost">
                  Command center <ArrowRightIcon className="h-3.5 w-3.5" />
                </Button>
              </Link>
            } />
          
          <ul className="divide-y divide-line">
            {[
            { label: 'Total bookings', value: formatNumber(bookings), icon: CalendarCheckIcon, to: '/bookings' },
            { label: 'Active stays', value: formatNumber(activeStays), icon: BuildingIcon, to: '/bookings?status=Checked%20In' },
            {
              label: 'Extension requests open',
              value: String(extensions.pending),
              icon: IndianRupeeIcon,
              to: '/os/extensions?status=Pending'
            },
            {
              label: "Today's check-ins / outs",
              value: `${checkIns} / ${checkOuts}`,
              icon: CalendarCheckIcon,
              to: '/os/command-center'
            }].
            map((row) =>
            <li key={row.label}>
                <Link
                to={row.to}
                className="flex items-center gap-3 px-5 py-3.5 transition-colors duration-150 ease-smooth hover:bg-faint">
                
                  <row.icon className="h-4 w-4 text-muted" />
                  <span className="text-[13px] text-ink">{row.label}</span>
                  <span className="ml-auto text-lg font-bold tabular-nums text-ink">{row.value}</span>
                  <ArrowRightIcon className="h-3.5 w-3.5 text-muted" />
                </Link>
              </li>
            )}
          </ul>
        </Card>
      </div>
    </div>);

}