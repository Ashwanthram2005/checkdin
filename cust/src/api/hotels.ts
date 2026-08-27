import api from './client';
import type { Duration, Hotel } from '../types/booking';

interface ApiHotel {
  id: string;
  name: string;
  area: string;
  city: string;
  image: string;
  rating: number;
  reviews_count: number;
  landmark: string;
  distance_km: number;
  intents: string;
  amenities: string;
  couple_friendly: number;
  local_id_accepted: number;
  instant_confirm: number;
  pay_at_hotel: number;
  business_friendly: number;
  chain: string;
  collection: string;
  slots_left: number;
  earliest_slot: string;
  rate_3h: number;
  rate_6h: number;
  rate_12h: number;
  about: string;
  policies: string;
  partner_id: string;
}

interface HotelsApiResponse {
  data: ApiHotel[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

function mapHotel(h: ApiHotel): Hotel {
  let intents: string[] = [];
  try { intents = JSON.parse(h.intents || '[]'); } catch {}

  let amenities: string[] = [];
  try { amenities = JSON.parse(h.amenities || '[]'); } catch {}

  let policies: string[] = [];
  try { policies = JSON.parse(h.policies || '[]'); } catch {}

  return {
    id: h.id,
    name: h.name,
    area: h.area,
    city: h.city,
    image: h.image,
    rating: h.rating,
    reviews: h.reviews_count,
    landmark: h.landmark,
    distanceKm: h.distance_km,
    intents: intents as Hotel['intents'],
    amenities,
    coupleFriendly: h.couple_friendly === 1,
    localIdAccepted: h.local_id_accepted === 1,
    instantConfirm: h.instant_confirm === 1,
    payAtHotel: h.pay_at_hotel === 1,
    businessFriendly: h.business_friendly === 1,
    chain: h.chain,
    collection: h.collection === 'Premium' ? 'premium' : h.collection === 'Luxury' ? 'luxury' : null,
    slotsLeft: h.slots_left,
    earliestSlot: h.earliest_slot,
    rates: { 3: h.rate_3h, 6: h.rate_6h, 12: h.rate_12h } as Record<Duration, number>,
    about: h.about,
    policies,
  };
}

export async function fetchHotels(params?: {
  search?: string;
  city?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: Hotel[]; total: number }> {
  const res = await api.get<HotelsApiResponse>('/api/customer/hotels', { params });
  return {
    data: res.data.data.map(mapHotel),
    total: res.data.total,
  };
}

export async function fetchHotelById(id: string): Promise<Hotel | null> {
  try {
    const res = await api.get<ApiHotel>(`/api/customer/hotels/${id}`);
    return mapHotel(res.data);
  } catch {
    return null;
  }
}
