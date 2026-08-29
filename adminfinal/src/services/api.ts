import type {
  AdminUser,
  AuditLog,
  Booking,
  Campaign,
  Coupon,
  Customer,
  FraudAlert,
  Partner,
  Payout,
  PricingRule,
  Property,
  Refund,
  Review,
  Room,
  Ticket,
} from '../types';
import { get, post, put, del } from '../utils/http';

export const api = {
  // Bookings
  getBookings: () => get<Booking[]>('/api/admin/bookings'),
  getBooking: (id: string) => get<Booking>(`/api/admin/bookings/${id}`),
  mutateBooking: (id: string, action: string, payload?: Record<string, unknown>) =>
    post<{ ok: boolean }>(`/api/admin/bookings/${id}/mutate`, { action, ...payload }),

  // Properties
  getProperties: () => get<Property[]>('/api/admin/properties'),
  getProperty: (id: string) => get<Property>(`/api/admin/properties/${id}`),
  mutateProperty: (id: string, action: string, payload?: Record<string, unknown>) =>
    post<{ ok: boolean }>(`/api/admin/properties/${id}/mutate`, { action, ...payload }),

  // Rooms
  getRooms: () => get<Room[]>('/api/admin/rooms'),
  getRoom: (id: string) => get<Room>(`/api/admin/rooms/${id}`),
  createRoom: (payload: Record<string, unknown>) => post<Room>('/api/admin/rooms', payload),
  mutateRoom: (id: string, action: string, payload?: Record<string, unknown>) =>
    post<{ ok: boolean }>(`/api/admin/rooms/${id}/mutate`, { action, ...payload }),

  // Partners
  getPartners: () => get<Partner[]>('/api/admin/partners'),
  getPartner: (id: string) => get<Partner>(`/api/admin/partners/${id}`),
  mutatePartner: (id: string, action: string, payload?: Record<string, unknown>) =>
    post<{ ok: boolean }>(`/api/admin/partners/${id}/mutate`, { action, ...payload }),

  // Customers
  getCustomers: () => get<Customer[]>('/api/admin/customers'),
  getCustomer: (id: string) => get<Customer>(`/api/admin/customers/${id}`),
  mutateCustomer: (id: string, action: string, payload?: Record<string, unknown>) =>
    post<{ ok: boolean }>(`/api/admin/customers/${id}/mutate`, { action, ...payload }),

  // Payouts
  getPayouts: () => get<Payout[]>('/api/admin/payouts'),
  getPayout: (id: string) => get<Payout>(`/api/admin/payouts/${id}`),
  mutatePayout: (id: string, action: string, payload?: Record<string, unknown>) =>
    post<{ ok: boolean }>(`/api/admin/payouts/${id}/mutate`, { action, ...payload }),

  // Refunds
  getRefunds: () => get<Refund[]>('/api/admin/refunds'),
  getRefund: (id: string) => get<Refund>(`/api/admin/refunds/${id}`),
  mutateRefund: (id: string, action: string, payload?: Record<string, unknown>) =>
    post<{ ok: boolean }>(`/api/admin/refunds/${id}/mutate`, { action, ...payload }),

  // Reviews
  getReviews: () => get<Review[]>('/api/admin/reviews'),
  getReview: (id: string) => get<Review>(`/api/admin/reviews/${id}`),
  mutateReview: (id: string, action: string, payload?: Record<string, unknown>) =>
    post<{ ok: boolean }>(`/api/admin/reviews/${id}/mutate`, { action, ...payload }),

  // Tickets
  getTickets: () => get<Ticket[]>('/api/admin/tickets'),
  getTicket: (id: string) => get<Ticket>(`/api/admin/tickets/${id}`),
  mutateTicket: (id: string, action: string, payload?: Record<string, unknown>) =>
    post<{ ok: boolean }>(`/api/admin/tickets/${id}/mutate`, { action, ...payload }),

  // Coupons
  getCoupons: () => get<Coupon[]>('/api/admin/coupons'),
  getCoupon: (id: string) => get<Coupon>(`/api/admin/coupons/${id}`),
  createCoupon: (payload: Record<string, unknown>) => post<Coupon>('/api/admin/coupons', payload),
  updateCoupon: (id: string, payload: Record<string, unknown>) =>
    put<Coupon>(`/api/admin/coupons/${id}`, payload),

  // Campaigns
  getCampaigns: () => get<Campaign[]>('/api/admin/campaigns'),
  getCampaign: (id: string) => get<Campaign>(`/api/admin/campaigns/${id}`),
  createCampaign: (payload: Record<string, unknown>) => post<Campaign>('/api/admin/campaigns', payload),
  updateCampaign: (id: string, payload: Record<string, unknown>) =>
    put<Campaign>(`/api/admin/campaigns/${id}`, payload),
  deleteCampaign: (id: string) => del<{ ok: boolean }>(`/api/admin/campaigns/${id}`),

  // Audit Logs
  getAuditLogs: () => get<AuditLog[]>('/api/admin/audit-logs'),

  // Admin Users
  getAdminUsers: () => get<AdminUser[]>('/api/admin/admin-users'),
  getAdminUser: (id: string) => get<AdminUser>(`/api/admin/admin-users/${id}`),
  createAdminUser: (payload: Record<string, unknown>) => post<AdminUser>('/api/admin/admin-users', payload),
  updateAdminUser: (id: string, payload: Record<string, unknown>) =>
    put<AdminUser>(`/api/admin/admin-users/${id}`, payload),
  deleteAdminUser: (id: string) => del<{ ok: boolean }>(`/api/admin/admin-users/${id}`),

  // Fraud Alerts
  getFraudAlerts: () => get<FraudAlert[]>('/api/admin/fraud'),
  getFraudAlert: (id: string) => get<FraudAlert>(`/api/admin/fraud/${id}`),
  mutateFraudAlert: (id: string, action: string, payload?: Record<string, unknown>) =>
    post<{ ok: boolean }>(`/api/admin/fraud/${id}/mutate`, { action, ...payload }),

  // Pricing Rules
  getPricingRules: () => get<PricingRule[]>('/api/admin/pricing-rules'),
  getPricingRule: (id: string) => get<PricingRule>(`/api/admin/pricing-rules/${id}`),
  createPricingRule: (payload: Record<string, unknown>) => post<PricingRule>('/api/admin/pricing-rules', payload),
  updatePricingRule: (id: string, payload: Record<string, unknown>) =>
    put<PricingRule>(`/api/admin/pricing-rules/${id}`, payload),
  deletePricingRule: (id: string) => del<{ ok: boolean }>(`/api/admin/pricing-rules/${id}`),

  // Dashboard
  getDashboard: () => get<Record<string, unknown>>('/api/admin/dashboard'),
  getReports: () => get<Record<string, unknown>>('/api/admin/reports'),

  // CMS
  getCmsContent: () => get<Record<string, unknown>[]>('/api/admin/cms'),
  getCmsItem: (id: string) => get<Record<string, unknown>>(`/api/admin/cms/${id}`),
  createCmsItem: (payload: Record<string, unknown>) => post<Record<string, unknown>>('/api/admin/cms', payload),
  updateCmsItem: (id: string, payload: Record<string, unknown>) =>
    put<Record<string, unknown>>(`/api/admin/cms/${id}`, payload),
  deleteCmsItem: (id: string) => del<{ ok: boolean }>(`/api/admin/cms/${id}`),

  // Settings
  getSettings: () => get<Record<string, unknown>>('/api/admin/settings'),
  updateSettings: (payload: Record<string, unknown>) => post<Record<string, unknown>>('/api/admin/settings', payload),
};
