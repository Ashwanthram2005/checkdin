import React, { useState } from 'react';
import {
  CheckCircle2Icon,
  LightbulbIcon,
  MinusIcon,
  PlaneIcon,
  PlusIcon,
  TimerIcon } from
'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { SettingsCard } from '../components/settings/SettingsCard';
import { Toggle } from '../components/settings/Toggle';
import { HotelStatusPanel } from '../components/control/HotelStatusPanel';
import { ReportStat } from '../components/reports/ReportStat';
import { PermissionNotice } from '../components/AccessControls';
import { useAuth } from '../contexts/AuthContext';
import { inventory, upcomingDays as seedDays, type DayAvailability } from '../data/availability';
import {
  bookingPreferences,
  pauseDurations,
  vacationReasons,
  visibilityAnalytics,
  type HotelStatus } from
'../data/operations';
import { inr } from '../utils/gst';

export function Availability() {
  const { can, addAudit } = useAuth();
  const canManage = can('manage_availability');
  const [status, setStatus] = useState<HotelStatus>('Live');
  const [pauseWindow, setPauseWindow] = useState<string | null>(null);
  const [vacation, setVacation] = useState<{reason: string;days: number;} | null>(null);
  const [preferences, setPreferences] = useState<Record<string, boolean>>({
    search: true,
    new: true,
    sameDay: true,
    hourly: true,
    extensions: true
  });
  const [totalRooms, setTotalRooms] = useState(inventory.totalRooms);
  const [allocated, setAllocated] = useState(inventory.allocatedToCheckdin);
  const [days, setDays] = useState<DayAvailability[]>(seedDays);
  const [saved, setSaved] = useState(false);

  const share = Math.round(allocated / totalRooms * 100);
  const bookedToday = days[0]?.booked ?? 0;

  const step = (setter: (value: number) => void, value: number, delta: number, max: number) => {
    setSaved(false);
    setter(Math.min(max, Math.max(0, value + delta)));
  };

  const changeStatus = (next: HotelStatus) => {
    setStatus(next);
    setSaved(false);
    if (next === 'Live') {
      setPauseWindow(null);
      setVacation(null);
    }
    addAudit({
      action: 'Changed hotel visibility',
      detail: `Status set to ${next}`,
      category: 'Management'
    });
  };

  return (
    <main className="scroll-slim h-full flex-1 overflow-y-auto bg-canvas px-7 py-6">
      <PageHeader
        title="Availability Control Center"
        subtitle="Decide whether Checkdin can sell you, and how much of your inventory it gets." />
      

      <div className="mt-6 space-y-5 pb-28">
        <HotelStatusPanel status={status} onChange={changeStatus} canManage={canManage} />

        {(pauseWindow || vacation) &&
        <p className="flex items-center gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-900">
            <TimerIcon size={16} className="shrink-0" aria-hidden="true" />
            {vacation ?
          `Vacation mode — ${vacation.reason}. Resuming in ${vacation.days} days.` :
          `Bookings paused for ${pauseWindow?.toLowerCase()}. Reactivates automatically.`}
          </p>
        }

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <SettingsCard
            title="Pause scheduler"
            description="Stop taking new bookings for a set window — you come back automatically."
            bodyClassName="p-5">
            
            <div className="flex flex-wrap gap-2">
              {pauseDurations.map((option) =>
              <button
                key={option}
                type="button"
                disabled={!canManage}
                onClick={() => {
                  setPauseWindow(option);
                  setStatus('Bookings Paused');
                  setVacation(null);
                  addAudit({
                    action: 'Scheduled booking pause',
                    detail: option,
                    category: 'Management'
                  });
                }}
                className={[
                'rounded-lg px-3.5 py-2 text-[12.5px] transition-colors duration-150 ease-out disabled:opacity-50',
                pauseWindow === option ?
                'bg-ink font-semibold text-white' :
                'border border-neutral-200 font-medium text-ink-soft hover:border-neutral-300'].
                join(' ')}>
                
                  {option}
                </button>
              )}
            </div>
            <p className="mt-3 text-[12px] leading-relaxed text-ink-muted">
              You stay visible in search while paused, so guests can still find you and book once
              the window ends. Estimated cost of a 3 day pause:{' '}
              <span className="font-semibold text-ink">{inr(11400)}</span>.
            </p>
            {pauseWindow &&
            <button
              type="button"
              onClick={() => {
                setPauseWindow(null);
                setStatus('Live');
              }}
              className="mt-3 rounded-lg border border-neutral-200 px-3.5 py-2 text-[12.5px] font-medium text-ink transition-colors duration-150 ease-out hover:border-neutral-300">
              
                Resume bookings now
              </button>
            }
          </SettingsCard>

          <SettingsCard
            title="Vacation mode"
            description="Hide the property entirely while you are closed."
            bodyClassName="p-5">
            
            <div className="flex flex-wrap gap-2">
              {vacationReasons.map((reason) =>
              <button
                key={reason}
                type="button"
                disabled={!canManage}
                onClick={() => {
                  setVacation({ reason, days: 7 });
                  setStatus('Offline');
                  setPauseWindow(null);
                  addAudit({
                    action: 'Enabled vacation mode',
                    detail: `${reason} • 7 days`,
                    category: 'Management'
                  });
                }}
                className={[
                'rounded-lg px-3.5 py-2 text-[12.5px] transition-colors duration-150 ease-out disabled:opacity-50',
                vacation?.reason === reason ?
                'bg-ink font-semibold text-white' :
                'border border-neutral-200 font-medium text-ink-soft hover:border-neutral-300'].
                join(' ')}>
                
                  {reason}
                </button>
              )}
            </div>

            {vacation ?
            <div className="mt-4 rounded-xl bg-neutral-50 px-4 py-3">
                <p className="flex items-center gap-2 text-[13px] font-semibold text-ink">
                  <PlaneIcon size={14} aria-hidden="true" />
                  Resuming in {vacation.days} days
                </p>
                <div className="mt-2.5 flex items-center gap-3">
                  <button
                  type="button"
                  aria-label="Fewer days"
                  onClick={() => setVacation({ ...vacation, days: Math.max(1, vacation.days - 1) })}
                  className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-ink transition-colors duration-150 ease-out hover:bg-neutral-200">
                  
                    <MinusIcon size={13} aria-hidden="true" />
                  </button>
                  <span className="text-[15px] font-bold text-ink">{vacation.days}</span>
                  <button
                  type="button"
                  aria-label="More days"
                  onClick={() => setVacation({ ...vacation, days: Math.min(60, vacation.days + 1) })}
                  className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-ink transition-colors duration-150 ease-out hover:bg-neutral-200">
                  
                    <PlusIcon size={13} aria-hidden="true" />
                  </button>
                  <button
                  type="button"
                  onClick={() => {
                    setVacation(null);
                    setStatus('Live');
                  }}
                  className="ml-auto rounded-lg border border-neutral-200 px-3 py-1.5 text-[12px] font-medium text-ink transition-colors duration-150 ease-out hover:border-neutral-300">
                  
                    Go live now
                  </button>
                </div>
              </div> :

            <p className="mt-3 text-[12px] leading-relaxed text-ink-muted">
                Vacation mode removes you from guest search. Existing confirmed bookings are
                honoured — cancel them separately if the property is truly closed.
              </p>
            }
          </SettingsCard>
        </div>

        <SettingsCard
          title="Booking preferences"
          description="Fine control over what Checkdin can sell on your behalf."
          bodyClassName="px-5 py-2">
          
          <div className="divide-y divide-neutral-100">
            {bookingPreferences.map((preference) =>
            <Toggle
              key={preference.id}
              label={preference.label}
              description={preference.description}
              checked={preferences[preference.id]}
              disabled={!canManage}
              onChange={(value) => {
                setSaved(false);
                setPreferences((prev) => ({ ...prev, [preference.id]: value }));
              }} />

            )}
          </div>
        </SettingsCard>

        <section
          aria-label="Inventory allocation"
          className="grid grid-cols-1 gap-5 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-card lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_280px]">
          
          <div>
            <p className="text-[13px] font-medium text-ink-muted">Rooms in your hotel</p>
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                aria-label="Decrease total rooms"
                onClick={() => step(setTotalRooms, totalRooms, -1, 200)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 transition-colors duration-150 ease-out hover:bg-neutral-200">
                
                <MinusIcon size={16} aria-hidden="true" />
              </button>
              <span className="text-[38px] font-bold leading-none tracking-tight text-ink">
                {totalRooms}
              </span>
              <button
                type="button"
                aria-label="Increase total rooms"
                onClick={() => step(setTotalRooms, totalRooms, 1, 200)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 transition-colors duration-150 ease-out hover:bg-neutral-200">
                
                <PlusIcon size={16} aria-hidden="true" />
              </button>
            </div>
            <p className="mt-3 text-[12.5px] text-ink-muted">
              Total keys, including rooms you sell elsewhere.
            </p>
          </div>

          <div>
            <p className="text-[13px] font-medium text-ink-muted">Allocated to Checkdin</p>
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                aria-label="Decrease allocated rooms"
                onClick={() => step(setAllocated, allocated, -1, totalRooms)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 transition-colors duration-150 ease-out hover:bg-neutral-200">
                
                <MinusIcon size={16} aria-hidden="true" />
              </button>
              <span className="text-[38px] font-bold leading-none tracking-tight text-ink">
                {allocated}
              </span>
              <button
                type="button"
                aria-label="Increase allocated rooms"
                onClick={() => step(setAllocated, allocated, 1, totalRooms)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 transition-colors duration-150 ease-out hover:bg-neutral-200">
                
                <PlusIcon size={16} aria-hidden="true" />
              </button>
            </div>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
              <div className="h-full rounded-full bg-lime-400" style={{ width: `${share}%` }} />
            </div>
            <p className="mt-2 text-[12.5px] text-ink-muted">
              {share}% of your inventory • {bookedToday} slots booked today
            </p>
          </div>

          <div className="rounded-xl bg-lime-300 p-4 text-ink">
            <p className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide">
              <LightbulbIcon size={14} aria-hidden="true" />
              PRO TIP
            </p>
            <p className="mt-2 text-[13px] font-semibold leading-snug">
              Allocate your best rooms to Checkdin.
            </p>
            <p className="mt-1.5 text-[12px] leading-relaxed text-ink/70">
              Hourly guests review fast and often. Properties that give Checkdin their nicest rooms
              hold higher ratings, rank better in search and refill slots sooner.
            </p>
          </div>
        </section>

        <SettingsCard
          title="Next 7 days"
          description="Reduce allocation on busy days or block a date entirely."
          bodyClassName="p-5">
          
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-7">
            {days.map((day) => {
              const free = Math.max(0, day.allocated - day.booked);
              return (
                <li
                  key={day.id}
                  className={[
                  'rounded-xl border p-3',
                  day.blocked ? 'border-red-200 bg-red-50' : 'border-neutral-200'].
                  join(' ')}>
                  
                  <p className="text-[12px] text-ink-muted">{day.day}</p>
                  <p className="text-[14px] font-semibold text-ink">{day.date}</p>

                  {day.blocked ?
                  <p className="mt-2 text-[12px] font-semibold text-red-600">Blocked</p> :

                  <>
                      <div className="mt-2 flex items-center justify-between">
                        <button
                        type="button"
                        aria-label={`Decrease allocation on ${day.date}`}
                        onClick={() => {
                          setSaved(false);
                          setDays((prev) =>
                          prev.map((item) =>
                          item.id === day.id ?
                          {
                            ...item,
                            allocated: Math.max(item.booked, item.allocated - 1)
                          } :
                          item
                          )
                          );
                        }}
                        className="flex h-6 w-6 items-center justify-center rounded-md bg-neutral-100 text-ink transition-colors duration-150 ease-out hover:bg-neutral-200">
                        
                          <MinusIcon size={12} aria-hidden="true" />
                        </button>
                        <span className="text-[15px] font-bold text-ink">{day.allocated}</span>
                        <button
                        type="button"
                        aria-label={`Increase allocation on ${day.date}`}
                        onClick={() => {
                          setSaved(false);
                          setDays((prev) =>
                          prev.map((item) =>
                          item.id === day.id ?
                          { ...item, allocated: Math.min(allocated, item.allocated + 1) } :
                          item
                          )
                          );
                        }}
                        className="flex h-6 w-6 items-center justify-center rounded-md bg-neutral-100 text-ink transition-colors duration-150 ease-out hover:bg-neutral-200">
                        
                          <PlusIcon size={12} aria-hidden="true" />
                        </button>
                      </div>
                      <p className="mt-1.5 text-[11.5px] text-ink-muted">
                        {day.booked} booked • {free} free
                      </p>
                    </>
                  }

                  <button
                    type="button"
                    onClick={() => {
                      setSaved(false);
                      setDays((prev) =>
                      prev.map((item) =>
                      item.id === day.id ?
                      {
                        ...item,
                        blocked: !item.blocked,
                        allocated: item.blocked ? allocated : 0
                      } :
                      item
                      )
                      );
                    }}
                    className="mt-2.5 w-full rounded-lg border border-neutral-200 py-1.5 text-[11.5px] font-medium text-ink transition-colors duration-150 ease-out hover:border-neutral-300">
                    
                    {day.blocked ? 'Unblock' : 'Block date'}
                  </button>
                </li>);

            })}
          </ul>
        </SettingsCard>

        <section aria-label="Visibility analytics" className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <ReportStat
            label="Days online"
            value={String(visibilityAnalytics.daysOnline)}
            note="Last 31 days" />
          
          <ReportStat label="Days paused" value={String(visibilityAnalytics.daysPaused)} note="Visible, not selling" />
          <ReportStat label="Days offline" value={String(visibilityAnalytics.daysOffline)} note="Hidden from search" />
          <ReportStat
            label="Estimated missed revenue"
            value={inr(visibilityAnalytics.missedRevenue)}
            note="While paused or offline"
            emphasis />
          
          <ReportStat
            label="Booking opportunities missed"
            value={String(visibilityAnalytics.missedBookings)}
            note="Searches you did not appear in" />
          
        </section>
      </div>

      <div className="sticky bottom-0 -mx-7 border-t border-neutral-200 bg-white/95 px-7 py-3.5 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[13px] text-ink-muted">
            {status} • {allocated} of {totalRooms} rooms allocated to Checkdin.
          </p>
          <div className="flex items-center gap-3">
            {saved &&
            <p
              role="status"
              className="flex items-center gap-1.5 text-[13px] font-medium text-forest">
              
                <CheckCircle2Icon size={15} aria-hidden="true" />
                Availability updated
              </p>
            }
            {canManage ?
            <button
              type="button"
              onClick={() => {
                setSaved(true);
                addAudit({
                  action: 'Updated availability',
                  detail: `${status} • ${allocated}/${totalRooms} rooms allocated`,
                  category: 'Operations'
                });
              }}
              className="rounded-xl bg-lime-300 px-5 py-2.5 text-[13.5px] font-semibold text-ink transition-colors duration-150 ease-out hover:bg-lime-200">
              
                Save Changes
              </button> :

            <PermissionNotice label="Manage availability permission required" />
            }
          </div>
        </div>
      </div>
    </main>);

}