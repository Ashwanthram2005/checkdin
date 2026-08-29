import React, { useState } from 'react';
import { CheckCircle2Icon, SendIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { SettingsCard } from '../components/settings/SettingsCard';
import { Field, Select, TextArea, TextInput } from '../components/settings/FormField';
import { useAuth } from '../contexts/AuthContext';
import {
  audienceOptions,
  messageTemplates,
  sentMessages as seedSent,
  type SentMessage } from
'../data/operations';

export function GuestMessaging() {
  const { addAudit } = useAuth();
  const [templateId, setTemplateId] = useState(messageTemplates[0].id);
  const [subject, setSubject] = useState(messageTemplates[0].subject);
  const [body, setBody] = useState(messageTemplates[0].body);
  const [audience, setAudience] = useState<string>(audienceOptions[0]);
  const [sent, setSent] = useState<SentMessage[]>(seedSent);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  const applyTemplate = (id: string) => {
    const template = messageTemplates.find((item) => item.id === id);
    if (!template) return;
    setTemplateId(id);
    setSubject(template.subject);
    setBody(template.body);
  };

  const recipients = audience === 'Active guests' ? 14 : audience === 'Future guests' ? 212 : 6;

  return (
    <main className="scroll-slim h-full flex-1 overflow-y-auto bg-canvas px-7 py-6">
      <PageHeader
        title="Guest Messaging"
        subtitle="Reach guests in-house and upcoming without leaving PartnerOS." />
      

      <div className="mt-6 grid grid-cols-1 gap-5 pb-8 xl:grid-cols-[minmax(0,1fr)_380px]">
        <SettingsCard title="Compose a message" description="Start from a template or write your own.">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const message: SentMessage = {
                id: `m${Date.now()}`,
                subject,
                audience,
                recipients,
                sentAt: 'Just now',
                delivered: recipients,
                read: 0
              };
              setSent((prev) => [message, ...prev]);
              setConfirmation(`Sent to ${recipients} ${audience.toLowerCase()}`);
              window.setTimeout(() => setConfirmation(null), 3200);
              addAudit({
                action: 'Sent guest message',
                detail: `${subject} • ${audience} • ${recipients} recipients`,
                category: 'Operations'
              });
            }}>
            
            <div className="flex flex-wrap gap-2">
              {messageTemplates.map((template) =>
              <button
                key={template.id}
                type="button"
                onClick={() => applyTemplate(template.id)}
                className={[
                'rounded-lg px-3.5 py-2 text-[12.5px] transition-colors duration-150 ease-out',
                templateId === template.id ?
                'bg-ink font-semibold text-white' :
                'border border-neutral-200 font-medium text-ink-soft hover:border-neutral-300'].
                join(' ')}>
                
                  {template.label}
                </button>
              )}
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field id="audience" label="Recipients" hint={`${recipients} guests match`}>
                <Select
                  id="audience"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}>
                  
                  {audienceOptions.map((option) =>
                  <option key={option}>{option}</option>
                  )}
                </Select>
              </Field>
              <Field id="subject" label="Subject">
                <TextInput
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required />
                
              </Field>
              <Field id="body" label="Message" className="md:col-span-2">
                <TextArea
                  id="body"
                  rows={5}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  required />
                
              </Field>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-neutral-100 pt-4">
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-xl bg-lime-300 px-5 py-2.5 text-[13.5px] font-semibold text-ink transition-colors duration-150 ease-out hover:bg-lime-200">
                
                <SendIcon size={15} aria-hidden="true" />
                Send message
              </button>
              {confirmation &&
              <p
                role="status"
                className="flex items-center gap-1.5 text-[13px] font-medium text-forest">
                
                  <CheckCircle2Icon size={15} aria-hidden="true" />
                  {confirmation}
                </p>
              }
            </div>
          </form>
        </SettingsCard>

        <SettingsCard title="Sent" description="Delivery and read tracking." bodyClassName="">
          <ul className="divide-y divide-neutral-100">
            {sent.map((message) =>
            <li key={message.id} className="px-5 py-4">
                <p className="text-[13.5px] font-medium text-ink">{message.subject}</p>
                <p className="mt-0.5 text-[12px] text-ink-muted">
                  {message.audience} • {message.recipients} recipients • {message.sentAt}
                </p>
                <div className="mt-2.5 flex items-center gap-4">
                  <span className="text-[12px] text-ink-soft">
                    <span className="font-semibold text-ink">{message.delivered}</span> delivered
                  </span>
                  <span className="text-[12px] text-ink-soft">
                    <span className="font-semibold text-ink">{message.read}</span> read
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
                  <div
                  className="h-full rounded-full bg-lime-400"
                  style={{
                    width: `${Math.round(message.read / Math.max(1, message.recipients) * 100)}%`
                  }} />
                
                </div>
              </li>
            )}
          </ul>
        </SettingsCard>
      </div>
    </main>);

}