import React from 'react';
import { SettingsCard } from '../settings/SettingsCard';
import { ExportMenu } from '../reports/ExportMenu';
import { ReportStat } from '../reports/ReportStat';
import { commissionRate, revenueSummary } from '../../data/revenue';
import { exportCsv, exportExcel, exportPdf } from '../../utils/exportData';
import { gstAmount, inr } from '../../utils/gst';

/** Module 14 — earnings by period plus the gross → commission → GST → net chain. */
export function FinancialBreakdown() {
  const gross = revenueSummary.month;
  const commission = Math.round(gross * commissionRate);
  const gst = Math.round(gstAmount(Math.round(gross / 320)) * 320);
  const net = gross - commission - gst;

  const rows = [
  { label: 'Gross revenue', value: gross, note: 'What guests paid this month' },
  { label: 'Platform commission', value: -commission, note: `${commissionRate * 100}% of gross` },
  { label: 'GST collected', value: -gst, note: 'Remitted on your behalf' },
  { label: 'Net earnings', value: net, note: 'Settled to your bank account' }];


  return (
    <>
      <section aria-label="Earnings by period" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <ReportStat
          label="Earnings today"
          value={inr(revenueSummary.today)}
          delta={revenueSummary.todayGrowth}
          note="vs yesterday" />
        
        <ReportStat label="This week" value={inr(88850)} delta={16} note="vs last week" />
        <ReportStat
          label="This month"
          value={inr(revenueSummary.month)}
          delta={revenueSummary.monthGrowth}
          note="vs last month" />
        
        <ReportStat
          label="Upcoming payout"
          value={inr(revenueSummary.pendingPayout)}
          note="Settles Friday, 21 Aug"
          emphasis />
        
      </section>

      <SettingsCard
        title="Financial breakdown"
        description="How this month's gross revenue becomes money in your account."
        action={
        <ExportMenu
          onExport={(format) => {
            if (format === 'pdf') return exportPdf();
            const headers = ['Line item', 'Amount'];
            const data = rows.map((row) => [row.label, row.value]);
            const name = 'checkdin-financial-breakdown';
            if (format === 'csv') exportCsv(name, headers, data);else
            exportExcel(name, headers, data);
          }} />

        }
        bodyClassName="p-5">
        
        <ul className="divide-y divide-neutral-100">
          {rows.map((row, index) =>
          <li key={row.label} className="flex items-center justify-between gap-4 py-3">
              <span>
                <span
                className={[
                'block text-[13.5px]',
                index === rows.length - 1 ? 'font-semibold text-ink' : 'text-ink-soft'].
                join(' ')}>
                
                  {row.label}
                </span>
                <span className="mt-0.5 block text-[11.5px] text-ink-muted">{row.note}</span>
              </span>
              <span
              className={[
              'shrink-0 tabular-nums',
              index === rows.length - 1 ?
              'text-[19px] font-bold tracking-tight text-forest' :
              row.value < 0 ?
              'text-[14px] font-medium text-red-600' :
              'text-[14px] font-semibold text-ink'].
              join(' ')}>
              
                {row.value < 0 ? `− ${inr(Math.abs(row.value))}` : inr(row.value)}
              </span>
            </li>
          )}
        </ul>
      </SettingsCard>
    </>);

}