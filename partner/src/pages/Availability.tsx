import React, { useState } from 'react';
import { CheckCircle2Icon, LightbulbIcon, MinusIcon, PlusIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { SettingsCard } from '../components/settings/SettingsCard';
import { PermissionNotice } from '../components/AccessControls';
import { useAuth } from '../contexts/AuthContext';
import { inventory, upcomingDays as seedDays, type DayAvailability } from '../data/availability';

export function Availability() {
  const { can, addAudit } = useAuth();
  const canManage = can('manage_availability');
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

  return (
    <main className="scroll-slim h-full flex-1 overflow-y-auto bg-canvas px-7 py-6">
      <PageHeader
        title="Availability"
        subtitle="Decide how much of your inventory Checkdin can sell, day by day." />
      

      <div className="mt-6 space-y-5 pb-28">
        <section
          aria-label="Room allocation"
          className="grid grid-cols-1 gap-5 rounded-2xl bg-ink p-6 text-white lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_260px]">
          
          <div>
            <p className="text-[13px] font-medium text-white/60">Rooms in your hotel</p>
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                aria-label="Decrease total rooms"
                onClick={() => step(setTotalRooms, totalRooms, -1, 200)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 transition-colors duration-150 ease-out hover:bg-white/20">
                
                <MinusIcon size={16} aria-hidden="true" />
              </button>
              <span className="text-[40px] font-bold leading-none tracking-tight">{totalRooms}</span>
              <button
                type="button"
                aria-label="Increase total rooms"
                onClick={() => step(setTotalRooms, totalRooms, 1, 200)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 transition-colors duration-150 ease-out hover:bg-white/20">
                
                <PlusIcon size={16} aria-hidden="true" />
              </button>
            </div>
            <p className="mt-3 text-[12.5px] text-white/50">
              Total keys across all floors, including rooms you sell elsewhere.
            </p>
          </div>

          <div>
            <p className="text-[13px] font-medium text-white/60">Rooms allocated to Checkdin</p>
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                aria-label="Decrease allocated rooms"
                onClick={() => step(setAllocated, allocated, -1, totalRooms)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 transition-colors duration-150 ease-out hover:bg-white/20">
                
                <MinusIcon size={16} aria-hidden="true" />
              </button>
              <span className="text-[40px] font-bold leading-none tracking-tight text-lime-300">
                {allocated}
              </span>
              <button
                type="button"
                aria-label="Increase allocated rooms"
                onClick={() => step(setAllocated, allocated, 1, totalRooms)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 transition-colors duration-150 ease-out hover:bg-white/20">
                
                <PlusIcon size={16} aria-hidden="true" />
              </button>
            </div>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/15">
              <div className="h-full rounded-full bg-lime-300" style={{ width: `${share}%` }} />
            </div>
            <p className="mt-2 text-[12.5px] text-white/50">
              {share}% of your inventory • {bookedToday} booked today
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
                          { ...item, allocated: Math.max(item.booked, item.allocated - 1) } :
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

      </div>

      <div className="sticky bottom-0 -mx-7 border-t border-neutral-200 bg-white/95 px-7 py-3.5 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[13px] text-ink-muted">
            {allocated} of {totalRooms} rooms allocated to Checkdin.
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
                  detail: `${allocated}/${totalRooms} rooms allocated`,
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