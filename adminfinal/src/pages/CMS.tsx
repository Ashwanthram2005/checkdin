import React, { useState } from 'react';
import { GripVerticalIcon, ImageIcon, PlusIcon, StarIcon } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input, Label, Select, Textarea, Toggle } from '../components/ui/Field';
import { Tabs } from '../components/ui/Tabs';
import { StackedCell } from '../components/ui/Cells';
import { cmsBanners, cmsCities } from '../data/engagement';
import { properties } from '../data/properties';
import { formatNumber } from '../utils/format';
import { api } from '../services/api';

const tabs = ['Banners', 'Featured properties', 'Cities', 'Promotions', 'SEO'];

export function CMS() {
  const [tab, setTab] = useState('Banners');
  const [featured, setFeatured] = useState<string[]>(['PRP-1001', 'PRP-1006', 'PRP-1009']);
  const [indexing, setIndexing] = useState(true);

  return (
    <div>
      <PageHeader
        title="CMS"
        subtitle="Everything the marketing site renders: banners, featured inventory, city pages, and SEO."
        actions={
        <Button variant="primary" icon={PlusIcon} onClick={() => api.mutate('cms.create', { tab })}>
            New {tab === 'SEO' ? 'rule' : tab.toLowerCase().replace(/s$/, '')}
          </Button>
        } />
      

      <Card>
        <Tabs tabs={tabs} value={tab} onChange={setTab} />

        {tab === 'Banners' ?
        <ul className="divide-y divide-line">
            {cmsBanners.map((banner) =>
          <li key={banner.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                <GripVerticalIcon className="h-4 w-4 shrink-0 cursor-grab text-muted" />
                <span className="flex h-10 w-14 shrink-0 items-center justify-center rounded-md bg-faint text-muted">
                  <ImageIcon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-ink">{banner.title}</p>
                  <p className="text-xs text-muted">
                    {banner.placement} · {banner.cities}
                  </p>
                </div>
                <StackedCell
              align="right"
              primary={<span className="tabular-nums">{formatNumber(banner.clicks)}</span>}
              secondary="clicks" />
            
                <Badge>{banner.status}</Badge>
                <Button size="sm" variant="ghost">
                  Edit
                </Button>
              </li>
          )}
          </ul> :
        null}

        {tab === 'Featured properties' ?
        <div className="px-5 py-5">
            <p className="mb-4 text-[13px] text-muted">
              Featured properties appear in the homepage carousel in the order selected. Maximum of six.
            </p>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {properties.map((property) => {
              const isFeatured = featured.includes(property.id);
              return (
                <li
                  key={property.id}
                  className={`overflow-hidden rounded-xl border ${isFeatured ? 'border-accent' : 'border-line'}`}>
                  
                    <img src={property.images[0]} alt="" className="h-28 w-full object-cover" />
                    <div className="flex items-center gap-2.5 px-3.5 py-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold text-ink">{property.name}</p>
                        <p className="truncate text-xs text-muted">
                          {property.city} · {property.rating}★
                        </p>
                      </div>
                      <button
                      aria-label={isFeatured ? `Remove ${property.name} from featured` : `Feature ${property.name}`}
                      onClick={() =>
                      setFeatured((prev) =>
                      prev.includes(property.id) ?
                      prev.filter((id) => id !== property.id) :
                      [...prev, property.id].slice(0, 6)
                      )
                      }
                      className={`rounded-lg border p-1.5 transition-colors duration-150 ease-smooth ${
                      isFeatured ? 'border-accent bg-accent text-accent-ink' : 'border-line text-muted hover:bg-faint'}`
                      }>
                      
                        <StarIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </li>);

            })}
            </ul>
          </div> :
        null}

        {tab === 'Cities' ?
        <ul className="divide-y divide-line">
            {cmsCities.map((city) =>
          <li key={city.name} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-ink">{city.name}</p>
                  <p className="truncate text-xs text-muted">{city.seoTitle}</p>
                </div>
                <span className="text-[13px] tabular-nums text-muted">{city.properties} properties</span>
                {city.featured ? <Badge tone="accent">Featured</Badge> : null}
                <Badge tone={city.status === 'Live' ? 'positive' : 'neutral'}>{city.status}</Badge>
                <Button size="sm" variant="ghost">
                  Edit
                </Button>
              </li>
          )}
          </ul> :
        null}

        {tab === 'Promotions' ?
        <div className="grid grid-cols-1 gap-6 px-5 py-5 lg:grid-cols-2">
            <div className="space-y-4">
              <div>
                <Label htmlFor="promo-title">Promotion title</Label>
                <Input id="promo-title" placeholder="Diwali long weekend — up to 25% off" />
              </div>
              <div>
                <Label htmlFor="promo-copy">Body copy</Label>
                <Textarea id="promo-copy" rows={3} placeholder="Shown on the homepage strip and city pages." />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="promo-from">Live from</Label>
                  <Input id="promo-from" type="date" />
                </div>
                <div>
                  <Label htmlFor="promo-to">Live until</Label>
                  <Input id="promo-to" type="date" />
                </div>
              </div>
              <div>
                <Label htmlFor="promo-cities">Cities</Label>
                <Select id="promo-cities" options={['All cities', 'Chennai', 'Bengaluru', 'Mumbai', 'Goa']} />
              </div>
              <Button variant="primary" onClick={() => api.mutate('cms.savePromotion')}>
                Publish promotion
              </Button>
            </div>
            <div className="rounded-xl border border-line bg-faint p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Preview</p>
              <div className="mt-3 rounded-xl border border-line bg-card p-5">
                <Badge tone="accent">Limited time</Badge>
                <h3 className="mt-2.5 text-xl font-bold tracking-tight text-ink">
                  Diwali long weekend — up to 25% off
                </h3>
                <p className="mt-1.5 text-[13px] text-muted">
                  Book any Checkdin stay between 08–16 Nov and save on hourly and overnight slots.
                </p>
                <Button variant="primary" size="sm" className="mt-4">
                  Explore stays
                </Button>
              </div>
            </div>
          </div> :
        null}

        {tab === 'SEO' ?
        <div className="max-w-2xl space-y-5 px-5 py-5">
            <div>
              <Label htmlFor="seo-title">Default title template</Label>
              <Input id="seo-title" defaultValue="{{city}} hotels by the hour & night | Checkdin" />
            </div>
            <div>
              <Label htmlFor="seo-desc">Default meta description</Label>
              <Textarea
              id="seo-desc"
              rows={3}
              defaultValue="Book verified hotels and short stays in {{city}} from 3 hours to a full night. Free cancellation on most stays." />
            
            </div>
            <div>
              <Label htmlFor="seo-canonical">Canonical domain</Label>
              <Input id="seo-canonical" defaultValue="https://www.checkdin.in" />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-line px-4 py-3.5">
              <div>
                <p className="text-[13px] font-semibold text-ink">Allow search engine indexing</p>
                <p className="text-xs text-muted">Turning this off adds a site-wide noindex tag.</p>
              </div>
              <Toggle checked={indexing} onChange={setIndexing} label="Allow indexing" />
            </div>
            <Button variant="primary" onClick={() => api.mutate('cms.saveSeo')}>
              Save SEO settings
            </Button>
          </div> :
        null}
      </Card>
    </div>);

}