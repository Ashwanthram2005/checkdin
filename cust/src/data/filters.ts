export const popularTags = ['Couple Friendly', 'Pay At Hotel', 'Instant Check-in'];

/** Live serviceable areas. West Chennai belt only while we build out inventory. */
export const chennaiAreas = [
'Porur',
'Virugambakkam',
'Valasaravakkam',
'Mugalivakkam',
'Maduravoyal',
'Iyyappanthangal',
'Ramapuram'];


/** Cities we are opening next — shown in the location picker as "Soon". */
export const upcomingCities = [
'Coimbatore',
'Madurai',
'Bengaluru',
'Hyderabad',
'Kochi',
'Pune',
'Delhi NCR'];


export const collections: {
  id: 'premium' | 'luxury';
  label: string;
  body: string;
}[] = [
{
  id: 'premium',
  label: 'Premium',
  body: 'Hotels with superior facilities and prime location, created for your comfort'
},
{
  id: 'luxury',
  label: 'Luxury',
  body: 'Impeccable accommodation and an elegant experience in renowned hotel brands'
}];


export const hotelChains = [
'Bloom Hotel',
'Grand Continent Hotels',
'Wyndham Hotels',
'Pride Hotels',
'Holiday Inn Express',
'Ginger Hotels'];


export const ratingSteps = [3, 3.5, 4, 4.5];

export const bookingNotes = [
'Prices shown include the Checkdin service fee. Nothing else is added at the desk — for a detailed invoice, contact the hotel reception once the booking is confirmed.',
'We provide flexible check-in and check-out within your slot.',
'The following standard amenities are provided to every guest after booking.'];