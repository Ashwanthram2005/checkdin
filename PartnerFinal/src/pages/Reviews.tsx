import React, { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { ReviewSummary } from '../components/reviews/ReviewSummary';
import { ReviewCard } from '../components/reviews/ReviewCard';
import { useAuth } from '../contexts/AuthContext';
import { reviews as initialReviews, type Review } from '../data/reviews';

const filters = [
{ id: 'all', label: 'All reviews' },
{ id: 'awaiting', label: 'Needs reply' },
{ id: 'replied', label: 'Replied' },
{ id: 'low', label: '3★ and below' }] as
const;

type FilterId = (typeof filters)[number]['id'];

export function Reviews() {
  const { can, addAudit } = useAuth();
  const canManage = can('manage_reviews');
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [filter, setFilter] = useState<FilterId>('all');

  const counts: Record<FilterId, number> = {
    all: reviews.length,
    awaiting: reviews.filter((r) => !r.reply).length,
    replied: reviews.filter((r) => r.reply).length,
    low: reviews.filter((r) => r.rating <= 3).length
  };

  const visible = reviews.filter((review) => {
    if (filter === 'awaiting') return !review.reply;
    if (filter === 'replied') return Boolean(review.reply);
    if (filter === 'low') return review.rating <= 3;
    return true;
  });

  const handleReply = (id: string, text: string) => {
    if (!canManage) return;
    setReviews((prev) =>
    prev.map((review) =>
    review.id === id ? { ...review, reply: { text, repliedOn: '16 Aug 2026' } } : review
    )
    );
    addAudit({
      action: 'Replied to review',
      detail: `Review from ${reviews.find((r) => r.id === id)?.guest}`,
      category: 'Management'
    });
  };

  const handleRateGuest = (id: string, stars: number, tags: string[]) => {
    if (!canManage) return;
    setReviews((prev) =>
    prev.map((review) => review.id === id ? { ...review, guestRating: { stars, tags } } : review)
    );
    addAudit({
      action: 'Rated guest',
      detail: `${reviews.find((r) => r.id === id)?.guest} • ${stars} stars`,
      category: 'Management'
    });
  };

  return (
    <main className="scroll-slim h-full flex-1 overflow-y-auto bg-canvas px-7 py-6">
      <PageHeader
        title="Reviews"
        subtitle="Reply to guest feedback and rate how guests treated your rooms." />
      

      <div className="mt-6 space-y-5">
        {!canManage &&
        <p className="rounded-2xl border border-neutral-200/80 bg-white px-4 py-3 text-[13px] text-ink-soft shadow-card">
            <span className="font-semibold text-ink">Read-only.</span> Your role can view reviews but
            replying and rating guests needs the “Manage reviews” permission.
          </p>
        }

        <ReviewSummary awaitingReply={counts.awaiting} />

        <div role="tablist" aria-label="Filter reviews" className="flex flex-wrap gap-1">
          {filters.map((item) => {
            const isActive = item.id === filter;
            return (
              <button
                key={item.id}
                role="tab"
                type="button"
                aria-selected={isActive}
                onClick={() => setFilter(item.id)}
                className={[
                'rounded-xl px-4 py-2 text-[13px] transition-colors duration-150 ease-out',
                isActive ?
                'bg-ink font-semibold text-white' :
                'border border-neutral-200 bg-white font-medium text-ink-soft hover:border-neutral-300'].
                join(' ')}>
                
                {item.label}
                <span className={`ml-1.5 text-[12px] ${isActive ? 'text-white/60' : 'text-ink-muted'}`}>
                  {counts[item.id]}
                </span>
              </button>);

          })}
        </div>

        {visible.length === 0 ?
        <p className="rounded-2xl border border-neutral-200/80 bg-white px-5 py-16 text-center text-[13.5px] text-ink-muted shadow-card">
            Nothing here — every review in this filter is handled.
          </p> :

        <div className="space-y-4">
            {visible.map((review) =>
          <ReviewCard
            key={review.id}
            review={review}
            onReply={handleReply}
            onRateGuest={handleRateGuest} />

          )}
          </div>
        }
      </div>
    </main>);

}