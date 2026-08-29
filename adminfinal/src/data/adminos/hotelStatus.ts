import { properties } from '../properties';

export type VisibilityState = 'Live' | 'Paused' | 'Offline' | 'Vacation';

export interface HotelVisibility {
  propertyId: string;
  propertyName: string;
  city: string;
  partnerName: string;
  state: VisibilityState;
  since: string;
  days: number;
  pauses30d: number;
  reason: string;
}

const states: VisibilityState[] = ['Live', 'Live', 'Paused', 'Live', 'Offline', 'Vacation', 'Live', 'Paused', 'Live', 'Live'];
const reasons: Record<VisibilityState, string> = {
  Live: 'Accepting bookings',
  Paused: 'Partner paused inventory temporarily',
  Offline: 'No response from property desk',
  Vacation: 'Seasonal closure declared by partner'
};

export const hotelVisibility: HotelVisibility[] = properties.map((property, index) => {
  const state = states[index % states.length];
  const days = state === 'Live' ? 0 : [2, 9, 14, 4, 21, 6][index % 6];
  return {
    propertyId: property.id,
    propertyName: property.name,
    city: property.city,
    partnerName: property.partnerName,
    state,
    since: state === 'Live' ? '—' : `${19 - days} Aug 2026`,
    days,
    pauses30d: state === 'Paused' ? 4 + index % 3 : index % 3,
    reason: reasons[state]
  };
});

export interface VisibilityLog {
  id: string;
  propertyId: string;
  propertyName: string;
  from: VisibilityState;
  to: VisibilityState;
  changedBy: string;
  at: string;
  duration: string;
}

const actors = ['Partner desk', 'Varun Joshi (Ops)', 'Karthik Raman (Super Admin)', 'Auto — no response', 'Harish Kumar (Ops)'];

export const visibilityLogs: VisibilityLog[] = Array.from({ length: 22 }, (_, index) => {
  const property = properties[index % properties.length];
  const pairs: [VisibilityState, VisibilityState][] = [
  ['Live', 'Paused'],
  ['Paused', 'Live'],
  ['Live', 'Offline'],
  ['Offline', 'Live'],
  ['Live', 'Vacation'],
  ['Vacation', 'Live']];

  const [from, to] = pairs[index % pairs.length];
  return {
    id: `VIS-${900 + index}`,
    propertyId: property.id,
    propertyName: property.name,
    from,
    to,
    changedBy: actors[index % actors.length],
    at: `${19 - Math.floor(index / 2)} Aug, ${String(9 + index % 11).padStart(2, '0')}:${String(index * 17 % 60).padStart(2, '0')}`,
    duration: from === 'Live' ? '—' : `${1 + index % 12}d ${index * 3 % 24}h`
  };
});

export interface VisibilityAlert {
  id: string;
  severity: 'High' | 'Medium';
  propertyName: string;
  city: string;
  title: string;
  detail: string;
}

export const visibilityAlerts: VisibilityAlert[] = hotelVisibility.
filter((hotel) => hotel.state !== 'Live').
map((hotel, index) => {
  if (hotel.state === 'Offline' && hotel.days >= 7) {
    return {
      id: `ALR-${index}`,
      severity: 'High' as const,
      propertyName: hotel.propertyName,
      city: hotel.city,
      title: `Offline for ${hotel.days} days`,
      detail: 'Exceeds the 7-day offline threshold — inventory is invisible to guests.'
    };
  }
  if (hotel.pauses30d >= 4) {
    return {
      id: `ALR-${index}`,
      severity: 'Medium' as const,
      propertyName: hotel.propertyName,
      city: hotel.city,
      title: `${hotel.pauses30d} pauses in 30 days`,
      detail: 'Frequent pausing suggests staffing or inventory sync problems.'
    };
  }
  return {
    id: `ALR-${index}`,
    severity: 'Medium' as const,
    propertyName: hotel.propertyName,
    city: hotel.city,
    title: `${hotel.state} for ${hotel.days} days`,
    detail: 'Long absence from the marketplace — confirm the reopening date with the partner.'
  };
});