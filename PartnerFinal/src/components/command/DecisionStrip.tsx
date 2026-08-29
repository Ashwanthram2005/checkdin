import React from 'react';
import {
  ArrowUpRightIcon,
  GaugeIcon,
  HourglassIcon,
  IndianRupeeIcon,
  RadioIcon,
  SparklesIcon } from
'lucide-react';
import { extensionRequests, extensionSummary } from '../../data/extensions';
import { forecastSummary, occupancyNow } from '../../data/analytics';
import { performanceScore } from '../../data/operations';
import { inr } from '../../utils/gst';

type DecisionStripProps = {
  onNavigate: (label: string) => void;
  hotelStatus: string;
};

export function DecisionStrip({ onNavigate, hotelStatus }: DecisionStripProps) {
  const waiting = extensionRequests.filter(
    (request) => request.status === 'Waiting for Approval'
  ).length;
  const atStake = extensionRequests.
  filter((request) => request.status === 'Waiting for Approval').
  reduce((sum, request) => sum + request.additionalRevenue, 0);
  const pace = Math.round(extensionSummary.todayRevenue / forecastSummary.today.expected * 100);

  const cards = [
  {
    id: 'extensions',
    label: 'Needs a decision now',
    value: `${waiting} extension${waiting === 1 ? '' : 's'}`,
    note: `${inr(atStake)} at stake • 5 minute window`,
    icon: HourglassIcon,
    target: 'Extensions',
    urgent: waiting > 0
  },
  {
    id: 'revenue',
    label: 'Revenue today',
    value: inr(extensionSummary.todayRevenue),
    note: `${pace}% of the ${inr(forecastSummary.today.expected)} forecast`,
    icon: IndianRupeeIcon,
    target: 'Revenue'
  },
  {
    id: 'occupancy',
    label: 'Occupancy now',
    value: `${occupancyNow.current}%`,
    note: `${occupancyNow.slotsSold} of ${occupancyNow.slotsAllocated} slots sold`,
    icon: GaugeIcon,
    target: 'Occupancy'
  },
  {
    id: 'visibility',
    label: 'Visibility',
    value: hotelStatus,
    note: hotelStatus === 'Live' ? 'Accepting new bookings' : 'Not taking new bookings',
    icon: RadioIcon,
    target: 'Availability'
  },
  {
    id: 'score',
    label: 'Performance score',
    value: `${performanceScore.score} / 100`,
    note: performanceScore.band,
    icon: SparklesIcon,
    target: 'Performance Score'
  }];


  return (
    <section
      aria-label="What needs your attention"
      className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
      
      {cards.map(({ id, label, value, note, icon: Icon, target, urgent }) =>
      <button
        key={id}
        type="button"
        onClick={() => onNavigate(target)}
        className={[
        'group flex flex-col items-start rounded-2xl border p-5 text-left transition-colors duration-150 ease-out',
        urgent ?
        'border-orange-300 bg-orange-50 hover:bg-orange-100/70' :
        'border-neutral-200/80 bg-white shadow-card hover:border-neutral-300'].
        join(' ')}>
        
          <span className="flex w-full items-start justify-between">
            <span
            className={[
            'flex h-10 w-10 items-center justify-center rounded-full',
            urgent ? 'bg-orange-200' : 'bg-lime-100'].
            join(' ')}>
            
              <Icon
              size={18}
              className={urgent ? 'text-orange-700' : 'text-lime-600'}
              aria-hidden="true" />
            
            </span>
            <ArrowUpRightIcon
            size={15}
            aria-hidden="true"
            className="text-ink-muted opacity-0 transition-opacity duration-150 ease-out group-hover:opacity-100" />
          
          </span>
          <span className="mt-3.5 text-[12.5px] font-medium text-ink-muted">{label}</span>
          <span className="mt-1 text-[22px] font-bold leading-none tracking-tight text-ink">
            {value}
          </span>
          <span className="mt-auto pt-2.5 text-[11.5px] text-ink-muted">{note}</span>
        </button>
      )}
    </section>);

}