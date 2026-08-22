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
  Ticket } from
'../types';
import { bookings } from '../data/bookings';
import { properties } from '../data/properties';
import { rooms } from '../data/rooms';
import { partners } from '../data/partners';
import { customers } from '../data/customers';
import { payouts, refunds } from '../data/finance';
import { campaigns, coupons, reviews, tickets } from '../data/engagement';
import { adminUsers, auditLogs, fraudAlerts, pricingRules } from '../data/governance';

const LATENCY = 320;

function respond<T>(payload: T): Promise<T> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(payload), LATENCY);
  });
}

export const api = {
  getBookings: (): Promise<Booking[]> => respond(bookings),
  getBooking: (id: string): Promise<Booking | undefined> =>
  respond(bookings.find((booking) => booking.id === id || booking.code === id)),
  getProperties: (): Promise<Property[]> => respond(properties),
  getProperty: (id: string): Promise<Property | undefined> =>
  respond(properties.find((property) => property.id === id)),
  getRooms: (): Promise<Room[]> => respond(rooms),
  getPartners: (): Promise<Partner[]> => respond(partners),
  getPartner: (id: string): Promise<Partner | undefined> =>
  respond(partners.find((partner) => partner.id === id)),
  getCustomers: (): Promise<Customer[]> => respond(customers),
  getCustomer: (id: string): Promise<Customer | undefined> =>
  respond(customers.find((customer) => customer.id === id)),
  getPayouts: (): Promise<Payout[]> => respond(payouts),
  getRefunds: (): Promise<Refund[]> => respond(refunds),
  getReviews: (): Promise<Review[]> => respond(reviews),
  getTickets: (): Promise<Ticket[]> => respond(tickets),
  getCoupons: (): Promise<Coupon[]> => respond(coupons),
  getCampaigns: (): Promise<Campaign[]> => respond(campaigns),
  getAuditLogs: (): Promise<AuditLog[]> => respond(auditLogs),
  getAdminUsers: (): Promise<AdminUser[]> => respond(adminUsers),
  getFraudAlerts: (): Promise<FraudAlert[]> => respond(fraudAlerts),
  getPricingRules: (): Promise<PricingRule[]> => respond(pricingRules),
  mutate: (action: string, payload?: Record<string, unknown>): Promise<{ok: true;action: string;}> => {
    if (payload) {
      // Mock services log the intended change; the real API would persist it.
      console.info(`[checkdin-api] ${action}`, payload);
    }
    return respond({ ok: true as const, action });
  }
};