import React, { useMemo, useState } from 'react';
import { EyeOffIcon, MessageSquareIcon, StarIcon, Trash2Icon } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { PageHeader, Toolbar } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Label, SearchInput, Select, Textarea } from '../components/ui/Field';
import { Tabs } from '../components/ui/Tabs';
import { Avatar, EmptyState, ProgressBar } from '../components/ui/Primitives';
import { Modal } from '../components/ui/Modal';
import { TableSkeleton, ErrorState } from '../components/ui/LoadingState';
import { useMockQuery } from '../hooks/useMockQuery';
import { api } from '../services/api';
import { formatDate } from '../utils/format';
import type { Review } from '../types';

const tabs = ['All', 'Published', 'Flagged', 'Hidden'];
const ratingOptions = ['All ratings', '5 star', '4 star', '3 star', '2 star', '1 star'];

export function Reviews() {
  const { data, loading, error } = useMockQuery(api.getReviews, []);
  const [tab, setTab] = useState('All');
  const [query, setQuery] = useState('');
  const [rating, setRating] = useState('All ratings');
  const [responding, setResponding] = useState<Review | null>(null);

  const reviews = data ?? [];

  const counts = useMemo(() => {
    const result: Record<string, number> = { All: reviews.length };
    tabs.slice(1).forEach((status) => {
      result[status] = reviews.filter((review) => review.status === status).length;
    });
    return result;
  }, [reviews]);

  const rows = useMemo(
    () =>
    reviews.filter((review) => {
      if (tab !== 'All' && review.status !== tab) return false;
      if (rating !== 'All ratings' && review.rating !== Number(rating[0])) return false;
      if (!query) return true;
      const needle = query.toLowerCase();
      return (
        review.propertyName.toLowerCase().includes(needle) ||
        review.customerName.toLowerCase().includes(needle) ||
        review.title.toLowerCase().includes(needle));

    }),
    [reviews, tab, rating, query]
  );

  const average = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((review) => review.rating === star).length
  }));

  return (
    <div>
      <PageHeader
        title="Reviews"
        subtitle="Guest feedback across properties, with moderation and partner responses." />
      

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
        <Card>
          <Tabs tabs={tabs} value={tab} onChange={setTab} counts={counts} />
          <Toolbar>
            <SearchInput
              className="sm:max-w-xs sm:flex-1"
              placeholder="Search property, guest, headline…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search reviews" />
            
            <div className="sm:ml-auto">
              <Select options={ratingOptions} value={rating} onChange={(event) => setRating(event.target.value)} aria-label="Filter by rating" />
            </div>
          </Toolbar>

          {loading ?
          <TableSkeleton rows={5} /> :
          error ?
          <ErrorState message={error} /> :
          rows.length === 0 ?
          <EmptyState
            icon={MessageSquareIcon}
            title="No reviews match these filters"
            description="Try clearing the rating filter or switching moderation status." /> :


          <ul className="divide-y divide-line">
              {rows.map((review) =>
            <li key={review.id} className="px-5 py-4">
                  <div className="flex items-start gap-3">
                    <Avatar name={review.customerName} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="flex items-center gap-1 rounded-md bg-faint px-1.5 py-0.5 text-xs font-semibold text-ink">
                          <StarIcon className="h-3 w-3 text-warning" /> {review.rating}.0
                        </span>
                        <p className="text-sm font-semibold text-ink">{review.title}</p>
                        <Badge>{review.status}</Badge>
                        <span className="ml-auto text-xs text-muted">{formatDate(review.createdAt)}</span>
                      </div>
                      <p className="mt-1.5 text-[13px] text-muted">{review.body}</p>
                      <p className="mt-1.5 text-xs text-muted">
                        {review.customerName} · {review.propertyName}
                      </p>
                      {review.response ?
                  <div className="mt-3 rounded-lg border border-line bg-faint px-3 py-2.5">
                          <p className="text-xs font-semibold text-ink">Partner response</p>
                          <p className="mt-0.5 text-[13px] text-muted">{review.response}</p>
                        </div> :
                  null}
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button size="sm" icon={MessageSquareIcon} onClick={() => setResponding(review)}>
                          Respond
                        </Button>
                        <Button size="sm" icon={EyeOffIcon} onClick={() => api.mutate('review.hide', { id: review.id })}>
                          {review.status === 'Hidden' ? 'Unhide' : 'Hide'}
                        </Button>
                        <Button size="sm" variant="danger" icon={Trash2Icon} onClick={() => api.mutate('review.delete', { id: review.id })}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </li>
            )}
            </ul>
          }
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Rating summary" subtitle="Across all published reviews" />
            <div className="px-5 py-5">
              <p className="flex items-baseline gap-2">
                <span className="text-4xl font-bold tracking-tight text-ink">{average.toFixed(1)}</span>
                <span className="text-[13px] text-muted">from {reviews.length} reviews</span>
              </p>
              <ul className="mt-4 space-y-2.5">
                {distribution.map((item) =>
                <li key={item.star} className="flex items-center gap-2.5">
                    <span className="w-8 text-xs font-medium text-muted">{item.star}★</span>
                    <ProgressBar
                    value={reviews.length ? item.count / reviews.length * 100 : 0}
                    label={String(item.count)} />
                  
                  </li>
                )}
              </ul>
            </div>
          </Card>

          <Card>
            <CardHeader title="Needs moderation" subtitle="Flagged by guests or automated checks" />
            <ul className="divide-y divide-line">
              {reviews.
              filter((review) => review.status !== 'Published').
              map((review) =>
              <li key={review.id} className="px-5 py-3.5">
                    <p className="text-[13px] font-semibold text-ink">{review.title}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {review.propertyName} · {review.rating}★
                    </p>
                  </li>
              )}
            </ul>
          </Card>
        </div>
      </div>

      <Modal
        open={Boolean(responding)}
        onClose={() => setResponding(null)}
        title="Respond to review"
        description={responding ? `${responding.customerName} · ${responding.propertyName}` : undefined}
        footer={
        <>
            <Button onClick={() => setResponding(null)}>Cancel</Button>
            <Button
            variant="primary"
            onClick={() => {
              api.mutate('review.respond', { id: responding?.id });
              setResponding(null);
            }}>
            
              Publish response
            </Button>
          </>
        }>
        
        <div className="space-y-4">
          <div className="rounded-lg border border-line bg-faint px-3 py-2.5">
            <p className="text-[13px] font-semibold text-ink">{responding?.title}</p>
            <p className="mt-0.5 text-[13px] text-muted">{responding?.body}</p>
          </div>
          <div>
            <Label htmlFor="response">Your response</Label>
            <Textarea id="response" defaultValue={responding?.response} placeholder="Thanks for the feedback…" />
          </div>
        </div>
      </Modal>
    </div>);

}