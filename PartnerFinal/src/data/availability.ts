export type SlotKey = 'morning' | 'afternoon' | 'evening' | 'night';

export const slotWindows: {id: SlotKey;label: string;window: string;}[] = [
{ id: 'morning', label: 'Morning', window: '6 AM – 12 PM' },
{ id: 'afternoon', label: 'Afternoon', window: '12 PM – 6 PM' },
{ id: 'evening', label: 'Evening', window: '6 PM – 12 AM' },
{ id: 'night', label: 'Night', window: '12 AM – 6 AM' }];


export type DayAvailability = {
  id: string;
  date: string;
  day: string;
  allocated: number;
  booked: number;
  blocked: boolean;
};

export const inventory = {
  totalRooms: 25,
  allocatedToCheckdin: 14
};

export const upcomingDays: DayAvailability[] = [
{ id: 'd1', date: '16 Aug', day: 'Sat', allocated: 14, booked: 11, blocked: false },
{ id: 'd2', date: '17 Aug', day: 'Sun', allocated: 14, booked: 9, blocked: false },
{ id: 'd3', date: '18 Aug', day: 'Mon', allocated: 12, booked: 5, blocked: false },
{ id: 'd4', date: '19 Aug', day: 'Tue', allocated: 12, booked: 4, blocked: false },
{ id: 'd5', date: '20 Aug', day: 'Wed', allocated: 12, booked: 6, blocked: false },
{ id: 'd6', date: '21 Aug', day: 'Thu', allocated: 0, booked: 0, blocked: true },
{ id: 'd7', date: '22 Aug', day: 'Fri', allocated: 14, booked: 8, blocked: false }];


export const slotAllocation: Record<SlotKey, number> = {
  morning: 8,
  afternoon: 14,
  evening: 14,
  night: 10
};