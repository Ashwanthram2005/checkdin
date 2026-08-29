import { get, post, put } from '../utils/http';

export interface PartnerBooking {
  id: string;
  code: string;
  guest_name: string;
  room_type: string;
  check_in: string;
  check_out: string;
  status: string;
  total: number;
}

export interface PartnerRoom {
  id: string;
  name: string;
  type: string;
  status: string;
  price: number;
}

export interface PartnerPricing {
  room_type: string;
  base_price: number;
  current_price: number;
  min_price: number;
  max_price: number;
}

export interface PartnerAvailability {
  date: string;
  room_type: string;
  available: number;
  total: number;
}

export interface PartnerReview {
  id: string;
  guest_name: string;
  rating: number;
  comment: string;
  date: string;
  reply?: string;
}

export interface PartnerRevenue {
  date: string;
  revenue: number;
  bookings: number;
}

export interface PartnerPayout {
  id: string;
  amount: number;
  status: string;
  date: string;
  method: string;
}

export const partnerApi = {
  // Dashboard
  getDashboard: () => get<Record<string, unknown>>('/api/partner/dashboard'),

  // Bookings
  getBookings: () => get<PartnerBooking[]>('/api/partner/bookings'),
  getBooking: (id: string) => get<PartnerBooking>(`/api/partner/bookings/${id}`),
  mutateBooking: (id: string, action: string) =>
    post<{ ok: boolean }>(`/api/partner/bookings/${id}/${action}`),

  // Rooms
  getRooms: () => get<PartnerRoom[]>('/api/partner/rooms'),
  updateRooms: (payload: Record<string, unknown>[]) =>
    put<{ ok: boolean }>('/api/partner/rooms', payload),

  // Pricing
  getPricing: () => get<PartnerPricing[]>('/api/partner/pricing'),
  updatePricing: (payload: Record<string, unknown>) =>
    put<{ ok: boolean }>('/api/partner/pricing', payload),

  // Availability
  getAvailability: () => get<PartnerAvailability[]>('/api/partner/availability'),
  getAvailabilityByDate: (date: string) => get<PartnerAvailability[]>(`/api/partner/availability/${date}`),
  updateAvailability: (date: string, payload: Record<string, unknown>) =>
    put<{ ok: boolean }>(`/api/partner/availability/${date}`, payload),

  // Reviews
  getReviews: () => get<PartnerReview[]>('/api/partner/reviews'),
  replyToReview: (id: string, reply: string) =>
    post<{ ok: boolean }>(`/api/partner/reviews/${id}/reply`, { reply }),

  // Revenue
  getRevenue: () => get<PartnerRevenue[]>('/api/partner/revenue'),

  // Payouts
  getPayouts: () => get<PartnerPayout[]>('/api/partner/payouts'),

  // Reports
  getReports: () => get<Record<string, unknown>>('/api/partner/reports'),

  // Audit Log
  getAuditLog: () => get<Record<string, unknown>[]>('/api/partner/audit-log'),

  // Support
  getSupport: () => get<Record<string, unknown>>('/api/partner/support'),

  // Settings
  getSettings: () => get<Record<string, unknown>>('/api/partner/settings'),
};
