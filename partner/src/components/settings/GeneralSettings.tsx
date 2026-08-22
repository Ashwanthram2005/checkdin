import React, { useState } from 'react';
import { RefreshCwIcon, Trash2Icon } from 'lucide-react';
import { SettingsCard } from './SettingsCard';
import { Field, Select, TextInput } from './FormField';
import { Toggle } from './Toggle';
import { PROPERTY_LOGO } from '../../data/settings';

export function GeneralSettings() {
  const [propertyName, setPropertyName] = useState('Hotel Empire Stay');
  const [legalName, setLegalName] = useState('Empire Hospitality Pvt. Ltd.');
  const [timezone, setTimezone] = useState('Asia/Kolkata (GMT +5:30)');
  const [language, setLanguage] = useState('English (India)');
  const [currency, setCurrency] = useState('INR — Indian Rupee (₹)');
  const [autoAccept, setAutoAccept] = useState(true);
  const [maintenance, setMaintenance] = useState(false);

  return (
    <div className="space-y-5">
      <SettingsCard
        title="Property identity"
        description="This is how your property appears to guests across Checkdin.">
        
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex items-start gap-4">
            <img
              src={PROPERTY_LOGO}
              alt="Hotel Empire Stay logo"
              className="h-24 w-24 rounded-2xl border border-neutral-200 object-cover" />
            
            <div>
              <p className="text-[13px] font-medium text-ink-soft">Property logo</p>
              <p className="mt-1 text-[12px] text-ink-muted">Square PNG or JPG, at least 512px.</p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-[12.5px] font-medium text-ink transition-colors duration-150 ease-out hover:border-neutral-300">
                  
                  <RefreshCwIcon size={13} aria-hidden="true" />
                  Replace
                </button>
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-[12.5px] font-medium text-red-600 transition-colors duration-150 ease-out hover:border-red-300 hover:bg-red-50">
                  
                  <Trash2Icon size={13} aria-hidden="true" />
                  Remove
                </button>
              </div>
            </div>
          </div>

          <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
            <Field id="propertyName" label="Property name">
              <TextInput
                id="propertyName"
                value={propertyName}
                onChange={(e) => setPropertyName(e.target.value)} />
              
            </Field>
            <Field id="legalName" label="Registered legal name">
              <TextInput
                id="legalName"
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)} />
              
            </Field>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Regional preferences"
        description="Used for booking times, invoices and guest communication.">
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Field id="timezone" label="Timezone">
            <Select id="timezone" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
              <option>Asia/Kolkata (GMT +5:30)</option>
              <option>Asia/Dubai (GMT +4:00)</option>
              <option>Asia/Colombo (GMT +5:30)</option>
              <option>Asia/Singapore (GMT +8:00)</option>
            </Select>
          </Field>
          <Field id="language" label="Language">
            <Select id="language" value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option>English (India)</option>
              <option>Tamil</option>
              <option>Hindi</option>
              <option>Telugu</option>
            </Select>
          </Field>
          <Field id="currency" label="Currency" hint="Applies to rates, invoices and payouts.">
            <Select id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option>INR — Indian Rupee (₹)</option>
              <option>USD — US Dollar ($)</option>
              <option>AED — UAE Dirham (د.إ)</option>
            </Select>
          </Field>
        </div>
      </SettingsCard>

      <SettingsCard title="Booking behaviour" bodyClassName="px-5 py-1 divide-y divide-neutral-100">
        <Toggle
          checked={autoAccept}
          onChange={setAutoAccept}
          label="Auto-accept bookings"
          description="Confirm bookings instantly when a room is available." />
        
        <Toggle
          checked={maintenance}
          onChange={setMaintenance}
          label="Pause new bookings"
          description="Hide the property from search while you make changes." />
        
      </SettingsCard>
    </div>);

}