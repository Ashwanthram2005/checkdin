import React, { useState } from 'react';
import { ShieldCheckIcon } from 'lucide-react';
import { SettingsCard } from './SettingsCard';
import { Field, Select, TextInput } from './FormField';
import { Toggle } from './Toggle';
import { savedBankAccount } from '../../data/payouts';

export function PaymentsBanking() {
  const [ifsc, setIfsc] = useState(savedBankAccount.ifsc);
  const [frequency, setFrequency] = useState('Weekly — every Monday');
  const [threshold, setThreshold] = useState('₹ 5,000');
  const [autoPayout, setAutoPayout] = useState(true);
  const [invoiceEmail, setInvoiceEmail] = useState(true);

  const ifscValid = /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.trim());

  return (
    <div className="space-y-5">
      <SettingsCard
        title="Bank account"
        description="Settlements are credited to this account within 2 working days."
        action={
        <span className="inline-flex items-center gap-1.5 rounded-md bg-lime-100 px-2.5 py-1 text-[11px] font-semibold text-lime-600">
            <ShieldCheckIcon size={13} aria-hidden="true" />
            Verified
          </span>
        }>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field id="holderName" label="Account holder name">
            <TextInput id="holderName" defaultValue={savedBankAccount.holderName} />
          </Field>
          <Field id="bankName" label="Bank name">
            <TextInput id="bankName" defaultValue={savedBankAccount.bankName} />
          </Field>
          <Field id="accountNumber" label="Account number">
            <TextInput
              id="accountNumber"
              defaultValue={savedBankAccount.accountNumber}
              inputMode="numeric" />
            
          </Field>
          <Field
            id="ifsc"
            label="IFSC code"
            hint={ifscValid ? 'Branch: T. Nagar, Chennai' : 'Enter a valid 11-character IFSC code'}>
            
            <TextInput
              id="ifsc"
              value={ifsc}
              onChange={(e) => setIfsc(e.target.value.toUpperCase())}
              aria-invalid={!ifscValid}
              className={ifscValid ? '' : 'border-red-400 focus:border-red-500'} />
            
          </Field>
          <Field id="upi" label="UPI ID" hint="Used for instant withdrawals under ₹25,000.">
            <TextInput id="upi" defaultValue="empirestay@hdfcbank" />
          </Field>
          <Field id="gst" label="GST number" hint="15-character GSTIN registered to this property.">
            <TextInput id="gst" defaultValue="33AABCE1234F1Z5" />
          </Field>
        </div>
      </SettingsCard>

      <SettingsCard title="Payout preferences" description="Decide when and how you get paid.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field id="frequency" label="Payout frequency">
            <Select id="frequency" value={frequency} onChange={(e) => setFrequency(e.target.value)}>
              <option>Daily</option>
              <option>Weekly — every Monday</option>
              <option>Fortnightly</option>
              <option>Monthly — 1st of the month</option>
            </Select>
          </Field>
          <Field
            id="threshold"
            label="Minimum payout amount"
            hint="Balances below this roll over to the next cycle.">
            
            <Select id="threshold" value={threshold} onChange={(e) => setThreshold(e.target.value)}>
              <option>₹ 1,000</option>
              <option>₹ 5,000</option>
              <option>₹ 10,000</option>
              <option>₹ 25,000</option>
            </Select>
          </Field>
        </div>

        <div className="mt-2 divide-y divide-neutral-100">
          <Toggle
            checked={autoPayout}
            onChange={setAutoPayout}
            label="Automatic payouts"
            description="Release the available balance each cycle without manual approval." />
          
          <Toggle
            checked={invoiceEmail}
            onChange={setInvoiceEmail}
            label="Email settlement invoice"
            description="Send a GST invoice to stay@empirestay.in after every payout." />
          
        </div>
      </SettingsCard>
    </div>);

}