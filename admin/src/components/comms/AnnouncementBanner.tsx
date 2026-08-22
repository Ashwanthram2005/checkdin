import React from 'react';
import { Link } from 'react-router-dom';
import { MegaphoneIcon, XIcon } from 'lucide-react';
import { useComms } from '../../contexts/CommsContext';
import { personById } from '../../data/communications';

export function AnnouncementBanner() {
  const { announcements, dismissedAnnouncements, dismissAnnouncement } = useComms();
  const active = announcements.find((item) => item.pinned && !dismissedAnnouncements.includes(item.id));
  if (!active) return null;

  const author = personById(active.postedBy);

  return (
    <div className="border-b border-line bg-accent/[0.14] px-4 py-2.5 sm:px-6">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <MegaphoneIcon className="h-4 w-4 shrink-0 text-ink" />
        <p className="text-[13px] font-semibold text-ink">{active.title}</p>
        <p className="hidden text-[13px] text-muted sm:block">
          {author?.name} · {active.at}
        </p>
        <Link
          to="/comms/announcements"
          className="text-[13px] font-medium text-ink underline-offset-2 hover:underline">
          
          Read
        </Link>
        <button
          onClick={() => dismissAnnouncement(active.id)}
          aria-label="Dismiss announcement"
          className="ml-auto rounded-md p-1 text-muted transition-colors duration-150 ease-smooth hover:bg-card hover:text-ink">
          
          <XIcon className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>);

}