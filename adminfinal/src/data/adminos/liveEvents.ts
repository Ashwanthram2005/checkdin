import { properties } from '../properties';

export type LiveEventKind =
'New Booking' |
'Check-in' |
'Check-out' |
'Extension Request' |
'Extension Approved' |
'Cancellation' |
'Refund Request' |
'Payment Failure';

export interface LiveEvent {
  id: string;
  kind: LiveEventKind;
  propertyName: string;
  city: string;
  guestName: string;
  reference: string;
  amount: number;
  at: string;
}

const guests = [
'Aditya Sharma',
'Neha Kulkarni',
'Rahul Verma',
'Ishita Bose',
'Farhan Sheikh',
'Anjali Pillai',
'Rohit Desai',
'Kavya Rao',
'Manish Tiwari',
'Sneha Nair'];


export const liveEventKinds: LiveEventKind[] = [
'New Booking',
'Check-in',
'Check-out',
'Extension Request',
'Extension Approved',
'Cancellation',
'Refund Request',
'Payment Failure'];


const weights: LiveEventKind[] = [
'New Booking',
'New Booking',
'New Booking',
'Check-in',
'Check-in',
'Check-out',
'Extension Request',
'Extension Request',
'Extension Approved',
'Cancellation',
'Refund Request',
'Payment Failure'];


function clockLabel(offsetSeconds: number): string {
  const date = new Date(Date.now() - offsetSeconds * 1000);
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

let counter = 0;

export function makeLiveEvent(offsetSeconds = 0): LiveEvent {
  counter += 1;
  const seed = counter + Math.floor(Math.random() * 1000);
  const property = properties[seed % properties.length];
  const kind = weights[seed % weights.length];
  return {
    id: `EVT-${Date.now()}-${counter}`,
    kind,
    propertyName: property.name,
    city: property.city,
    guestName: guests[seed % guests.length],
    reference: `CHK-${74000 + seed % 900}`,
    amount:
    kind === 'Payment Failure' || kind === 'Refund Request' ?
    1200 + seed % 40 * 110 :
    kind === 'Extension Request' || kind === 'Extension Approved' ?
    420 + seed % 12 * 180 :
    1800 + seed % 30 * 240,
    at: clockLabel(offsetSeconds)
  };
}

export const seedLiveEvents: LiveEvent[] = Array.from({ length: 14 }, (_, index) =>
makeLiveEvent((index + 1) * 37)
);