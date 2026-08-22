import type { Room, RoomStatus } from '../types';
import { properties } from './properties';

const types: Room['type'][] = ['Deluxe', 'Standard', 'Suite', 'Dorm Bed', 'Executive'];
const statuses: RoomStatus[] = [
'Available',
'Occupied',
'Occupied',
'Available',
'Blocked',
'Maintenance',
'Occupied',
'Available'];


export const rooms: Room[] = properties.flatMap((property, propertyIndex) =>
Array.from({ length: 6 }, (_, index) => {
  const type = types[(propertyIndex + index) % types.length];
  const status = statuses[(propertyIndex * 3 + index) % statuses.length];
  const floor = 1 + index % 4;
  return {
    id: `${property.id}-R${index + 1}`,
    code: `${property.id.replace('PRP-', 'RM')}${floor}0${index + 1}`,
    propertyId: property.id,
    propertyName: property.name,
    name: `${type} ${floor}0${index + 1}`,
    type,
    capacity: type === 'Dorm Bed' ? 1 : type === 'Suite' ? 4 : 2,
    baseRate:
    type === 'Suite' ? 7800 : type === 'Executive' ? 5400 : type === 'Deluxe' ? 3900 : type === 'Standard' ? 2600 : 900,
    status,
    floor,
    nextCheckIn: status === 'Available' ? `2026-08-${20 + index % 8}` : undefined
  };
})
);

export function roomsForProperty(propertyId: string): Room[] {
  return rooms.filter((room) => room.propertyId === propertyId);
}