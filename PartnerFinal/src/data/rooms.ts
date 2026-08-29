import { ROOM_IMAGES } from './dashboard';
import { galleryPhotos } from './settings';

export type AvailabilityStatus =
'Active' |
'Inactive' |
'Under Maintenance' |
'Temporarily Unavailable';

export const availabilityOptions: {
  id: AvailabilityStatus;
  description: string;
}[] = [
{ id: 'Active', description: 'Bookable now and visible in guest search.' },
{ id: 'Inactive', description: 'Hidden from search until you switch it back on.' },
{ id: 'Under Maintenance', description: 'Blocked for repairs — no new bookings accepted.' },
{
  id: 'Temporarily Unavailable',
  description: 'Paused for a short period, existing bookings stay confirmed.'
}];


export const amenityOptions = ['WiFi', 'AC', 'TV', 'Hot Water', 'Workspace', 'Wardrobe'];

export const facilityOptions = [
'Parking',
'Lift',
'Restaurant',
'Reception',
'Room Service',
'Security'];


/** Every Checkdin room needs this exact set of shots before it can go live. */
export type RoomPhotoSlotId =
'cover' |
'bed' |
'angle1' |
'angle2' |
'bathroom' |
'bathroomClose' |
'tv' |
'wardrobe' |
'window' |
'amenities';

export type RoomPhoto = {
  id: RoomPhotoSlotId;
  label: string;
  hint: string;
  url: string | null;
};

export const requiredPhotoSlots: {id: RoomPhotoSlotId;label: string;hint: string;}[] = [
{ id: 'cover', label: 'Room Cover Photo', hint: 'Best wide-angle shot of the whole room' },
{ id: 'bed', label: 'Bed Area', hint: 'Made bed, straight on' },
{ id: 'angle1', label: 'Room View – Angle 1', hint: 'From the door' },
{ id: 'angle2', label: 'Room View – Angle 2', hint: 'From the opposite corner' },
{ id: 'bathroom', label: 'Bathroom Full View', hint: 'Whole bathroom in frame' },
{ id: 'bathroomClose', label: 'Bathroom Close-Up', hint: 'Shower, basin and fittings' },
{ id: 'tv', label: 'TV / Entertainment Area', hint: 'TV wall or media unit' },
{ id: 'wardrobe', label: 'Wardrobe / Storage Area', hint: 'Open wardrobe or luggage space' },
{ id: 'window', label: 'Window / Balcony View', hint: 'What guests see outside' },
{
  id: 'amenities',
  label: 'Amenities Photo',
  hint: 'AC, Wi-Fi router, kettle, mini-fridge, toiletries'
}];


export type RoomProfile = {
  photos: RoomPhoto[];
  amenities: string[];
  facilities: string[];
  capacity: {
    maxAdults: number;
    maxChildren: number;
    extraGuestAllowed: boolean;
    extraGuestFee: number;
  };
  description: {
    short: string;
    highlights: string[];
    landmarks: {id: string;name: string;distance: string;}[];
  };
  availability: AvailabilityStatus;
};

/** Checkdin is an hourly stay product — one standard room setup for the whole property. */
export const roomProfile: RoomProfile = {
  photos: requiredPhotoSlots.map((slot) => ({
    ...slot,
    url:
    slot.id === 'cover' ?
    ROOM_IMAGES.deluxe :
    slot.id === 'bed' ?
    ROOM_IMAGES.suite :
    slot.id === 'angle1' ?
    ROOM_IMAGES.premium :
    slot.id === 'angle2' ?
    galleryPhotos[1].url :
    null
  })),
  amenities: ['WiFi', 'AC', 'TV', 'Hot Water', 'Wardrobe'],
  facilities: ['Parking', 'Lift', 'Reception', 'Security'],
  capacity: { maxAdults: 2, maxChildren: 1, extraGuestAllowed: true, extraGuestFee: 300 },
  description: {
    short:
    'A quiet 210 sq ft room with a queen bed, blackout curtains and a compact work desk — serviced before every slot and built for 3 to 12 hour stays.',
    highlights: ['Blackout curtains', '200 Mbps Wi-Fi', 'Serviced before every slot'],
    landmarks: [
    { id: 'l1', name: 'T. Nagar Metro Station', distance: '600 m' },
    { id: 'l2', name: 'Panagal Park', distance: '1.2 km' },
    { id: 'l3', name: 'Chennai Central', distance: '5.4 km' }]

  },
  availability: 'Active'
};