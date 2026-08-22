import React, { useMemo, useState } from 'react';
import { LightbulbIcon, SearchIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { ExportMenu, type ExportFormat } from '../components/reports/ExportMenu';
import { ReportStat } from '../components/reports/ReportStat';
import { RevenueChart } from '../components/revenue/RevenueChart';
import { RevenueBreakdown } from '../components/revenue/RevenueBreakdown';
import { EarningsTable } from '../components/revenue/EarningsTable';
import { exportCsv, exportExcel, exportPdf } from '../utils/exportData';
import { earnings, revenueInsights, revenueSummary } from '../data/revenue';
import { inr } from '../utils/gst';

const filters = ['Today', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Custom Range'] as const;

const filterDays: Record<string, number> = {
  Today: 1,
  'Last 7 Days': 7,
  'Last 30 Days': 30,
  'This Month': 31,
  'Custom Range': 30
};

export function Revenue() {
  const [filter, setFilter] = useState<string>('Last 7 Days');
  const [custom, setCustom] = useState({ from: '', to: '' });
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const rows = useMemo(() => {
    const limit = filter === 'Today' ? 3 : filterDays[filter] >= 30 ? earnings.length : 6;
    const scoped = earnings.slice(0, limit);
    const q = query.trim().toLowerCase();
    if (!q) return scoped;
    return scoped.filter((row) =>
    [row.bookingId, row.guest, row.duration].some((field) => field.toLowerCase().includes(q))
    );
  }, [filter, query]);

  const handleExport = (format: ExportFormat) => {
    const headers = [
    'Date',
    'Booking ID',
    'Guest',
    'Duration',
    'Gross',
    'Commission',
    'Net earnings',
    'Payment status'];

    const data = rows.map((row) => [
    row.date,
    row.bookingId,
    row.guest,
    row.duration,
    row.gross,
    row.commission,
    row.net,
    row.status]
    );
    if (format === 'csv') exportCsv('checkdin-earnings', headers, data);
    if (format === 'excel') exportExcel('checkdin-earnings', headers, data);
    if (format === 'pdf') exportPdf();
    setToast(`Earnings exported as ${format.toUpperCase()}`);
    window.setTimeout(() => setToast(null), 2600);
  };

  return (
    <main className="scroll-slim h-full flex-1 overflow-y-auto bg-canvas px-7 py-6">
      <PageHeader
        title="Revenue"
        subtitle="Earnings, balances and what each slot length contributes."
        action={<ExportMenu onExport={handleExport} />} />
      

      <div className="mt-6 space-y-5 pb-8">
        <section aria-label="Revenue summary" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <ReportStat
            label="Today's revenue"
            value={inr(revenueSummary.today)}
            delta={revenueSummary.todayGrowth}
            note="vs yesterday"
            emphasis />
          
          <ReportStat
            label="Month revenue"
            value={inr(revenueSummary.month)}
            delta={revenueSummary.monthGrowth}
            note="vs last month" />
          
          <ReportStat
            label="Pending payout"
            value={inr(revenueSummary.pendingPayout)}
            note="Awaiting settlement" />
          
          <ReportStat
            label="Available balance"
            value={inr(revenueSummary.availableBalance)}
            note="Ready to withdraw" />
          
        </section>

        <RevenueChart />

        <RevenueBreakdown />

        <section className="rounded-2xl bg-ink p-5 text-white">
          <p className="flex items-center gap-2 text-[11px] font-bold tracking-wide text-lime-300">
            <LightbulbIcon size={14} aria-hidden="true" />
            REVENUE INSIGHTS
          </p>
          <ul className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
            {revenueInsights.map((insight) =>
            <li
              key={insight}
              className="rounded-xl bg-white/[0.07] px-4 py-3 text-[12.5px] leading-relaxed text-white/75">
              
                {insight}
              </li>
            )}
          </ul>
        </section>

        <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-card">
          <div className="flex flex-wrap items-center gap-2">
            {filters.map((item) =>
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={[
              'rounded-lg px-3.5 py-2 text-[12.5px] transition-colors duration-150 ease-out',
              filter === item ?
              'bg-ink font-semibold text-white' :
              'border border-neutral-200 font-medium text-ink-soft hover:border-neutral-300'].
              join(' ')}>
              
                {item}
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {filter === 'Custom Range' &&
            <>
                <input
                type="date"
                aria-label="From date"
                value={custom.from}
                onChange={(e) => setCustom({ ...custom, from: e.target.value })}
                className="rounded-lg border border-neutral-200 px-3 py-1.5 text-[13px] text-ink outline-none transition-colors duration-150 ease-out hover:border-neutral-300 focus:border-lime-500" />
              
                <input
                type="date"
                aria-label="To date"
                value={custom.to}
                onChange={(e) => setCustom({ ...custom, to: e.target.value })}
                className="rounded-lg border border-neutral-200 px-3 py-1.5 text-[13px] text-ink outline-none transition-colors duration-150 ease-out hover:border-neutral-300 focus:border-lime-500" />
              
              </>
            }
            <div className="relative">
              <SearchIcon
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
                aria-hidden="true" />
              
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search bookings"
                aria-label="Search bookings"
                className="w-[220px] rounded-lg border border-neutral-200 py-2 pl-9 pr-3 text-[13px] text-ink outline-none transition-colors duration-150 ease-out placeholder:text-neutral-400 hover:border-neutral-300 focus:border-lime-500" />
              
            </div>
          </div>
        </section>

        <EarningsTable earnings={rows} />
      </div>

      {toast &&
      <p
        role="status"
        className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-xl bg-ink px-4 py-2.5 text-[13px] font-medium text-white shadow-lg">
        
          {toast}
        </p>
      }
    </main>);

}