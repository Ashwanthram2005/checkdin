import { ROOM_IMAGES } from './dashboard';

export type Review = {
  id: string;
  guest: string;
  room: string;
  duration: string;
  stayedOn: string;
  rating: number;
  categories: {cleanliness: number;staff: number;value: number;};
  title: string;
  body: string;
  image: string;
  reply: {text: string;repliedOn: string;} | null;
  guestRating: {stars: number;tags: string[];} | null;
};

export const guestTags = ['Punctual', 'Polite', 'Left room tidy', 'Followed house rules', 'Would host again'];

export const reviews: Review[] = [
{
  id: 'r1',
  guest: 'Rahul Verma',
  room: 'Premium Room 201',
  duration: '12 Hours',
  stayedOn: '15 Aug 2026',
  rating: 5,
  categories: { cleanliness: 5, staff: 5, value: 4 },
  title: 'Spotless room and effortless check-in',
  body: 'Booked a 12-hour slot after a late flight. Reception had my room ready ahead of time and the room was spotless. The blackout curtains made a real difference for a daytime sleep.',
  image: ROOM_IMAGES.premium,
  reply: null,
  guestRating: null
},
{
  id: 'r2',
  guest: 'Sneha Iyer',
  room: 'Deluxe Room 105',
  duration: '3 Hours',
  stayedOn: '14 Aug 2026',
  rating: 4,
  categories: { cleanliness: 4, staff: 5, value: 4 },
  title: 'Great for a short work break',
  body: 'Quiet room with strong Wi-Fi, perfect for a few hours between meetings. Only note is that the AC took a while to cool down.',
  image: ROOM_IMAGES.deluxe,
  reply: null,
  guestRating: { stars: 5, tags: ['Punctual', 'Left room tidy'] }
},
{
  id: 'r3',
  guest: 'Arun Kumar',
  room: 'Deluxe Room 101',
  duration: '3 Hours',
  stayedOn: '13 Aug 2026',
  rating: 3,
  categories: { cleanliness: 3, staff: 4, value: 3 },
  title: 'Comfortable, but housekeeping was delayed',
  body: 'Room was fine overall and the staff were courteous. Had to wait about 20 minutes at check-in because housekeeping was still finishing up.',
  image: ROOM_IMAGES.deluxe,
  reply: {
    text: 'Thank you for the honest feedback, Arun. We have added a second housekeeping attendant on the afternoon shift so rooms are ready before the slot begins. Hope to host you again.',
    repliedOn: '13 Aug 2026'
  },
  guestRating: { stars: 4, tags: ['Polite'] }
},
{
  id: 'r4',
  guest: 'Priya Sharma',
  room: 'Deluxe Room 103',
  duration: '6 Hours',
  stayedOn: '12 Aug 2026',
  rating: 5,
  categories: { cleanliness: 5, staff: 5, value: 5 },
  title: 'Best value near T. Nagar',
  body: 'Hourly pricing is genuinely fair and the room felt brand new. Loved that ID verification was done on the app before I arrived.',
  image: ROOM_IMAGES.suite,
  reply: {
    text: 'So glad the app check-in worked well for you, Priya. See you on your next visit!',
    repliedOn: '12 Aug 2026'
  },
  guestRating: null
},
{
  id: 'r5',
  guest: 'Vikram Raj',
  room: 'Premium Room 202',
  duration: '6 Hours',
  stayedOn: '10 Aug 2026',
  rating: 2,
  categories: { cleanliness: 2, staff: 3, value: 2 },
  title: 'Bathroom needed attention',
  body: 'The room itself was okay but the bathroom had not been cleaned properly. Staff sorted it after I called, though it took a while.',
  image: ROOM_IMAGES.premium,
  reply: null,
  guestRating: null
}];


export const ratingDistribution = [
{ stars: 5, count: 128 },
{ stars: 4, count: 61 },
{ stars: 3, count: 22 },
{ stars: 2, count: 9 },
{ stars: 1, count: 4 }];