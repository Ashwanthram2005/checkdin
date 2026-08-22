import React, { useState } from 'react';
import { MailIcon, MessageCircleIcon, SendIcon, SmartphoneIcon, BellIcon } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input, Label, Select, Textarea } from '../components/ui/Field';
import { DataTable, type Column } from '../components/ui/DataTable';
import { StackedCell } from '../components/ui/Cells';
import { TableSkeleton, ErrorState } from '../components/ui/LoadingState';
import { useMockQuery } from '../hooks/useMockQuery';
import { api } from '../services/api';
import { properties } from '../data/properties';
import { formatNumber } from '../utils/format';
import { cn } from '../utils/cn';
import type { Campaign } from '../types';

const channels = [
{ key: 'SMS', label: 'SMS', icon: SmartphoneIcon, hint: 'Transactional route · 160 chars' },
{ key: 'WhatsApp', label: 'WhatsApp', icon: MessageCircleIcon, hint: 'Approved templates only' },
{ key: 'Email', label: 'Email', icon: MailIcon, hint: 'Rich HTML supported' },
{ key: 'Push', label: 'Push', icon: BellIcon, hint: 'App users with notifications on' }];


const audiences = ['All Users', 'Customers', 'Partners', 'Property Specific'];

export function Notifications() {
  const { data, loading, error } = useMockQuery(api.getCampaigns, []);
  const [channel, setChannel] = useState('WhatsApp');
  const [audience, setAudience] = useState('Customers');

  const campaigns = data ?? [];

  const columns: Column<Campaign>[] = [
  {
    key: 'title',
    header: 'Campaign',
    render: (row) => <StackedCell primary={row.title} secondary={`${row.channel} · ${row.audience}`} />,
    sortValue: (row) => row.title
  },
  {
    key: 'sent',
    header: 'Sent',
    align: 'right',
    render: (row) => <span className="tabular-nums">{formatNumber(row.sent)}</span>,
    sortValue: (row) => row.sent
  },
  {
    key: 'delivered',
    header: 'Delivered',
    align: 'right',
    render: (row) =>
    <StackedCell
      align="right"
      primary={<span className="tabular-nums">{formatNumber(row.delivered)}</span>}
      secondary={row.sent ? `${Math.round(row.delivered / row.sent * 100)}%` : '—'} />,


    sortValue: (row) => row.delivered,
    hideBelow: 'sm'
  },
  {
    key: 'opened',
    header: 'Opened',
    align: 'right',
    render: (row) =>
    <StackedCell
      align="right"
      primary={<span className="tabular-nums">{formatNumber(row.opened)}</span>}
      secondary={row.delivered ? `${Math.round(row.opened / row.delivered * 100)}%` : '—'} />,


    sortValue: (row) => row.opened,
    hideBelow: 'md'
  },
  {
    key: 'schedule',
    header: 'Schedule',
    render: (row) => <span className="text-[13px] text-muted">{row.scheduledAt}</span>,
    sortValue: (row) => row.scheduledAt,
    hideBelow: 'lg'
  },
  { key: 'status', header: 'Status', align: 'right', render: (row) => <Badge>{row.status}</Badge>, sortValue: (row) => row.status }];


  return (
    <div>
      <PageHeader
        title="Notification center"
        subtitle="Compose and schedule messages across SMS, WhatsApp, email, and push." />
      

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader title="Compose message" subtitle="Sends are logged and rate-limited per channel" />
          <div className="space-y-5 px-5 py-5">
            <fieldset>
              <legend className="mb-2 text-[13px] font-medium text-ink">Channel</legend>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {channels.map((item) => {
                  const active = channel === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setChannel(item.key)}
                      className={cn(
                        'rounded-xl border px-3 py-3 text-left transition-colors duration-150 ease-smooth',
                        active ? 'border-accent bg-accent/10' : 'border-line bg-card hover:bg-faint'
                      )}>
                      
                      <item.icon className={cn('h-4 w-4', active ? 'text-ink' : 'text-muted')} />
                      <p className="mt-2 text-[13px] font-semibold text-ink">{item.label}</p>
                      <p className="mt-0.5 text-[11px] leading-snug text-muted">{item.hint}</p>
                    </button>);

                })}
              </div>
            </fieldset>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="audience">Audience</Label>
                <Select
                  id="audience"
                  options={audiences}
                  value={audience}
                  onChange={(event) => setAudience(event.target.value)} />
                
              </div>
              {audience === 'Property Specific' ?
              <div>
                  <Label htmlFor="property">Property</Label>
                  <Select id="property" options={properties.map((property) => property.name)} />
                </div> :

              <div>
                  <Label htmlFor="segment">Segment</Label>
                  <Select
                  id="segment"
                  options={['Everyone', 'Booked in last 30 days', 'Lapsed 90+ days', 'High value (₹1L+ spend)']} />
                
                </div>
              }
            </div>

            {channel === 'Email' || channel === 'Push' ?
            <div>
                <Label htmlFor="subject">{channel === 'Email' ? 'Subject line' : 'Notification title'}</Label>
                <Input id="subject" placeholder="Your Chennai stay is 20% off this weekend" />
              </div> :
            null}

            <div>
              <Label htmlFor="body">Message</Label>
              <Textarea
                id="body"
                rows={5}
                placeholder="Hi {{first_name}}, book a 3-hour slot at Hotel Empire Stay and save 20% with code CHECKDIN20." />
              
              <p className="mt-1.5 text-xs text-muted">
                Merge tags available: {'{{first_name}}'}, {'{{city}}'}, {'{{booking_code}}'}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="when">Send at</Label>
                <Input id="when" type="datetime-local" />
              </div>
              <div>
                <Label htmlFor="priority">Delivery priority</Label>
                <Select id="priority" options={['Standard', 'Transactional (immediate)']} />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={() => api.mutate('campaign.saveDraft', { channel, audience })}>Save draft</Button>
              <Button onClick={() => api.mutate('campaign.test', { channel })}>Send test</Button>
              <Button
                variant="primary"
                icon={SendIcon}
                className="sm:ml-auto"
                onClick={() => api.mutate('campaign.schedule', { channel, audience })}>
                
                Schedule send
              </Button>
            </div>
          </div>
        </Card>

        <Card className="h-fit">
          <CardHeader title="Channel health" subtitle="Last 24 hours" />
          <ul className="divide-y divide-line">
            {[
            { name: 'SMS · Kaleyra', delivery: '97.4%', tone: 'positive' as const },
            { name: 'WhatsApp · Meta Cloud', delivery: '99.1%', tone: 'positive' as const },
            { name: 'Email · Amazon SES', delivery: '98.6%', tone: 'positive' as const },
            { name: 'Push · FCM', delivery: '72.8%', tone: 'warning' as const }].
            map((provider) =>
            <li key={provider.name} className="flex items-center gap-3 px-5 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-ink">{provider.name}</p>
                  <p className="text-xs text-muted">Delivery rate</p>
                </div>
                <Badge tone={provider.tone}>{provider.delivery}</Badge>
              </li>
            )}
          </ul>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader title="Campaign history" subtitle="Sends across every channel" />
        {loading ?
        <TableSkeleton rows={6} /> :
        error ?
        <ErrorState message={error} /> :

        <DataTable columns={columns} rows={campaigns} rowKey={(row) => row.id} pageSize={6} />
        }
      </Card>
    </div>);

}