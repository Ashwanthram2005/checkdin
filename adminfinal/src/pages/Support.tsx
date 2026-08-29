import React, { useMemo, useState } from 'react';
import { ArrowUpRightIcon, CheckCircle2Icon, SendIcon, UserPlusIcon } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Label, SearchInput, Select, Textarea } from '../components/ui/Field';
import { Tabs } from '../components/ui/Tabs';
import { Avatar, EmptyState } from '../components/ui/Primitives';
import { Modal } from '../components/ui/Modal';
import { TableSkeleton, ErrorState } from '../components/ui/LoadingState';
import { useMockQuery } from '../hooks/useMockQuery';
import { api } from '../services/api';
import { formatDate } from '../utils/format';
import { cn } from '../utils/cn';
import type { Ticket } from '../types';

const tabs = ['All', 'Customer', 'Partner'];
const statusOptions = ['All statuses', 'Open', 'In Progress', 'Escalated', 'Closed'];
const agents = ['Ritu Malhotra', 'Sahil Grover', 'Varun Joshi', 'Pooja Nambiar'];

export function Support() {
  const { data, loading, error } = useMockQuery(api.getTickets, []);
  const [tab, setTab] = useState('All');
  const [status, setStatus] = useState('All statuses');
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [assigning, setAssigning] = useState(false);

  const tickets = data ?? [];

  const rows = useMemo(
    () =>
    tickets.filter((ticket) => {
      if (tab !== 'All' && ticket.requesterType !== tab) return false;
      if (status !== 'All statuses' && ticket.status !== status) return false;
      if (!query) return true;
      const needle = query.toLowerCase();
      return (
        ticket.subject.toLowerCase().includes(needle) ||
        ticket.reference.toLowerCase().includes(needle) ||
        ticket.requester.toLowerCase().includes(needle));

    }),
    [tickets, tab, status, query]
  );

  const active = rows.find((ticket) => ticket.id === activeId) ?? rows[0] ?? null;

  const stats = [
  { label: 'Open', value: tickets.filter((ticket) => ticket.status === 'Open').length },
  { label: 'In progress', value: tickets.filter((ticket) => ticket.status === 'In Progress').length },
  { label: 'Escalated', value: tickets.filter((ticket) => ticket.status === 'Escalated').length },
  { label: 'Unassigned', value: tickets.filter((ticket) => !ticket.agent).length }];


  return (
    <div>
      <PageHeader
        title="Support center"
        subtitle="Customer and partner tickets, assignment, and escalation in one queue." />
      

      <div className="mb-4 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map((stat) =>
        <Card key={stat.label} className="px-5 py-4">
            <p className="text-[13px] font-medium text-muted">{stat.label}</p>
            <p className="mt-0.5 text-2xl font-bold tracking-tight text-ink">{stat.value}</p>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[380px_1fr]">
        <Card className="h-fit">
          <Tabs tabs={tabs} value={tab} onChange={setTab} />
          <div className="space-y-2.5 border-b border-line px-4 py-3.5">
            <SearchInput
              placeholder="Search ticket, guest, reference…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search tickets" />
            
            <Select
              className="w-full"
              options={statusOptions}
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              aria-label="Filter by status" />
            
          </div>

          {loading ?
          <TableSkeleton rows={5} /> :
          error ?
          <ErrorState message={error} /> :
          rows.length === 0 ?
          <EmptyState
            icon={CheckCircle2Icon}
            title="Queue is clear"
            description="No tickets match these filters right now." /> :


          <ul className="max-h-[560px] divide-y divide-line overflow-y-auto">
              {rows.map((ticket) =>
            <li key={ticket.id}>
                  <button
                onClick={() => setActiveId(ticket.id)}
                className={cn(
                  'w-full px-4 py-3.5 text-left transition-colors duration-150 ease-smooth hover:bg-faint',
                  active?.id === ticket.id && 'bg-accent/10'
                )}>
                
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted">{ticket.reference}</span>
                      <Badge>{ticket.priority}</Badge>
                      <span className="ml-auto text-xs text-muted">{formatDate(ticket.updatedAt)}</span>
                    </div>
                    <p className="mt-1 truncate text-[13px] font-semibold text-ink">{ticket.subject}</p>
                    <p className="mt-0.5 truncate text-xs text-muted">
                      {ticket.requester} · {ticket.requesterType} · {ticket.agent ?? 'Unassigned'}
                    </p>
                  </button>
                </li>
            )}
            </ul>
          }
        </Card>

        {active ?
        <Card>
            <CardHeader
            title={active.subject}
            subtitle={`${active.reference} · ${active.category} · opened ${formatDate(active.createdAt)}`}
            action={
            <div className="flex flex-wrap gap-2">
                  <Badge>{active.status}</Badge>
                  <Badge>{active.priority}</Badge>
                </div>
            } />
          
            <div className="flex flex-wrap items-center gap-2 border-b border-line px-5 py-3">
              <Button size="sm" icon={UserPlusIcon} onClick={() => setAssigning(true)}>
                {active.agent ? `Reassign · ${active.agent}` : 'Assign agent'}
              </Button>
              <Button size="sm" icon={ArrowUpRightIcon} onClick={() => api.mutate('ticket.escalate', { id: active.id })}>
                Escalate
              </Button>
              <Button
              size="sm"
              icon={CheckCircle2Icon}
              className="ml-auto"
              onClick={() => api.mutate('ticket.close', { id: active.id })}>
              
                Close ticket
              </Button>
            </div>

            <ul className="space-y-4 px-5 py-5">
              {active.messages.map((message) =>
            <li key={`${message.author}-${message.at}`} className="flex gap-3">
                  <Avatar name={message.author} size="sm" />
                  <div
                className={cn(
                  'min-w-0 flex-1 rounded-xl border px-3.5 py-3',
                  message.role === 'Agent' ? 'border-accent/40 bg-accent/[0.08]' : 'border-line bg-faint'
                )}>
                
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[13px] font-semibold text-ink">{message.author}</p>
                      <Badge tone="neutral">{message.role}</Badge>
                      <span className="ml-auto text-xs text-muted">{message.at}</span>
                    </div>
                    <p className="mt-1.5 text-[13px] text-muted">{message.body}</p>
                  </div>
                </li>
            )}
            </ul>

            <div className="border-t border-line px-5 py-4">
              <Label htmlFor="reply">Reply to {active.requester}</Label>
              <Textarea id="reply" rows={3} placeholder="Type your response…" />
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Select options={['Public reply', 'Internal note']} aria-label="Reply visibility" />
                <Button
                variant="primary"
                icon={SendIcon}
                className="ml-auto"
                onClick={() => api.mutate('ticket.reply', { id: active.id })}>
                
                  Send reply
                </Button>
              </div>
            </div>
          </Card> :
        null}
      </div>

      <Modal
        open={assigning}
        onClose={() => setAssigning(false)}
        title="Assign agent"
        description={active ? `${active.reference} · ${active.subject}` : undefined}
        width="sm"
        footer={
        <>
            <Button onClick={() => setAssigning(false)}>Cancel</Button>
            <Button
            variant="primary"
            onClick={() => {
              api.mutate('ticket.assign', { id: active?.id });
              setAssigning(false);
            }}>
            
              Assign
            </Button>
          </>
        }>
        
        <Label htmlFor="agent">Support agent</Label>
        <Select id="agent" options={agents} defaultValue={active?.agent ?? agents[0]} />
      </Modal>
    </div>);

}