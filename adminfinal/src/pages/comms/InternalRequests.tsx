import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckIcon, PlusIcon, XIcon } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { PageHeader, Toolbar } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input, Label, SearchInput, Select, Textarea } from '../../components/ui/Field';
import { Tabs } from '../../components/ui/Tabs';
import { Modal } from '../../components/ui/Modal';
import { Avatar, EmptyState, Timeline } from '../../components/ui/Primitives';
import {
  personById,
  priorities,
  requestStatuses,
  type Department,
  type Priority } from
'../../data/communications';
import { useComms, useCurrentPerson } from '../../contexts/CommsContext';
import { cn } from '../../utils/cn';

const scopes = ['Inbox', 'Raised by me', 'All'];
const departments: Department[] = ['Operations', 'Finance', 'Support', 'Marketing', 'Management'];

const priorityTone: Record<Priority, 'neutral' | 'info' | 'warning' | 'negative'> = {
  Low: 'neutral',
  Medium: 'info',
  High: 'warning',
  Urgent: 'negative'
};

export function InternalRequests() {
  const me = useCurrentPerson();
  const { requests, createRequest, setRequestStatus } = useComms();

  const [scope, setScope] = useState('Inbox');
  const [status, setStatus] = useState('All statuses');
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [composing, setComposing] = useState(false);

  const [subject, setSubject] = useState('');
  const [to, setTo] = useState<Department>('Finance');
  const [priority, setPriority] = useState<Priority>('High');
  const [bookingId, setBookingId] = useState('');
  const [message, setMessage] = useState('');
  const [note, setNote] = useState('');

  const rows = useMemo(
    () =>
    requests.filter((request) => {
      if (scope === 'Inbox' && request.to !== me.department) return false;
      if (scope === 'Raised by me' && request.requesterId !== me.id) return false;
      if (status !== 'All statuses' && request.status !== status) return false;
      if (!query) return true;
      const needle = query.toLowerCase();
      return (
        request.subject.toLowerCase().includes(needle) ||
        request.ref.toLowerCase().includes(needle) ||
        (request.bookingId ?? '').toLowerCase().includes(needle) ||
        (request.propertyId ?? '').toLowerCase().includes(needle) ||
        request.message.toLowerCase().includes(needle));

    }),
    [requests, scope, status, query, me]
  );

  const active = rows.find((request) => request.id === activeId) ?? rows[0] ?? null;

  function submitRequest() {
    if (!subject.trim() || !message.trim()) return;
    createRequest({ subject: subject.trim(), to, priority, bookingId, message: message.trim() });
    setSubject('');
    setMessage('');
    setBookingId('');
    setComposing(false);
  }

  return (
    <div>
      <PageHeader
        title="Cross-department requests"
        subtitle="Internal tickets between teams — refund approvals, document checks, escalations."
        actions={
        <Button variant="primary" icon={PlusIcon} onClick={() => setComposing(true)}>
            Raise request
          </Button>
        } />
      

      <div className="mb-4 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
        { label: 'Pending', tone: 'warning' as const },
        { label: 'In Review', tone: 'info' as const },
        { label: 'Approved', tone: 'positive' as const },
        { label: 'Completed', tone: 'neutral' as const }].
        map((bucket) =>
        <Card key={bucket.label} className="px-5 py-4">
            <p className="text-[13px] font-medium text-muted">{bucket.label}</p>
            <p className="mt-0.5 text-2xl font-bold tracking-tight text-ink">
              {requests.filter((request) => request.status === bucket.label).length}
            </p>
            <p className="mt-1 text-xs text-muted">across all departments</p>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[380px_1fr]">
        <Card className="h-fit">
          <Tabs tabs={scopes} value={scope} onChange={setScope} />
          <Toolbar>
            <SearchInput
              className="sm:flex-1"
              placeholder="Search subject, ref, booking ID…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search requests" />
            
          </Toolbar>
          <div className="border-b border-line px-4 py-2.5">
            <Select
              className="w-full"
              options={['All statuses', ...requestStatuses]}
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              aria-label="Filter by status" />
            
          </div>

          {rows.length === 0 ?
          <EmptyState
            icon={CheckIcon}
            title="Nothing waiting on you"
            description="No requests match this view. Switch to All to see other departments." /> :


          <ul className="max-h-[520px] divide-y divide-line overflow-y-auto">
              {rows.map((request) =>
            <li key={request.id}>
                  <button
                onClick={() => setActiveId(request.id)}
                className={cn(
                  'w-full px-4 py-3.5 text-left transition-colors duration-150 ease-smooth hover:bg-faint',
                  active?.id === request.id && 'bg-accent/10'
                )}>
                
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-muted">{request.ref}</span>
                      <Badge tone={priorityTone[request.priority]}>{request.priority}</Badge>
                      <span className="ml-auto text-[11px] text-muted">{request.at}</span>
                    </div>
                    <p className="mt-1 truncate text-[13px] font-semibold text-ink">{request.subject}</p>
                    <p className="mt-0.5 truncate text-xs text-muted">
                      {request.from} → {request.to} · {request.status}
                    </p>
                  </button>
                </li>
            )}
            </ul>
          }
        </Card>

        {active ?
        <Card>
            <header className="border-b border-line px-5 py-4">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-semibold tracking-tight text-ink">{active.subject}</h2>
                <Badge tone={priorityTone[active.priority]}>{active.priority}</Badge>
                <Badge>{active.status}</Badge>
              </div>
              <p className="mt-1 font-mono text-xs text-muted">
                {active.ref} · {active.from} → {active.to}
              </p>
            </header>

            <div className="space-y-5 px-5 py-5">
              <div className="flex items-start gap-3">
                <Avatar name={personById(active.requesterId)?.name ?? 'Admin'} size="sm" />
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-ink">
                    {personById(active.requesterId)?.name}
                    <span className="ml-2 text-[11px] font-normal text-muted">{active.at}</span>
                  </p>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted">{active.message}</p>
                </div>
              </div>

              {active.bookingId || active.propertyId ?
            <div className="flex flex-wrap gap-2">
                  {active.bookingId ?
              <Link
                to="/bookings"
                className="rounded-lg border border-line bg-faint px-3 py-2 text-[13px] font-medium text-ink transition-colors duration-150 ease-smooth hover:bg-card">
                
                      Booking {active.bookingId}
                    </Link> :
              null}
                  {active.propertyId ?
              <Link
                to={`/properties/${active.propertyId}`}
                className="rounded-lg border border-line bg-faint px-3 py-2 text-[13px] font-medium text-ink transition-colors duration-150 ease-smooth hover:bg-card">
                
                      Property {active.propertyId}
                    </Link> :
              null}
                </div> :
            null}

              <div>
                <h3 className="mb-3 text-[13px] font-semibold text-ink">Status history</h3>
                <Timeline
                events={[...active.updates].
                reverse().
                map((update) => ({ label: update.status, at: update.at, by: update.by, note: update.note }))} />
              
              </div>

              <div className="rounded-xl border border-line bg-faint px-4 py-3.5">
                <Label htmlFor="req-note">Add a note with your decision</Label>
                <Textarea
                id="req-note"
                rows={2}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Verified the bank proof, pushing the transfer now." />
              
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                  size="sm"
                  onClick={() => {
                    setRequestStatus(active.id, 'In Review', note);
                    setNote('');
                  }}>
                  
                    Move to review
                  </Button>
                  <Button
                  size="sm"
                  variant="primary"
                  icon={CheckIcon}
                  onClick={() => {
                    setRequestStatus(active.id, 'Approved', note);
                    setNote('');
                  }}>
                  
                    Approve
                  </Button>
                  <Button
                  size="sm"
                  onClick={() => {
                    setRequestStatus(active.id, 'Completed', note);
                    setNote('');
                  }}>
                  
                    Mark completed
                  </Button>
                  <Button
                  size="sm"
                  variant="danger"
                  icon={XIcon}
                  className="sm:ml-auto"
                  onClick={() => {
                    setRequestStatus(active.id, 'Rejected', note);
                    setNote('');
                  }}>
                  
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          </Card> :
        null}
      </div>

      <Modal
        open={composing}
        onClose={() => setComposing(false)}
        title="Raise a cross-department request"
        description={`From ${me.department} · routed to the receiving team's inbox.`}
        footer={
        <>
            <Button onClick={() => setComposing(false)}>Cancel</Button>
            <Button variant="primary" onClick={submitRequest}>
              Send request
            </Button>
          </>
        }>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="req-subject">Subject</Label>
            <Input
              id="req-subject"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="Refund approval required" />
            
          </div>
          <div>
            <Label htmlFor="req-to">Send to</Label>
            <Select
              id="req-to"
              options={departments}
              value={to}
              onChange={(event) => setTo(event.target.value as Department)} />
            
          </div>
          <div>
            <Label htmlFor="req-priority">Priority</Label>
            <Select
              id="req-priority"
              options={priorities}
              value={priority}
              onChange={(event) => setPriority(event.target.value as Priority)} />
            
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="req-booking">Linked booking or property ID (optional)</Label>
            <Input
              id="req-booking"
              value={bookingId}
              onChange={(event) => setBookingId(event.target.value)}
              placeholder="CHK-74108" />
            
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="req-message">Message</Label>
            <Textarea
              id="req-message"
              rows={4}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Guest cancelled the booking and is eligible for a full refund." />
            
          </div>
        </div>
      </Modal>
    </div>);

}