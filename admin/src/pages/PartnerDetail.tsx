import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, BanIcon, CheckIcon, KeyRoundIcon, MailIcon, PhoneIcon } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';
import { Avatar, DefinitionList } from '../components/ui/Primitives';
import { DataTable, type Column } from '../components/ui/DataTable';
import { MonoCell, StackedCell } from '../components/ui/Cells';
import { BlockSkeleton, ErrorState } from '../components/ui/LoadingState';
import { RevenueBreakdownChart } from '../components/charts/Charts';
import { useMockQuery } from '../hooks/useMockQuery';
import { api } from '../services/api';
import { payouts } from '../data/finance';
import { properties } from '../data/properties';
import { monthlyRevenue } from '../data/finance';
import { formatCurrency, formatDate } from '../utils/format';
import type { Payout } from '../types';

const tabs = ['KYC & bank', 'Properties', 'Payout history', 'Revenue analytics'];

export function PartnerDetail() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data: partner, loading, error } = useMockQuery(() => api.getPartner(id), [id]);
  const [tab, setTab] = useState('KYC & bank');

  if (loading) {
    return (
      <div className="space-y-4">
        <BlockSkeleton className="h-24" />
        <BlockSkeleton className="h-72" />
      </div>);

  }

  if (error || !partner) {
    return (
      <Card>
        <ErrorState message={error ?? `We could not find partner ${id}.`} onRetry={() => navigate('/partners')} />
      </Card>);

  }

  const partnerProperties = properties.filter((property) => property.partnerId === partner.id);
  const partnerPayouts = payouts.filter((payout) => payout.partnerId === partner.id);

  const payoutColumns: Column<Payout>[] = [
  { key: 'ref', header: 'Reference', render: (row) => <MonoCell>{row.reference}</MonoCell>, sortValue: (row) => row.reference },
  { key: 'period', header: 'Period', render: (row) => row.period, sortValue: (row) => row.period, hideBelow: 'sm' },
  {
    key: 'net',
    header: 'Net payout',
    align: 'right',
    render: (row) => <span className="font-semibold tabular-nums text-ink">{formatCurrency(row.net)}</span>,
    sortValue: (row) => row.net
  },
  {
    key: 'commission',
    header: 'Commission',
    align: 'right',
    render: (row) => <span className="tabular-nums text-muted">{formatCurrency(row.commission)}</span>,
    sortValue: (row) => row.commission,
    hideBelow: 'md'
  },
  { key: 'status', header: 'Status', align: 'right', render: (row) => <Badge>{row.status}</Badge>, sortValue: (row) => row.status }];


  return (
    <div>
      <Link
        to="/partners"
        className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-muted transition-colors duration-150 ease-smooth hover:text-ink">
        
        <ArrowLeftIcon className="h-3.5 w-3.5" /> All partners
      </Link>

      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <Avatar name={partner.name} size="lg" />
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-ink">{partner.name}</h1>
              <Badge>{partner.status}</Badge>
            </div>
            <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
              <span>{partner.company}</span>
              <span className="inline-flex items-center gap-1">
                <MailIcon className="h-3.5 w-3.5" /> {partner.email}
              </span>
              <span className="inline-flex items-center gap-1">
                <PhoneIcon className="h-3.5 w-3.5" /> {partner.phone}
              </span>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button icon={KeyRoundIcon} onClick={() => api.mutate('partner.resetPassword', { id })}>
            Reset password
          </Button>
          {partner.status === 'Active' ?
          <Button variant="danger" icon={BanIcon} onClick={() => api.mutate('partner.suspend', { id })}>
              Suspend
            </Button> :

          <Button variant="primary" icon={CheckIcon} onClick={() => api.mutate('partner.activate', { id })}>
              {partner.status === 'Pending KYC' ? 'Approve KYC' : 'Activate'}
            </Button>
          }
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
        { label: 'Properties', value: String(partner.properties) },
        { label: 'Lifetime revenue', value: formatCurrency(partner.revenue, true) },
        { label: 'Commission rate', value: `${partner.commissionRate}%` },
        {
          label: 'Pending payouts',
          value: formatCurrency(
            partnerPayouts.filter((payout) => payout.status === 'Pending').reduce((sum, payout) => sum + payout.net, 0),
            true
          )
        }].
        map((stat) =>
        <Card key={stat.label} className="px-5 py-4">
            <p className="text-[13px] font-medium text-muted">{stat.label}</p>
            <p className="mt-0.5 text-2xl font-bold tracking-tight text-ink">{stat.value}</p>
          </Card>
        )}
      </div>

      <Card className="mt-4">
        <Tabs tabs={tabs} value={tab} onChange={setTab} />

        {tab === 'KYC & bank' ?
        <div className="grid grid-cols-1 gap-6 px-5 py-5 lg:grid-cols-2">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-ink">KYC documents</h3>
              <DefinitionList
              columns={1}
              items={[
              {
                label: 'PAN',
                value:
                <span className="flex items-center gap-2">
                        <span className="font-mono">{partner.kyc.pan}</span>
                        <Badge>{partner.kyc.panStatus}</Badge>
                      </span>

              },
              {
                label: 'GSTIN',
                value:
                <span className="flex items-center gap-2">
                        <span className="font-mono">{partner.kyc.gst}</span>
                        <Badge>{partner.kyc.gstStatus}</Badge>
                      </span>

              },
              { label: 'Onboarded', value: formatDate(partner.joinedAt) }]
              } />
            
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-ink">Bank account</h3>
              <DefinitionList
              columns={1}
              items={[
              { label: 'Bank', value: partner.kyc.bankName },
              { label: 'Account number', value: <span className="font-mono">{partner.kyc.accountNumber}</span> },
              { label: 'IFSC', value: <span className="font-mono">{partner.kyc.ifsc}</span> },
              { label: 'Verification', value: <Badge>{partner.kyc.bankStatus}</Badge> }]
              } />
            
            </div>
          </div> :
        null}

        {tab === 'Properties' ?
        <ul className="divide-y divide-line">
            {partnerProperties.map((property) =>
          <li key={property.id} className="flex items-center gap-3 px-5 py-3.5">
                <img src={property.images[0]} alt="" className="h-10 w-14 shrink-0 rounded-md object-cover" />
                <div className="min-w-0 flex-1">
                  <Link to={`/properties/${property.id}`} className="truncate text-[13px] font-semibold text-ink hover:underline">
                    {property.name}
                  </Link>
                  <p className="text-xs text-muted">
                    {property.city} · {property.rooms} rooms · {property.occupancy}% occupancy
                  </p>
                </div>
                <StackedCell
              align="right"
              primary={<span className="font-semibold tabular-nums">{formatCurrency(property.revenue, true)}</span>}
              secondary="lifetime" />
            
                <Badge>{property.status}</Badge>
              </li>
          )}
          </ul> :
        null}

        {tab === 'Payout history' ?
        <DataTable
          columns={payoutColumns}
          rows={partnerPayouts}
          rowKey={(row) => row.id}
          pageSize={6}
          emptyLabel="No payouts raised yet" /> :

        null}

        {tab === 'Revenue analytics' ?
        <div className="px-2 py-5">
            <RevenueBreakdownChart data={monthlyRevenue} />
          </div> :
        null}
      </Card>
    </div>);

}