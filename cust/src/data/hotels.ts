import type { Hotel } from '../types/booking';
import { fetchHotels, fetchHotelById } from '../api/hotels';

const IMG_BUSINESS = "/55045ec9-90f0-4ff4-a07b-fd109abd241c.jpg";
const IMG_BOUTIQUE = "/12860e87-9363-455f-a24c-2f758cb8e478.jpg";
const IMG_BUDGET = "/69b5f7c4-959d-4fb0-a208-8560954524bd.jpg";
const IMG_UPSCALE = "/1dd938ef-8955-4cf0-a8af-80866ae232ec.jpg";

export { IMG_BUSINESS, IMG_BOUTIQUE, IMG_BUDGET, IMG_UPSCALE };

const allImages = [IMG_BUSINESS, IMG_BOUTIQUE, IMG_BUDGET, IMG_UPSCALE];

export async function loadHotels(params?: {
  search?: string;
  city?: string;
  page?: number;
  limit?: number;
}): Promise<{ hotels: Hotel[]; total: number }> {
  try {
    const res = await fetchHotels(params);
    return { hotels: res.data, total: res.total };
  } catch {
    return { hotels: [], total: 0 };
  }
}

export async function loadHotel(id: string): Promise<Hotel | undefined> {
  try {
    const hotel = await fetchHotelById(id);
    return hotel ?? undefined;
  } catch {
    return undefined;
  }
}

export function galleryFor(hotel: Hotel): string[] {
  return [hotel.image, ...allImages.filter((img) => img !== hotel.image)];
}
