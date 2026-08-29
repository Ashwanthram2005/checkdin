import React, { useState } from 'react';
import { FileSpreadsheetIcon, FileTextIcon, FileIcon, PlayIcon } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input, Label, Select } from '../components/ui/Field';
import { Modal } from '../components/ui/Modal';
import { reportTemplates } from '../data/governance';
import { cities } from '../data/properties';
import { formatNumber } from '../utils/format';
import { api } from '../services/api';
import { cn } from '../utils/cn';

const formats = [
{ key: 'CSV', icon: FileTextIcon, hint: 'Raw rows, best for spreadsheets' },
{ key: 'Excel', icon: FileSpreadsheetIcon, hint: 'Formatted with pivot-ready sheets' },
{ key: 'PDF', icon: FileIcon, hint: 'Print-ready summary with charts' }];


const recentExports = [
{ name: 'Revenue & commission · 01–15 Aug', format: 'Excel', size: '842 KB', at: '19 Aug 2026, 08:12 AM', status: 'Completed' },
{ name: 'Booking summary · July 2026', format: 'CSV', size: '4.2 MB', at: '01 Aug 2026, 06:30 AM', status: 'Completed' },
{ name: 'GST filing extract · July 2026', format: 'PDF', size: '210 KB', at: '01 Aug 2026, 06:05 AM', status: 'Completed' },
{ name: 'Partner performance · Q2 FY27', format: 'Excel', size: '—', at: '19 Aug 2026, 09:40 AM', status: 'Failed' }];


export function Reports() {
  const [active, setActive] = useState<string | null>(null);
  const [format, setFormat] = useState('CSV');

  const template = reportTemplates.find((item) => item.id === active) ?? null;

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Generate booking, revenue, partner, and property extracts on demand or on a schedule." />
      

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {reportTemplates.map((item) =>
        <Card key={item.id} className="flex flex-col p-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-base font-semibold tracking-tight text-ink">{item.name}</h2>
              <Badge tone="neutral">{item.category}</Badge>
            </div>
            <p className="mt-1.5 text-[13px] text-muted">{item.description}</p>
            <div className="mt-auto pt-4">
              <p className="text-xs text-muted">
                Last run {item.lastRun} · {formatNumber(item.rows)} rows
              </p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="primary" icon={PlayIcon} onClick={() => setActive(item.id)}>
                  Generate
                </Button>
                <Button size="sm" onClick={() => api.mutate('report.schedule', { id: item.id })}>
                  Schedule
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      <Card className="mt-4">
        <CardHeader title="Recent exports" subtitle="Available for 30 days" />
        <ul className="divide-y divide-line">
          {recentExports.map((item) =>
          <li key={item.name} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
              <FileTextIcon className="h-4 w-4 shrink-0 text-muted" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-ink">{item.name}</p>
                <p className="text-xs text-muted">
                  {item.format} · {item.size} · {item.at}
                </p>
              </div>
              <Badge>{item.status}</Badge>
              <Button size="sm" variant="ghost" disabled={item.status === 'Failed'}>
                Download
              </Button>
            </li>
          )}
        </ul>
      </Card>

      <Modal
        open={Boolean(template)}
        onClose={() => setActive(null)}
        title={`Generate ${template?.name ?? ''}`}
        description="Large extracts are emailed to you when ready."
        footer={
        <>
            <Button onClick={() => setActive(null)}>Cancel</Button>
            <Button
            variant="primary"
            onClick={() => {
              api.mutate('report.generate', { id: template?.id, format });
              setActive(null);
            }}>
            
              Generate {format}
            </Button>
          </>
        }>
        
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="from">From</Label>
              <Input id="from" type="date" defaultValue="2026-08-01" />
            </div>
            <div>
              <Label htmlFor="to">To</Label>
              <Input id="to" type="date" defaultValue="2026-08-19" />
            </div>
            <div>
              <Label htmlFor="report-city">City</Label>
              <Select id="report-city" options={cities} />
            </div>
            <div>
              <Label htmlFor="grouping">Group by</Label>
              <Select id="grouping" options={['Day', 'Week', 'Month', 'Property', 'Partner']} />
            </div>
          </div>

          <fieldset>
            <legend className="mb-2 text-[13px] font-medium text-ink">Export format</legend>
            <div className="grid grid-cols-3 gap-2.5">
              {formats.map((item) =>
              <button
                key={item.key}
                type="button"
                aria-pressed={format === item.key}
                onClick={() => setFormat(item.key)}
                className={cn(
                  'rounded-xl border px-3 py-3 text-left transition-colors duration-150 ease-smooth',
                  format === item.key ? 'border-accent bg-accent/10' : 'border-line hover:bg-faint'
                )}>
                
                  <item.icon className="h-4 w-4 text-muted" />
                  <p className="mt-2 text-[13px] font-semibold text-ink">{item.key}</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-muted">{item.hint}</p>
                </button>
              )}
            </div>
          </fieldset>
        </div>
      </Modal>
    </div>);

}