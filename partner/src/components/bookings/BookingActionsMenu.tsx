import React, { useEffect, useRef, useState } from "react";
import { BanIcon, CheckIcon, DownloadIcon, EyeIcon, LogInIcon, LogOutIcon, MessageCircleIcon, MoreHorizontalIcon, PhoneIcon, XIcon, BoxIcon } from "lucide-react";
import { Booking } from "../../data/bookings";
export type BookingAction = 'view' | 'call' | 'whatsapp' | 'accept' | 'reject' | 'checkin' | 'checkout' | 'cancel' | 'invoice';
type BookingActionsMenuProps = {
  booking: Booking;
  onAction: (action: BookingAction, booking: Booking) => void;
};
export function actionsFor(booking: Booking): {
  id: BookingAction;
  label: string;
  icon: BoxIcon;
  danger?: boolean;
}[] {
  const base: {
    id: BookingAction;
    label: string;
    icon: BoxIcon;
    danger?: boolean;
  }[] = [{
    id: 'view',
    label: 'View booking',
    icon: EyeIcon
  }, {
    id: 'call',
    label: 'Call guest',
    icon: PhoneIcon
  }, {
    id: 'whatsapp',
    label: 'WhatsApp guest',
    icon: MessageCircleIcon
  }];
  if (booking.status === 'Pending Approval') {
    base.push({
      id: 'accept',
      label: 'Accept booking',
      icon: CheckIcon
    }, {
      id: 'reject',
      label: 'Reject booking',
      icon: XIcon,
      danger: true
    });
  }
  if (booking.status === 'Confirmed') {
    base.push({
      id: 'checkin',
      label: 'Check in',
      icon: LogInIcon
    }, {
      id: 'cancel',
      label: 'Cancel booking',
      icon: BanIcon,
      danger: true
    });
  }
  if (booking.status === 'Checked In') {
    base.push({
      id: 'checkout',
      label: 'Check out',
      icon: LogOutIcon
    });
  }
  base.push({
    id: 'invoice',
    label: 'Download invoice',
    icon: DownloadIcon
  });
  return base;
}
export function BookingActionsMenu({
  booking,
  onAction
}: BookingActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const handle = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);
  return <div ref={ref} className="relative flex justify-end">
      <button type="button" aria-label={`Actions for booking ${booking.id}`} aria-expanded={open} onClick={() => setOpen((prev) => !prev)} className="rounded-lg border border-neutral-200 p-1.5 text-ink-muted transition-colors duration-150 ease-out hover:border-neutral-300 hover:text-ink">
        <MoreHorizontalIcon size={16} aria-hidden="true" />
      </button>

      {open && <ul className="absolute right-0 top-9 z-30 w-[214px] overflow-hidden rounded-xl border border-neutral-200 bg-white py-1 shadow-lg">
          {actionsFor(booking).map(({
        id,
        label,
        icon: Icon,
        danger
      }) => <li key={id}>
              <button type="button" onClick={() => {
          setOpen(false);
          onAction(id, booking);
        }} className={['flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-[13px] transition-colors duration-150 ease-out', danger ? 'text-red-600 hover:bg-red-50' : 'text-ink-soft hover:bg-neutral-50 hover:text-ink'].join(' ')}>
                <Icon size={14} aria-hidden="true" />
                {label}
              </button>
            </li>)}
        </ul>}
    </div>;
}