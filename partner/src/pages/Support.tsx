import React, { useState } from 'react';
import {
  CheckCircle2Icon,
  ChevronDownIcon,
  ClockIcon,
  HeadsetIcon,
  MailIcon,
  MessageCircleIcon,
  PaperclipIcon,
  PhoneIcon,
  XIcon } from
'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { SettingsCard } from '../components/settings/SettingsCard';
import { Field, Select, TextArea, TextInput } from '../components/settings/FormField';
import { useAuth } from '../contexts/AuthContext';
import {
  faqs,
  issueCategories,
  supportChannels,
  supportTickets as seedTickets,
  type SupportTicket,
  type TicketStatus } from
'../data/support';
import { property } from '../data/auth';

const statusChip: Record<TicketStatus, string> = {
  Open: 'bg-amber-50 text-amber-700',
  'In Progress': 'bg-blue-50 text-blue-700',
  Resolved: 'bg-lime-100 text-lime-600'
};

export function Support() {
  const { user, addAudit } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>(seedTickets);
  const [statusFilter, setStatusFilter] = useState<'All' | TicketStatus>('All');
  const [openFaq, setOpenFaq] = useState<string | null>(faqs[0].id);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState<SupportTicket | null>(null);
  const [form, setForm] = useState({
    propertyName: property.name,
    partnerName: user?.name ?? '',
    mobile: property.ownerPhone,
    email: 'stay@empirestay.in',
    category: issueCategories[0],
    subject: '',
    description: ''
  });

  const counts = {
    Open: tickets.filter((ticket) => ticket.status === 'Open').length,
    'In Progress': tickets.filter((ticket) => ticket.status === 'In Progress').length,
    Resolved: tickets.filter((ticket) => ticket.status === 'Resolved').length
  };

  const visible =
  statusFilter === 'All' ? tickets : tickets.filter((ticket) => ticket.status === statusFilter);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.subject.trim() || !form.description.trim()) return;

    const ticket: SupportTicket = {
      id: `CHK-SP-${Math.floor(4900 + Math.random() * 99)}`,
      category: form.category,
      subject: form.subject.trim(),
      createdOn: 'Just now',
      status: 'Open',
      agent: 'Unassigned'
    };
    setTickets((prev) => [ticket, ...prev]);
    setSubmitted(ticket);
    setForm({ ...form, subject: '', description: '' });
    setAttachments([]);
    addAudit({
      action: 'Raised support request',
      detail: `${ticket.id} • ${ticket.category}`,
      category: 'Operations'
    });
  };

  return (
    <main className="scroll-slim h-full flex-1 overflow-y-auto bg-canvas px-7 py-6">
      <PageHeader
        title="Support"
        subtitle="Reach the Checkdin partner team for bookings, payments, payouts and account help." />
      

      <div className="mt-6 space-y-5 pb-8">
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <article className="rounded-2xl bg-ink p-5 text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
              <PhoneIcon size={18} className="text-lime-300" aria-hidden="true" />
            </span>
            <h2 className="mt-3.5 text-[15px] font-semibold">Call support</h2>
            <p className="mt-1 text-[12.5px] text-white/60">Dedicated partner line, 24 × 7.</p>
            <p className="mt-3 font-mono text-[16px] font-semibold">{supportChannels.phone}</p>
            <a
              href={`tel:${supportChannels.phone.replace(/\s/g, '')}`}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-lime-300 px-4 py-2.5 text-[13.5px] font-semibold text-ink transition-colors duration-150 ease-out hover:bg-lime-200">
              
              <PhoneIcon size={15} aria-hidden="true" />
              Call now
            </a>
          </article>

          <article className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-card">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-100">
              <MessageCircleIcon size={18} className="text-lime-600" aria-hidden="true" />
            </span>
            <h2 className="mt-3.5 text-[15px] font-semibold text-ink">WhatsApp support</h2>
            <p className="mt-1 text-[12.5px] text-ink-muted">
              Send screenshots and get replies in the same chat.
            </p>
            <a
              href={`https://wa.me/${supportChannels.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="mt-[38px] inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-[13.5px] font-semibold text-white transition-opacity duration-150 ease-out hover:opacity-90">
              
              <MessageCircleIcon size={15} aria-hidden="true" />
              Chat on WhatsApp
            </a>
          </article>

          <article className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-card">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100">
              <HeadsetIcon size={18} className="text-ink" aria-hidden="true" />
            </span>
            <h2 className="mt-3.5 text-[15px] font-semibold text-ink">Support information</h2>
            <dl className="mt-3 space-y-2">
              <div className="flex items-center justify-between text-[12.5px]">
                <dt className="text-ink-muted">Support hours</dt>
                <dd className="font-semibold text-ink">{supportChannels.hours}</dd>
              </div>
              <div className="flex items-center justify-between text-[12.5px]">
                <dt className="text-ink-muted">Avg. response</dt>
                <dd className="flex items-center gap-1 font-semibold text-ink">
                  <ClockIcon size={12} className="text-ink-muted" aria-hidden="true" />
                  {supportChannels.responseTime}
                </dd>
              </div>
              <div className="flex items-center justify-between text-[12.5px]">
                <dt className="text-ink-muted">Email</dt>
                <dd className="flex items-center gap-1 font-medium text-ink">
                  <MailIcon size={12} className="text-ink-muted" aria-hidden="true" />
                  {supportChannels.email}
                </dd>
              </div>
              <div className="flex items-center justify-between text-[12.5px]">
                <dt className="text-ink-muted">Channels</dt>
                <dd className="font-medium text-ink">Phone • WhatsApp • Email</dd>
              </div>
            </dl>
          </article>
        </section>

        {submitted &&
        <section
          role="status"
          className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-lime-300 bg-lime-50 px-5 py-4">
          
            <div className="flex items-start gap-3">
              <CheckCircle2Icon size={20} className="mt-0.5 shrink-0 text-lime-600" aria-hidden="true" />
              <div>
                <p className="text-[14px] font-semibold text-ink">
                  Support request submitted successfully
                </p>
                <p className="mt-0.5 text-[12.5px] text-ink-soft">
                  Our representative will contact you within 2 hours.
                </p>
                <p className="mt-1.5 text-[12.5px] text-ink-soft">
                  Support Ticket ID:{' '}
                  <span className="font-mono font-semibold text-ink">{submitted.id}</span>
                </p>
              </div>
            </div>
            <button
            type="button"
            aria-label="Dismiss confirmation"
            onClick={() => setSubmitted(null)}
            className="rounded-lg p-2 text-ink-muted transition-colors duration-150 ease-out hover:bg-white hover:text-ink">
            
              <XIcon size={16} aria-hidden="true" />
            </button>
          </section>
        }

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
          <SettingsCard
            title="Contact support"
            description="Raise a request and we will call you back.">
            
            <form onSubmit={submit}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field id="propertyName" label="Property name">
                  <TextInput
                    id="propertyName"
                    value={form.propertyName}
                    onChange={(e) => setForm({ ...form, propertyName: e.target.value })} />
                  
                </Field>
                <Field id="partnerName" label="Partner name">
                  <TextInput
                    id="partnerName"
                    value={form.partnerName}
                    onChange={(e) => setForm({ ...form, partnerName: e.target.value })} />
                  
                </Field>
                <Field id="mobile" label="Mobile number">
                  <TextInput
                    id="mobile"
                    type="tel"
                    value={form.mobile}
                    onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
                  
                </Field>
                <Field id="email" label="Email address">
                  <TextInput
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  
                </Field>
                <Field id="category" label="Issue category">
                  <Select
                    id="category"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    
                    {issueCategories.map((item) =>
                    <option key={item}>{item}</option>
                    )}
                  </Select>
                </Field>
                <Field id="subject" label="Subject">
                  <TextInput
                    id="subject"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Short summary of the issue"
                    required />
                  
                </Field>
                <Field
                  id="description"
                  label="Detailed description"
                  className="md:col-span-2"
                  hint="Include booking IDs, dates and what you already tried.">
                  
                  <TextArea
                    id="description"
                    rows={4}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required />
                  
                </Field>
              </div>

              <div className="mt-4">
                <p className="text-[13px] font-medium text-ink-soft">Attachments</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {attachments.map((file) =>
                  <span
                    key={file}
                    className="flex items-center gap-1.5 rounded-full bg-neutral-100 pl-3 pr-2 py-1.5 text-[12.5px] text-ink">
                    
                      <PaperclipIcon size={12} className="text-ink-muted" aria-hidden="true" />
                      {file}
                      <button
                      type="button"
                      aria-label={`Remove ${file}`}
                      onClick={() => setAttachments((prev) => prev.filter((item) => item !== file))}
                      className="rounded-full p-0.5 text-ink-muted transition-colors duration-150 ease-out hover:bg-neutral-200 hover:text-ink">
                      
                        <XIcon size={11} aria-hidden="true" />
                      </button>
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                    setAttachments((prev) => [...prev, `screenshot-${prev.length + 1}.png`])
                    }
                    className="flex items-center gap-1.5 rounded-xl border border-dashed border-neutral-300 px-3.5 py-2 text-[12.5px] font-medium text-ink transition-colors duration-150 ease-out hover:border-lime-400 hover:bg-lime-50">
                    
                    <PaperclipIcon size={13} aria-hidden="true" />
                    Add screenshot or document
                  </button>
                </div>
                <p className="mt-1.5 text-[11.5px] text-ink-muted">
                  Images, screenshots or PDFs up to 10 MB each.
                </p>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-neutral-100 pt-4">
                <button
                  type="submit"
                  className="rounded-xl bg-lime-300 px-5 py-2.5 text-[13.5px] font-semibold text-ink transition-colors duration-150 ease-out hover:bg-lime-200">
                  
                  Request a Callback
                </button>
                <p className="text-[12px] text-ink-muted">
                  A representative calls back within 2 hours, 24 × 7.
                </p>
              </div>
            </form>
          </SettingsCard>

          <SettingsCard
            title="Quick help"
            description="Answers to the questions partners ask most."
            bodyClassName="">
            
            <ul className="divide-y divide-neutral-100">
              {faqs.map((faq) => {
                const isOpen = openFaq === faq.id;
                return (
                  <li key={faq.id}>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                      className="flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left transition-colors duration-150 ease-out hover:bg-neutral-50">
                      
                      <span className="text-[13.5px] font-medium text-ink">{faq.question}</span>
                      <ChevronDownIcon
                        size={16}
                        aria-hidden="true"
                        className={`shrink-0 text-ink-muted transition-transform duration-150 ease-out ${
                        isOpen ? 'rotate-180' : ''}`
                        } />
                      
                    </button>
                    {isOpen &&
                    <p className="px-5 pb-4 text-[12.5px] leading-relaxed text-ink-soft">
                        {faq.answer}
                      </p>
                    }
                  </li>);

              })}
            </ul>
          </SettingsCard>
        </div>

        <SettingsCard
          title="Your tickets"
          description={`${counts.Open} open • ${counts['In Progress']} in progress • ${counts.Resolved} resolved`}
          bodyClassName=""
          action={
          <div className="flex flex-wrap gap-1.5">
              {(['All', 'Open', 'In Progress', 'Resolved'] as const).map((item) =>
            <button
              key={item}
              type="button"
              onClick={() => setStatusFilter(item)}
              className={[
              'rounded-lg px-3 py-1.5 text-[12.5px] transition-colors duration-150 ease-out',
              statusFilter === item ?
              'bg-ink font-semibold text-white' :
              'border border-neutral-200 font-medium text-ink-soft hover:border-neutral-300'].
              join(' ')}>
              
                  {item}
                </button>
            )}
            </div>
          }>
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="border-b border-neutral-200/80 bg-neutral-50/70">
                  {['Ticket ID', 'Issue category', 'Subject', 'Created date', 'Status', 'Assigned agent'].map(
                    (head) =>
                    <th
                      key={head}
                      scope="col"
                      className="whitespace-nowrap px-5 py-2.5 text-[12px] font-medium text-ink-muted">
                      
                        {head}
                      </th>

                  )}
                </tr>
              </thead>
              <tbody>
                {visible.map((ticket) =>
                <tr key={ticket.id} className="border-b border-neutral-100 last:border-0">
                    <td className="whitespace-nowrap px-5 py-3.5 font-mono text-[12.5px] font-semibold text-ink">
                      {ticket.id}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-[13px] text-ink-soft">
                      {ticket.category}
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-ink-soft">{ticket.subject}</td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-[13px] text-ink-muted">
                      {ticket.createdOn}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                      className={`inline-flex rounded-md px-2.5 py-1 text-[11px] font-semibold ${statusChip[ticket.status]}`}>
                      
                        {ticket.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-[13px] text-ink-soft">
                      {ticket.agent}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </SettingsCard>
      </div>
    </main>);

}