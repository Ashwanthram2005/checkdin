import React, { useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { ExportMenu, type ExportFormat } from '../components/reports/ExportMenu';
import { RevenueReport } from '../components/reports/RevenueReport';
import { BookingReport } from '../components/reports/BookingReport';
import { OccupancyReport } from '../components/reports/OccupancyReport';
import { GuestReport } from '../components/reports/GuestReport';
import { PayoutReport } from '../components/reports/PayoutReport';
import { DurationReport } from '../components/reports/DurationReport';
import { exportCsv, exportExcel, exportPdf } from '../utils/exportData';
import {
  bookingSeries,
  durationAnalysis,
  guestSeries,
  occupancySeries,
  reportRanges,
  revenueSeries } from
'../data/reports';

const sections = [
{ id: 'revenue', label: 'Revenue' },
{ id: 'booking', label: 'Bookings' },
{ id: 'occupancy', label: 'Occupancy' },
{ id: 'guest', label: 'Guests' },
{ id: 'payout', label: 'Payouts' },
{ id: 'duration', label: 'Duration analysis' }] as
const;

type SectionId = (typeof sections)[number]['id'];

const exportTables: Record<SectionId, {headers: string[];rows: (string | number)[][];}> = {
  revenue: {
    headers: ['Period', 'Revenue'],
    rows: revenueSeries.daily.map((row) => [row.label, row.value])
  },
  booking: {
    headers: ['Date', 'Confirmed', 'Completed', 'Cancelled'],
    rows: bookingSeries.map((row) => [row.label, row.confirmed, row.completed, row.cancelled])
  },
  occupancy: {
    headers: ['Date', 'Occupancy %'],
    rows: occupancySeries.map((row) => [row.label, row.value])
  },
  guest: {
    headers: ['Month', 'New guests', 'Repeat guests'],
    rows: guestSeries.map((row) => [row.label, row.newGuests, row.repeatGuests])
  },
  payout: {
    headers: ['Duration', 'Bookings', 'Revenue'],
    rows: durationAnalysis.map((row) => [row.label, row.bookings, row.revenue])
  },
  duration: {
    headers: ['Duration', 'Bookings', 'Revenue', 'Share %'],
    rows: durationAnalysis.map((row) => [row.label, row.bookings, row.revenue, row.share])
  }
};

export function Reports() {
  const [section, setSection] = useState<SectionId>('revenue');
  const [range, setRange] = useState<string>('Last 7 Days');
  const [custom, setCustom] = useState({ from: '', to: '' });
  const [toast, setToast] = useState<string | null>(null);

  const handleExport = (format: ExportFormat) => {
    const table = exportTables[section];
    const fileName = `checkdin-${section}-report`;
    if (format === 'csv') exportCsv(fileName, table.headers, table.rows);
    if (format === 'excel') exportExcel(fileName, table.headers, table.rows);
    if (format === 'pdf') exportPdf();
    setToast(`${section} report exported as ${format.toUpperCase()}`);
    window.setTimeout(() => setToast(null), 2600);
  };

  const panels: Record<SectionId, React.ReactNode> = {
    revenue: <RevenueReport />,
    booking: <BookingReport />,
    occupancy: <OccupancyReport />,
    guest: <GuestReport />,
    payout: <PayoutReport />,
    duration: <DurationReport />
  };

  return (
    <main className="scroll-slim h-full flex-1 overflow-y-auto bg-canvas px-7 py-6">
      <PageHeader
        title="Reports"
        subtitle="Performance across revenue, bookings, occupancy, guests, payouts and slot lengths."
        action={<ExportMenu onExport={handleExport} />} />
      

      <div className="mt-6 space-y-5 pb-8">
        <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-card">
          <div className="flex flex-wrap items-center gap-2">
            <CalendarIcon size={16} className="text-ink-muted" aria-hidden="true" />
            {reportRanges.map((item) =>
            <button
              key={item}
              type="button"
              onClick={() => setRange(item)}
              className={[
              'rounded-lg px-3.5 py-2 text-[12.5px] transition-colors duration-150 ease-out',
              range === item ?
              'bg-ink font-semibold text-white' :
              'border border-neutral-200 font-medium text-ink-soft hover:border-neutral-300'].
              join(' ')}>
              
                {item}
              </button>
            )}
          </div>

          {range === 'Custom Range' &&
          <div className="flex items-center gap-2">
              <label htmlFor="reportFrom" className="text-[12px] text-ink-muted">
                From
              </label>
              <input
              id="reportFrom"
              type="date"
              value={custom.from}
              onChange={(e) => setCustom({ ...custom, from: e.target.value })}
              className="rounded-lg border border-neutral-200 px-3 py-1.5 text-[13px] text-ink outline-none transition-colors duration-150 ease-out hover:border-neutral-300 focus:border-lime-500" />
            
              <label htmlFor="reportTo" className="text-[12px] text-ink-muted">
                to
              </label>
              <input
              id="reportTo"
              type="date"
              value={custom.to}
              onChange={(e) => setCustom({ ...custom, to: e.target.value })}
              className="rounded-lg border border-neutral-200 px-3 py-1.5 text-[13px] text-ink outline-none transition-colors duration-150 ease-out hover:border-neutral-300 focus:border-lime-500" />
            
            </div>
          }
        </section>

        <nav aria-label="Report sections" className="border-b border-neutral-200">
          <ul className="flex flex-wrap gap-1">
            {sections.map((item) => {
              const isActive = item.id === section;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => setSection(item.id)}
                    className={[
                    'border-b-2 px-4 py-3 text-[13.5px] transition-colors duration-150 ease-out',
                    isActive ?
                    'border-ink font-semibold text-ink' :
                    'border-transparent font-medium text-ink-muted hover:text-ink'].
                    join(' ')}>
                    
                    {item.label}
                  </button>
                </li>);

            })}
          </ul>
        </nav>

        {panels[section]}
      </div>

      {toast &&
      <p
        role="status"
        className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-xl bg-ink px-4 py-2.5 text-[13px] font-medium capitalize text-white shadow-lg">
        
          {toast}
        </p>
      }
    </main>);

}