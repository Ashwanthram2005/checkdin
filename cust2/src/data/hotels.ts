import type { Hotel } from '../types/booking';

const IMG_BUSINESS = "/55045ec9-90f0-4ff4-a07b-fd109abd241c.jpg";

const IMG_BOUTIQUE = "/12860e87-9363-455f-a24c-2f758cb8e478.jpg";

const IMG_BUDGET = "/69b5f7c4-959d-4fb0-a208-8560954524bd.jpg";

const IMG_UPSCALE = "/1dd938ef-8955-4cf0-a8af-80866ae232ec.jpg";


export const hotels: Hotel[] = [
{
  id: 'porur-junction',
  name: 'Porur Junction Stay',
  area: 'Porur',
  city: 'Chennai',
  image: IMG_BUSINESS,
  rating: 4.6,
  reviews: 1284,
  landmark: 'Porur Toll Plaza',
  distanceKm: 0.8,
  intents: ['layover', 'dayuse'],
  amenities: ['Free parking', 'Blackout curtains', 'Hot shower', 'Wi-Fi 200 Mbps', '24h reception'],
  coupleFriendly: false,
  localIdAccepted: true,
  instantConfirm: true,
  payAtHotel: true,
  businessFriendly: true,
  chain: 'Grand Continent Hotels',
  collection: 'premium',
  slotsLeft: 3,
  earliestSlot: '00:00',
  rates: { 3: 749, 6: 1149, 12: 1849 },
  about:
  'First stop off the Bangalore highway. Sound-insulated rooms, free parking for the car, and a reception desk that never closes.',
  policies: [
  'Government-issued photo ID required at check-in',
  'Free parking for the length of your slot',
  'Free cancellation up to 2 hours before your slot']

},
{
  id: 'porur-ivory-court',
  name: 'Ivory Court, Porur',
  area: 'Porur',
  city: 'Chennai',
  image: IMG_BOUTIQUE,
  rating: 4.8,
  reviews: 942,
  landmark: 'Ramachandra Hospital',
  distanceKm: 1.4,
  intents: ['couple', 'dayuse'],
  amenities: ['Private lift access', 'Soundproof rooms', 'In-room dining', 'Wi-Fi 100 Mbps', 'Discreet billing'],
  coupleFriendly: true,
  localIdAccepted: true,
  instantConfirm: true,
  payAtHotel: false,
  businessFriendly: false,
  chain: 'Bloom Hotel',
  collection: 'luxury',
  slotsLeft: 2,
  earliestSlot: '11:00',
  rates: { 3: 1099, 6: 1699, 12: 2499 },
  about:
  'A quiet boutique floor set back from Mount Poonamallee Road. Unmarried couples are welcome with local ID, entry is by private lift, and the bill reads as a stay.',
  policies: [
  'Unmarried couples welcome — local ID accepted',
  'Both guests must carry original photo ID',
  'Free cancellation up to 2 hours before your slot']

},
{
  id: 'porur-nap-rooms',
  name: 'Porur Nap Rooms',
  area: 'Porur',
  city: 'Chennai',
  image: IMG_BUDGET,
  rating: 4.3,
  reviews: 2106,
  landmark: 'Porur Bus Terminus',
  distanceKm: 0.3,
  intents: ['layover', 'dayuse'],
  amenities: ['Luggage lockers', 'Hot shower', 'Wake-up call', 'Wi-Fi 80 Mbps'],
  coupleFriendly: false,
  localIdAccepted: true,
  instantConfirm: true,
  payAtHotel: true,
  businessFriendly: false,
  chain: 'Ginger Hotels',
  collection: null,
  slotsLeft: 7,
  earliestSlot: '00:30',
  rates: { 3: 499, 6: 799, 12: 1299 },
  about:
  'A four-minute walk from the terminus. Compact, spotless rooms sold in short blocks, with lockers for the bags you would rather not carry around.',
  policies: [
  'Government-issued photo ID required at check-in',
  'Luggage lockers free for the length of your slot',
  'Free cancellation up to 1 hour before your slot']

},
{
  id: 'ramapuram-olive',
  name: 'The Olive, Ramapuram',
  area: 'Ramapuram',
  city: 'Chennai',
  image: IMG_UPSCALE,
  rating: 4.7,
  reviews: 613,
  landmark: 'DLF IT Park',
  distanceKm: 0.6,
  intents: ['dayuse', 'couple'],
  amenities: ['Day-use desk', 'Meeting nook', 'Espresso bar', 'Wi-Fi 300 Mbps', 'Gym access'],
  coupleFriendly: true,
  localIdAccepted: true,
  instantConfirm: false,
  payAtHotel: false,
  businessFriendly: true,
  chain: 'Holiday Inn Express',
  collection: 'premium',
  slotsLeft: 4,
  earliestSlot: '09:00',
  rates: { 3: 1299, 6: 1999, 12: 2899 },
  about:
  'Built for the DLF campus crowd. Take a room between meetings, use the desk and the 300 Mbps line, then shower before the evening drive home.',
  policies: [
  'Unmarried couples welcome — local ID accepted',
  'Property confirms within 10 minutes of booking',
  'Free cancellation up to 3 hours before your slot']

},
{
  id: 'ramapuram-quarter',
  name: 'Ramapuram Quarter',
  area: 'Ramapuram',
  city: 'Chennai',
  image: IMG_UPSCALE,
  rating: 4.8,
  reviews: 389,
  landmark: 'Ramapuram Bus Terminus',
  distanceKm: 1.0,
  intents: ['dayuse', 'couple'],
  amenities: ['Meeting nook', 'Espresso bar', 'Private lift access', 'Wi-Fi 300 Mbps', 'Gym access'],
  coupleFriendly: true,
  localIdAccepted: true,
  instantConfirm: true,
  payAtHotel: false,
  businessFriendly: true,
  chain: 'Wyndham Hotels',
  collection: 'luxury',
  slotsLeft: 2,
  earliestSlot: '09:00',
  rates: { 3: 1399, 6: 2099, 12: 3099 },
  about:
  'Our most expensive slot in west Chennai, and the one clients book for interviews and closings. Twelve rooms, full service, no front-desk queue.',
  policies: [
  'Unmarried couples welcome — local ID accepted',
  'Both guests must carry original photo ID',
  'Free cancellation up to 3 hours before your slot']

},
{
  id: 'virugambakkam-harbour',
  name: 'Arcot Rest, Virugambakkam',
  area: 'Virugambakkam',
  city: 'Chennai',
  image: IMG_BOUTIQUE,
  rating: 4.2,
  reviews: 388,
  landmark: 'Arcot Road',
  distanceKm: 1.1,
  intents: ['dayuse', 'couple'],
  amenities: ['Rooftop seating', 'Hot shower', 'In-room dining', 'Wi-Fi 60 Mbps'],
  coupleFriendly: true,
  localIdAccepted: true,
  instantConfirm: true,
  payAtHotel: true,
  businessFriendly: false,
  chain: 'Pride Hotels',
  collection: null,
  slotsLeft: 5,
  earliestSlot: '10:00',
  rates: { 3: 899, 6: 1349, 12: 2049 },
  about:
  'An old building with high ceilings just off Arcot Road. Upper-floor rooms stay cool through the afternoon and the rooftop is open until midnight.',
  policies: [
  'Unmarried couples welcome — local ID accepted',
  'Government-issued photo ID required at check-in',
  'Free cancellation up to 2 hours before your slot']

},
{
  id: 'virugambakkam-studio',
  name: 'Virugambakkam Studio Rooms',
  area: 'Virugambakkam',
  city: 'Chennai',
  image: IMG_BUSINESS,
  rating: 4.0,
  reviews: 954,
  landmark: 'Virugambakkam Bus Depot',
  distanceKm: 0.4,
  intents: ['dayuse', 'layover'],
  amenities: ['Bus depot nearby', 'Twin beds', 'Iron & board', 'Wi-Fi 80 Mbps'],
  coupleFriendly: false,
  localIdAccepted: true,
  instantConfirm: true,
  payAtHotel: true,
  businessFriendly: false,
  chain: 'Ginger Hotels',
  collection: null,
  slotsLeft: 11,
  earliestSlot: '05:00',
  rates: { 3: 549, 6: 899, 12: 1399 },
  about:
  'Studio rooms a minute from the depot, built for crews on early shifts and anyone who needs a shower between them.',
  policies: [
  'Government-issued photo ID required at check-in',
  'Free cancellation up to 2 hours before your slot']

},
{
  id: 'valasaravakkam-hours',
  name: 'Valasaravakkam Hours',
  area: 'Valasaravakkam',
  city: 'Chennai',
  image: IMG_BUDGET,
  rating: 4.1,
  reviews: 1543,
  landmark: 'Alwarthirunagar Signal',
  distanceKm: 0.6,
  intents: ['dayuse', 'couple'],
  amenities: ['Hot shower', 'Luggage lockers', 'In-room dining', 'Wi-Fi 90 Mbps'],
  coupleFriendly: true,
  localIdAccepted: true,
  instantConfirm: true,
  payAtHotel: true,
  businessFriendly: false,
  chain: 'Ginger Hotels',
  collection: null,
  slotsLeft: 6,
  earliestSlot: '08:00',
  rates: { 3: 599, 6: 949, 12: 1499 },
  about:
  'A practical mid-market floor on the Alwarthirunagar stretch. Book three hours to rest, shower, and leave the bags in a locker.',
  policies: [
  'Unmarried couples welcome — local ID accepted',
  'Government-issued photo ID required at check-in',
  'Free cancellation up to 2 hours before your slot']

},
{
  id: 'valasaravakkam-loft',
  name: 'Valasaravakkam Loft Rooms',
  area: 'Valasaravakkam',
  city: 'Chennai',
  image: IMG_UPSCALE,
  rating: 4.5,
  reviews: 486,
  landmark: 'Valasaravakkam Market',
  distanceKm: 1.2,
  intents: ['dayuse', 'couple'],
  amenities: ['Day-use desk', 'Blackout curtains', 'Espresso bar', 'Wi-Fi 250 Mbps'],
  coupleFriendly: true,
  localIdAccepted: true,
  instantConfirm: true,
  payAtHotel: false,
  businessFriendly: true,
  chain: 'Bloom Hotel',
  collection: 'premium',
  slotsLeft: 4,
  earliestSlot: '09:00',
  rates: { 3: 1149, 6: 1749, 12: 2599 },
  about:
  'Loft-style rooms with high windows and a quiet co-working corner, a short ride from the Arcot Road junction.',
  policies: [
  'Unmarried couples welcome — local ID accepted',
  'Government-issued photo ID required at check-in',
  'Free cancellation up to 2 hours before your slot']

},
{
  id: 'mugalivakkam-verandah',
  name: 'Mugalivakkam Verandah',
  area: 'Mugalivakkam',
  city: 'Chennai',
  image: IMG_BOUTIQUE,
  rating: 4.7,
  reviews: 725,
  landmark: 'Mugalivakkam Main Road',
  distanceKm: 0.9,
  intents: ['couple', 'dayuse'],
  amenities: ['Private lift access', 'Garden verandah', 'Discreet billing', 'Wi-Fi 150 Mbps'],
  coupleFriendly: true,
  localIdAccepted: true,
  instantConfirm: true,
  payAtHotel: false,
  businessFriendly: false,
  chain: 'Bloom Hotel',
  collection: 'luxury',
  slotsLeft: 2,
  earliestSlot: '11:00',
  rates: { 3: 1249, 6: 1899, 12: 2799 },
  about:
  'A converted bungalow with six quiet rooms, each opening onto a shaded verandah. Entry is private and the billing is discreet.',
  policies: [
  'Unmarried couples welcome — local ID accepted',
  'Both guests must carry original photo ID',
  'Free cancellation up to 2 hours before your slot']

},
{
  id: 'mugalivakkam-halt',
  name: 'Mugalivakkam Halt',
  area: 'Mugalivakkam',
  city: 'Chennai',
  image: IMG_BUDGET,
  rating: 4.0,
  reviews: 1890,
  landmark: 'Kattupakkam Border',
  distanceKm: 0.2,
  intents: ['layover', 'dayuse'],
  amenities: ['Free parking', 'Luggage lockers', 'Wake-up call', 'Wi-Fi 70 Mbps'],
  coupleFriendly: false,
  localIdAccepted: true,
  instantConfirm: true,
  payAtHotel: true,
  businessFriendly: false,
  chain: 'Ginger Hotels',
  collection: null,
  slotsLeft: 9,
  earliestSlot: '00:00',
  rates: { 3: 449, 6: 749, 12: 1199 },
  about:
  'The cheapest clean bed in the belt. Compact rooms, 24-hour reception, and a wake-up call you can actually rely on.',
  policies: [
  'Government-issued photo ID required at check-in',
  'Luggage lockers free for the length of your slot',
  'Free cancellation up to 1 hour before your slot']

},
{
  id: 'maduravoyal-transit',
  name: 'Maduravoyal Transit Suites',
  area: 'Maduravoyal',
  city: 'Chennai',
  image: IMG_BUSINESS,
  rating: 4.4,
  reviews: 771,
  landmark: 'Maduravoyal Junction',
  distanceKm: 0.5,
  intents: ['layover', 'dayuse', 'couple'],
  amenities: ['Bypass access', 'Twin beds', 'Iron & board', 'Wi-Fi 120 Mbps', '24h check-in'],
  coupleFriendly: true,
  localIdAccepted: true,
  instantConfirm: true,
  payAtHotel: true,
  businessFriendly: true,
  chain: 'Wyndham Hotels',
  collection: 'premium',
  slotsLeft: 1,
  earliestSlot: '06:00',
  rates: { 3: 649, 6: 999, 12: 1599 },
  about:
  'Right on the junction where the bypass meets Poonamallee High Road — the practical stop for a few hours of sleep and a change of clothes.',
  policies: [
  'Unmarried couples welcome — local ID accepted',
  'Government-issued photo ID required at check-in',
  'Free cancellation up to 2 hours before your slot']

},
{
  id: 'maduravoyal-nest',
  name: 'Maduravoyal Nest',
  area: 'Maduravoyal',
  city: 'Chennai',
  image: IMG_BUDGET,
  rating: 4.3,
  reviews: 638,
  landmark: 'Nerkundram Signal',
  distanceKm: 0.7,
  intents: ['dayuse', 'couple'],
  amenities: ['Day-use desk', 'Hot shower', 'Free parking', 'Wi-Fi 120 Mbps'],
  coupleFriendly: true,
  localIdAccepted: true,
  instantConfirm: true,
  payAtHotel: true,
  businessFriendly: true,
  chain: 'Grand Continent Hotels',
  collection: 'premium',
  slotsLeft: 8,
  earliestSlot: '07:00',
  rates: { 3: 849, 6: 1299, 12: 1999 },
  about:
  'A calm residential block off the Nerkundram stretch, popular with sales teams working the west Chennai circuit.',
  policies: [
  'Unmarried couples welcome — local ID accepted',
  'Government-issued photo ID required at check-in',
  'Free cancellation up to 2 hours before your slot']

},
{
  id: 'maduravoyal-courtyard',
  name: 'Maduravoyal Courtyard',
  area: 'Maduravoyal',
  city: 'Chennai',
  image: IMG_UPSCALE,
  rating: 4.6,
  reviews: 512,
  landmark: 'Chennai Bypass',
  distanceKm: 1.5,
  intents: ['dayuse', 'couple'],
  amenities: ['Courtyard seating', 'Filter coffee service', 'Soundproof rooms', 'Wi-Fi 110 Mbps'],
  coupleFriendly: true,
  localIdAccepted: true,
  instantConfirm: false,
  payAtHotel: false,
  businessFriendly: false,
  chain: 'Wyndham Hotels',
  collection: 'luxury',
  slotsLeft: 3,
  earliestSlot: '10:00',
  rates: { 3: 1199, 6: 1849, 12: 2699 },
  about:
  'Rooms wrapped around a tiled courtyard, set far enough back from the bypass that you stop hearing it. Our quietest west Chennai inventory.',
  policies: [
  'Unmarried couples welcome — local ID accepted',
  'Property confirms within 10 minutes of booking',
  'Free cancellation up to 3 hours before your slot']

},
{
  id: 'iyyappanthangal-inn',
  name: 'Iyyappanthangal Transit Inn',
  area: 'Iyyappanthangal',
  city: 'Chennai',
  image: IMG_BUDGET,
  rating: 3.9,
  reviews: 1176,
  landmark: 'Kumananchavadi Signal',
  distanceKm: 0.5,
  intents: ['layover', 'dayuse'],
  amenities: ['Highway access', 'Luggage lockers', 'Hot shower', 'Wi-Fi 60 Mbps'],
  coupleFriendly: false,
  localIdAccepted: true,
  instantConfirm: true,
  payAtHotel: true,
  businessFriendly: false,
  chain: 'Holiday Inn Express',
  collection: null,
  slotsLeft: 7,
  earliestSlot: '00:00',
  rates: { 3: 429, 6: 699, 12: 1149 },
  about:
  'The western gateway stop. Plain, clean rooms for drivers and passengers waiting out a long gap on the Bangalore route.',
  policies: [
  'Government-issued photo ID required at check-in',
  'Luggage lockers free for the length of your slot',
  'Free cancellation up to 1 hour before your slot']

},
{
  id: 'iyyappanthangal-park',
  name: 'Park View, Iyyappanthangal',
  area: 'Iyyappanthangal',
  city: 'Chennai',
  image: IMG_BUSINESS,
  rating: 4.2,
  reviews: 402,
  landmark: 'DLF IT Park, Phase 2',
  distanceKm: 1.8,
  intents: ['dayuse', 'layover'],
  amenities: ['Free parking', 'Day-use desk', 'In-room dining', 'Wi-Fi 200 Mbps'],
  coupleFriendly: true,
  localIdAccepted: true,
  instantConfirm: false,
  payAtHotel: true,
  businessFriendly: true,
  chain: 'Pride Hotels',
  collection: null,
  slotsLeft: 5,
  earliestSlot: '06:00',
  rates: { 3: 699, 6: 1049, 12: 1699 },
  about:
  'For teams commuting in from Sriperumbudur. Park free, work six hours at the desk, and beat the evening jam back out.',
  policies: [
  'Unmarried couples welcome — local ID accepted',
  'Property confirms within 10 minutes of booking',
  'Free cancellation up to 2 hours before your slot']

}];


export function getHotel(id: string): Hotel | undefined {
  return hotels.find((h) => h.id === id);
}

const allImages = [IMG_BUSINESS, IMG_BOUTIQUE, IMG_BUDGET, IMG_UPSCALE];

/** Gallery for a property: its own shot first, then the rest of the set. */
export function galleryFor(hotel: Hotel): string[] {
  return [hotel.image, ...allImages.filter((img) => img !== hotel.image)];
}