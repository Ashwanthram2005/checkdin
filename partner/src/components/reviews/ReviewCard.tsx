import React, { useState } from 'react';
import { CheckIcon, CornerDownRightIcon, PencilIcon } from 'lucide-react';
import { StarInput, StarRating } from './StarRating';
import { GuestAvatar } from '../StatusBadge';
import { guestTags, type Review } from '../../data/reviews';

type ReviewCardProps = {
  review: Review;
  onReply: (id: string, text: string) => void;
  onRateGuest: (id: string, stars: number, tags: string[]) => void;
};

export function ReviewCard({ review, onReply, onRateGuest }: ReviewCardProps) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState(review.reply?.text ?? '');
  const [ratingOpen, setRatingOpen] = useState(false);
  const [stars, setStars] = useState(review.guestRating?.stars ?? 0);
  const [tags, setTags] = useState<string[]>(review.guestRating?.tags ?? []);

  const submitReply = (event: React.FormEvent) => {
    event.preventDefault();
    if (!replyText.trim()) return;
    onReply(review.id, replyText.trim());
    setReplyOpen(false);
  };

  const submitRating = () => {
    if (stars === 0) return;
    onRateGuest(review.id, stars, tags);
    setRatingOpen(false);
  };

  const toggleTag = (tag: string) =>
  setTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);

  return (
    <article className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <GuestAvatar name={review.guest} />
          <div>
            <p className="text-[14px] font-semibold text-ink">{review.guest}</p>
            <p className="mt-0.5 text-[12px] text-ink-muted">
              {review.room} • {review.duration} • Stayed {review.stayedOn}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StarRating value={review.rating} size={16} />
          <span className="text-[13px] font-semibold text-ink">{review.rating}.0</span>
        </div>
      </div>

      <h3 className="mt-4 text-[15px] font-semibold text-ink">{review.title}</h3>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">{review.body}</p>

      <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-neutral-100 pt-3">
        {(
        [
        ['Cleanliness', review.categories.cleanliness],
        ['Staff', review.categories.staff],
        ['Value', review.categories.value]] as
        const).
        map(([label, value]) =>
        <div key={label} className="flex items-center gap-2">
            <dt className="text-[12px] text-ink-muted">{label}</dt>
            <dd className="text-[12.5px] font-semibold text-ink">{value}.0</dd>
          </div>
        )}
      </dl>

      {review.reply && !replyOpen &&
      <div className="mt-4 rounded-xl bg-neutral-50 p-4">
          <p className="flex items-center gap-1.5 text-[12px] font-semibold text-ink">
            <CornerDownRightIcon size={13} className="text-ink-muted" aria-hidden="true" />
            Your reply • {review.reply.repliedOn}
          </p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">{review.reply.text}</p>
          <button
          type="button"
          onClick={() => setReplyOpen(true)}
          className="mt-2.5 flex items-center gap-1.5 text-[12.5px] font-medium text-lime-600 transition-colors duration-150 ease-out hover:text-lime-500">
          
            <PencilIcon size={12} aria-hidden="true" />
            Edit reply
          </button>
        </div>
      }

      {replyOpen &&
      <form onSubmit={submitReply} className="mt-4">
          <label htmlFor={`reply-${review.id}`} className="block text-[13px] font-medium text-ink-soft">
            Your public reply
          </label>
          <textarea
          id={`reply-${review.id}`}
          rows={3}
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder={`Thanks for staying with us, ${review.guest.split(' ')[0]}…`}
          className="mt-1.5 w-full resize-y rounded-xl border border-neutral-200 px-3.5 py-2.5 text-[13.5px] text-ink outline-none transition-colors duration-150 ease-out placeholder:text-neutral-400 hover:border-neutral-300 focus:border-lime-500" />
        
          <div className="mt-3 flex items-center gap-2">
            <button
            type="submit"
            className="rounded-xl bg-lime-300 px-4 py-2 text-[13px] font-semibold text-ink transition-colors duration-150 ease-out hover:bg-lime-200">
            
              {review.reply ? 'Update reply' : 'Post reply'}
            </button>
            <button
            type="button"
            onClick={() => {
              setReplyOpen(false);
              setReplyText(review.reply?.text ?? '');
            }}
            className="rounded-xl border border-neutral-200 px-4 py-2 text-[13px] font-medium text-ink-soft transition-colors duration-150 ease-out hover:border-neutral-300">
            
              Cancel
            </button>
            <p className="text-[11.5px] text-ink-muted">Visible to all guests on your listing.</p>
          </div>
        </form>
      }

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-4">
        {!review.reply && !replyOpen ?
        <button
          type="button"
          onClick={() => setReplyOpen(true)}
          className="rounded-xl bg-ink px-4 py-2 text-[13px] font-semibold text-white transition-colors duration-150 ease-out hover:bg-ink-soft">
          
            Reply to review
          </button> :

        <span />
        }

        {review.guestRating && !ratingOpen ?
        <div className="flex flex-wrap items-center gap-2">
            <span className="text-[12.5px] text-ink-muted">You rated this guest</span>
            <StarRating value={review.guestRating.stars} size={14} />
            {review.guestRating.tags.map((tag) =>
          <span
            key={tag}
            className="rounded-md bg-lime-100 px-2 py-0.5 text-[11px] font-semibold text-lime-600">
            
                {tag}
              </span>
          )}
            <button
            type="button"
            onClick={() => setRatingOpen(true)}
            className="text-[12.5px] font-medium text-lime-600 transition-colors duration-150 ease-out hover:text-lime-500">
            
              Edit
            </button>
          </div> :

        !ratingOpen &&
        <button
          type="button"
          onClick={() => setRatingOpen(true)}
          className="rounded-xl border border-neutral-200 px-4 py-2 text-[13px] font-medium text-ink transition-colors duration-150 ease-out hover:border-lime-400 hover:bg-lime-50">
          
              Rate this guest
            </button>

        }
      </div>

      {ratingOpen &&
      <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50/70 p-4">
          <p className="text-[13px] font-semibold text-ink">Rate {review.guest}'s stay</p>
          <p className="mt-0.5 text-[12px] text-ink-muted">
            Only Checkdin and other partners see guest ratings — the guest is not notified.
          </p>

          <div className="mt-3 flex items-center gap-3">
            <StarInput value={stars} onChange={setStars} label={`Rating for ${review.guest}`} />
            <span className="text-[12.5px] text-ink-muted">
              {stars === 0 ? 'Select a rating' : `${stars} of 5`}
            </span>
          </div>

          <ul className="mt-3 flex flex-wrap gap-2">
            {guestTags.map((tag) => {
            const isOn = tags.includes(tag);
            return (
              <li key={tag}>
                  <button
                  type="button"
                  aria-pressed={isOn}
                  onClick={() => toggleTag(tag)}
                  className={[
                  'flex items-center gap-1 rounded-full border px-3 py-1.5 text-[12.5px] transition-colors duration-150 ease-out',
                  isOn ?
                  'border-ink bg-ink font-medium text-white' :
                  'border-neutral-200 bg-white text-ink-soft hover:border-neutral-300'].
                  join(' ')}>
                  
                    {isOn && <CheckIcon size={12} aria-hidden="true" />}
                    {tag}
                  </button>
                </li>);

          })}
          </ul>

          <div className="mt-4 flex items-center gap-2">
            <button
            type="button"
            onClick={submitRating}
            disabled={stars === 0}
            className="rounded-xl bg-lime-300 px-4 py-2 text-[13px] font-semibold text-ink transition-colors duration-150 ease-out hover:bg-lime-200 disabled:cursor-not-allowed disabled:opacity-50">
            
              Save guest rating
            </button>
            <button
            type="button"
            onClick={() => {
              setRatingOpen(false);
              setStars(review.guestRating?.stars ?? 0);
              setTags(review.guestRating?.tags ?? []);
            }}
            className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-[13px] font-medium text-ink-soft transition-colors duration-150 ease-out hover:border-neutral-300">
            
              Cancel
            </button>
          </div>
        </div>
      }
    </article>);

}