import React, { useState } from 'react';
import { CheckCircle2Icon, CheckIcon, PlusIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { SettingsCard } from '../components/settings/SettingsCard';
import { Field, Select, TextArea } from '../components/settings/FormField';
import { Toggle } from '../components/settings/Toggle';
import {
  acceptedIds,
  cancellationTiers,
  defaultAcceptedIds,
  houseRules as initialRules } from
'../data/policies';

const refundTone = {
  good: 'bg-lime-100 text-lime-600',
  warn: 'bg-amber-50 text-amber-700',
  bad: 'bg-red-50 text-red-600'
};

export function RulesPolicies() {
  const [rules, setRules] = useState(initialRules);
  const [ids, setIds] = useState<string[]>(defaultAcceptedIds);
  const [notes, setNotes] = useState(
    'Guests must present the same ID used at booking. Rooms are handed over after a housekeeping check, and any damage is billed at actual cost.'
  );
  const [saved, setSaved] = useState(false);

  const toggleRule = (id: string) => {
    setSaved(false);
    setRules((prev) =>
    prev.map((rule) => rule.id === id ? { ...rule, enabled: !rule.enabled } : rule)
    );
  };

  const toggleId = (name: string) => {
    setSaved(false);
    setIds((prev) => prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]);
  };

  return (
    <main className="scroll-slim h-full flex-1 overflow-y-auto bg-canvas px-7 py-6">
      <PageHeader
        title="Rules & Policies"
        subtitle="What guests agree to when they book a slot at your property." />
      

      <div className="mt-6 space-y-5 pb-28">
        <SettingsCard title="Slot & check-in rules" description="Applies to every hourly booking.">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Field id="minAge" label="Minimum guest age">
              <Select id="minAge" defaultValue="18 years">
                <option>18 years</option>
                <option>21 years</option>
                <option>No restriction</option>
              </Select>
            </Field>
            <Field
              id="buffer"
              label="Buffer between slots"
              hint="Time reserved for housekeeping.">
              
              <Select id="buffer" defaultValue="30 minutes">
                <option>15 minutes</option>
                <option>30 minutes</option>
                <option>45 minutes</option>
                <option>60 minutes</option>
              </Select>
            </Field>
            <Field id="grace" label="Late check-out grace" hint="Beyond this, one extra hour is charged.">
              <Select id="grace" defaultValue="15 minutes">
                <option>No grace</option>
                <option>15 minutes</option>
                <option>30 minutes</option>
              </Select>
            </Field>
          </div>
        </SettingsCard>

        <SettingsCard
          title="Accepted ID proofs"
          description={`${ids.length} of ${acceptedIds.length} accepted at the front desk`}>
          
          <ul className="flex flex-wrap gap-2">
            {acceptedIds.map((name) => {
              const isOn = ids.includes(name);
              return (
                <li key={name}>
                  <button
                    type="button"
                    aria-pressed={isOn}
                    onClick={() => toggleId(name)}
                    className={[
                    'flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] transition-colors duration-150 ease-out',
                    isOn ?
                    'border-ink bg-ink font-medium text-white' :
                    'border-neutral-200 text-ink-soft hover:border-neutral-300'].
                    join(' ')}>
                    
                    {isOn ? <CheckIcon size={13} aria-hidden="true" /> : <PlusIcon size={13} aria-hidden="true" />}
                    {name}
                  </button>
                </li>);

            })}
          </ul>
        </SettingsCard>

        <SettingsCard title="House rules" bodyClassName="px-5 py-1 divide-y divide-neutral-100">
          {rules.map((rule) =>
          <Toggle
            key={rule.id}
            checked={rule.enabled}
            onChange={() => toggleRule(rule.id)}
            label={rule.label}
            description={rule.description} />

          )}
        </SettingsCard>

        <SettingsCard
          title="Cancellation policy"
          description="Refunds are processed to the original payment method within 5 working days."
          bodyClassName="divide-y divide-neutral-100">
          
          {cancellationTiers.map((tier) =>
          <div
            key={tier.id}
            className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 first:pt-0 last:pb-0">
            
              <p className="text-[13.5px] text-ink-soft">{tier.window}</p>
              <span
              className={`rounded-md px-2.5 py-1 text-[11.5px] font-semibold ${refundTone[tier.tone]}`}>
              
                {tier.refund}
              </span>
            </div>
          )}
        </SettingsCard>

        <SettingsCard
          title="Additional policy notes"
          description="Shown on the booking confirmation and your listing page.">
          
          <Field id="notes" label="Notes for guests" hint={`${notes.length} / 500 characters`}>
            <TextArea
              id="notes"
              rows={4}
              maxLength={500}
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                setSaved(false);
              }} />
            
          </Field>
        </SettingsCard>
      </div>

      <div className="sticky bottom-0 -mx-7 border-t border-neutral-200 bg-white/95 px-7 py-3.5 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[13px] text-ink-muted">
            Policy changes apply to new bookings only — existing bookings keep their original terms.
          </p>
          <div className="flex items-center gap-3">
            {saved &&
            <p role="status" className="flex items-center gap-1.5 text-[13px] font-medium text-forest">
                <CheckCircle2Icon size={15} aria-hidden="true" />
                Policies updated
              </p>
            }
            <button
              type="button"
              onClick={() => setSaved(true)}
              className="rounded-xl bg-lime-300 px-5 py-2.5 text-[13.5px] font-semibold text-ink transition-colors duration-150 ease-out hover:bg-lime-200">
              
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </main>);

}