import type { Duration } from '../types/booking';

export const durations: {value: Duration;label: string;}[] = [
{ value: 3, label: '3 hours' },
{ value: 6, label: '6 hours' },
{ value: 12, label: '12 hours' }];


/** Live cities. Chennai only while we build out inventory. */
export const cities = ['Chennai'];

export const checkInTimes = [
'00:00',
'02:00',
'04:00',
'06:00',
'08:00',
'09:00',
'10:00',
'11:00',
'12:00',
'13:00',
'14:00',
'15:00',
'16:00',
'18:00',
'20:00',
'22:00'];