import React, { useState } from 'react';
import { CheckCircle2Icon } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input, Label, Select, Textarea, Toggle } from '../components/ui/Field';
import { Tabs } from '../components/ui/Tabs';
import { api } from '../services/api';

const tabs = ['Commission', 'Taxes', 'Payment gateways', 'Notification providers', 'General'];

const gateways = [
{ name: 'Razorpay', mode: 'Primary', share: '72% of volume', status: 'Active' },
{ name: 'PayU', mode: 'Failover', share: '19% of volume', status: 'Active' },
{ name: 'UPI Intent (NPCI)', mode: 'Direct', share: '9% of volume', status: 'Active' },
{ name: 'Stripe', mode: 'International cards', share: '—', status: 'Disabled' }];


const providers = [
{ name: 'Kaleyra', channel: 'SMS', sender: 'CHKDIN', status: 'Active' },
{ name: 'Meta Cloud API', channel: 'WhatsApp', sender: '+91 89000 11223', status: 'Active' },
{ name: 'Amazon SES', channel: 'Email', sender: 'no-reply@checkdin.in', status: 'Active' },
{ name: 'Firebase FCM', channel: 'Push', sender: 'checkdin-app', status: 'Active' }];


export function Settings() {
  const [tab, setTab] = useState('Commission');
  const [tieredCommission, setTieredCommission] = useState(true);
  const [autoPayouts, setAutoPayouts] = useState(true);
  const [maintenance, setMaintenance] = useState(false);

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Platform-wide commercial terms, gateways, and operational defaults."
        actions={
        <Button variant="primary" icon={CheckCircle2Icon} onClick={() => api.mutate('settings.save', { tab })}>
            Save changes
          </Button>
        } />
      

      <Card>
        <Tabs tabs={tabs} value={tab} onChange={setTab} />

        {tab === 'Commission' ?
        <div className="max-w-2xl space-y-5 px-5 py-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="default-commission">Default commission (%)</Label>
                <Input id="default-commission" type="number" defaultValue={12} />
              </div>
              <div>
                <Label htmlFor="min-commission">Minimum commission (₹)</Label>
                <Input id="min-commission" type="number" defaultValue={75} />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-line px-4 py-3.5">
              <div>
                <p className="text-[13px] font-semibold text-ink">Tiered commission by monthly GMV</p>
                <p className="text-xs text-muted">High-volume partners automatically move to a lower take rate.</p>
              </div>
              <Toggle checked={tieredCommission} onChange={setTieredCommission} label="Tiered commission" />
            </div>
            {tieredCommission ?
          <ul className="divide-y divide-line rounded-xl border border-line">
                {[
            { tier: 'Up to ₹5L monthly GMV', rate: '14%' },
            { tier: '₹5L – ₹20L monthly GMV', rate: '12%' },
            { tier: '₹20L – ₹50L monthly GMV', rate: '10%' },
            { tier: 'Above ₹50L monthly GMV', rate: '8.5%' }].
            map((tier) =>
            <li key={tier.tier} className="flex items-center justify-between px-4 py-3">
                    <span className="text-[13px] text-ink">{tier.tier}</span>
                    <span className="text-[13px] font-semibold tabular-nums text-ink">{tier.rate}</span>
                  </li>
            )}
              </ul> :
          null}
            <div>
              <Label htmlFor="cancellation-fee">Platform cancellation fee (%)</Label>
              <Input id="cancellation-fee" type="number" defaultValue={2} />
            </div>
          </div> :
        null}

        {tab === 'Taxes' ?
        <div className="max-w-2xl space-y-5 px-5 py-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="gst-below">GST — tariff below ₹7,500 (%)</Label>
                <Input id="gst-below" type="number" defaultValue={12} />
              </div>
              <div>
                <Label htmlFor="gst-above">GST — tariff ₹7,500 and above (%)</Label>
                <Input id="gst-above" type="number" defaultValue={18} />
              </div>
              <div>
                <Label htmlFor="tcs">TCS on partner payouts (%)</Label>
                <Input id="tcs" type="number" step={0.1} defaultValue={1} />
              </div>
              <div>
                <Label htmlFor="tds">TDS section</Label>
                <Select id="tds" options={['194-O (e-commerce operator)', '194-C', 'Not applicable']} />
              </div>
            </div>
            <div>
              <Label htmlFor="gstin">Platform GSTIN</Label>
              <Input id="gstin" defaultValue="33AABCC1234D1Z9" />
            </div>
            <div>
              <Label htmlFor="invoice-note">Invoice footer note</Label>
              <Textarea
              id="invoice-note"
              rows={2}
              defaultValue="Checkdin acts as a booking facilitator. Tax invoice issued on behalf of the property partner." />
            
            </div>
          </div> :
        null}

        {tab === 'Payment gateways' ?
        <ul className="divide-y divide-line">
            {gateways.map((gateway) =>
          <li key={gateway.name} className="flex flex-wrap items-center gap-3 px-5 py-4">
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-ink">{gateway.name}</p>
                  <p className="text-xs text-muted">
                    {gateway.mode} · {gateway.share}
                  </p>
                </div>
                <Badge>{gateway.status}</Badge>
                <Button size="sm" variant="ghost">
                  Configure
                </Button>
              </li>
          )}
          </ul> :
        null}

        {tab === 'Notification providers' ?
        <ul className="divide-y divide-line">
            {providers.map((provider) =>
          <li key={provider.name} className="flex flex-wrap items-center gap-3 px-5 py-4">
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-ink">{provider.name}</p>
                  <p className="text-xs text-muted">
                    {provider.channel} · sender {provider.sender}
                  </p>
                </div>
                <Badge>{provider.status}</Badge>
                <Button size="sm" variant="ghost">
                  Configure
                </Button>
              </li>
          )}
          </ul> :
        null}

        {tab === 'General' ?
        <div className="max-w-2xl space-y-5 px-5 py-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="brand">Platform name</Label>
                <Input id="brand" defaultValue="Checkdin" />
              </div>
              <div>
                <Label htmlFor="support-email">Support email</Label>
                <Input id="support-email" type="email" defaultValue="help@checkdin.in" />
              </div>
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Select id="timezone" options={['Asia/Kolkata (IST)', 'Asia/Dubai', 'UTC']} />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select id="currency" options={['INR — Indian Rupee', 'AED — UAE Dirham']} />
              </div>
              <div>
                <Label htmlFor="checkin-time">Default check-in time</Label>
                <Input id="checkin-time" type="time" defaultValue="14:00" />
              </div>
              <div>
                <Label htmlFor="checkout-time">Default check-out time</Label>
                <Input id="checkout-time" type="time" defaultValue="11:00" />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-line px-4 py-3.5">
              <div>
                <p className="text-[13px] font-semibold text-ink">Automatic payout cycles</p>
                <p className="text-xs text-muted">Settle verified partners on the 1st and 16th without manual approval.</p>
              </div>
              <Toggle checked={autoPayouts} onChange={setAutoPayouts} label="Automatic payouts" />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-negative/30 bg-negative/[0.05] px-4 py-3.5">
              <div>
                <p className="text-[13px] font-semibold text-ink">Maintenance mode</p>
                <p className="text-xs text-muted">Guests see a maintenance page and new bookings are blocked.</p>
              </div>
              <Toggle checked={maintenance} onChange={setMaintenance} label="Maintenance mode" />
            </div>
          </div> :
        null}
      </Card>
    </div>);

}