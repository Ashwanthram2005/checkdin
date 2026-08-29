import { properties } from '../properties';

/* ---------------------------------------------------------------- revenue */

export const revenueByPeriod = {
  Daily: Array.from({ length: 14 }, (_, index) => ({
    label: `${6 + index} Aug`,
    gross: 1180000 + index * 42000 + index % 3 * 91000,
    net: 1010000 + index * 36000 + index % 3 * 72000,
    commission: 142000 + index * 5200
  })),
  Weekly: Array.from({ length: 8 }, (_, index) => ({
    label: `W${28 + index}`,
    gross: 7900000 + index * 320000,
    net: 6800000 + index * 270000,
    commission: 950000 + index * 41000
  })),
  Monthly: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'].map((label, index) => ({
    label,
    gross: 30200000 + index * 1900000,
    net: 26100000 + index * 1600000,
    commission: 3620000 + index * 230000
  })),
  Yearly: ['2023', '2024', '2025', '2026'].map((label, index) => ({
    label,
    gross: 148000000 + index * 92000000,
    net: 128000000 + index * 79000000,
    commission: 17800000 + index * 11000000
  }))
};

export const revenueHeadline = {
  gross: 41240000,
  net: 35180000,
  extension: 3860000,
  commission: 4940000,
  refundImpact: -1120000
};

export const revenueByCity = [
{ label: 'Mumbai', gross: 10420000, net: 8910000, commission: 1250000 },
{ label: 'Bengaluru', gross: 8180000, net: 7020000, commission: 982000 },
{ label: 'Chennai', gross: 7240000, net: 6180000, commission: 869000 },
{ label: 'New Delhi', gross: 5960000, net: 5080000, commission: 715000 },
{ label: 'Hyderabad', gross: 4310000, net: 3670000, commission: 517000 },
{ label: 'Goa', gross: 3420000, net: 2910000, commission: 410000 },
{ label: 'Jaipur', gross: 1710000, net: 1410000, commission: 197000 }];


export const revenueByDuration = [
{ label: '1–3 hours', value: 34, count: 6240 },
{ label: '6 hours', value: 26, count: 4770 },
{ label: '12 hours', value: 17, count: 3120 },
{ label: 'Full night', value: 23, count: 4220 }];


export const revenueBySegment = [
{ label: 'Couples', value: 31 },
{ label: 'Business Travelers', value: 24 },
{ label: 'Layover Guests', value: 16 },
{ label: 'Remote Workers', value: 13 },
{ label: 'Students', value: 9 },
{ label: 'Families', value: 7 }];


export const revenueByHotel = properties.map((property, index) => ({
  propertyId: property.id,
  propertyName: property.name,
  city: property.city,
  gross: property.revenue,
  extension: Math.round(property.revenue * (0.06 + index % 4 * 0.01)),
  commission: Math.round(property.revenue * 0.12),
  net: Math.round(property.revenue * 0.855)
}));

/* -------------------------------------------------------------- occupancy */

export const cityOccupancy = [
{ city: 'Mumbai', occupancy: 90, target: 82, hotels: 14, demand: 'Peak' as const },
{ city: 'Goa', occupancy: 95, target: 84, hotels: 8, demand: 'Peak' as const },
{ city: 'Bengaluru', occupancy: 79, target: 80, hotels: 19, demand: 'Steady' as const },
{ city: 'Chennai', occupancy: 74, target: 80, hotels: 16, demand: 'Steady' as const },
{ city: 'New Delhi', occupancy: 63, target: 78, hotels: 12, demand: 'Soft' as const },
{ city: 'Hyderabad', occupancy: 58, target: 76, hotels: 11, demand: 'Soft' as const },
{ city: 'Jaipur', occupancy: 44, target: 72, hotels: 6, demand: 'Low' as const }];


export const hourSlots = ['00–04', '04–08', '08–12', '12–16', '16–20', '20–24'];

/** Occupancy percentage per city per 4-hour slot. */
export const occupancyHeatmap = cityOccupancy.map((city, rowIndex) => ({
  city: city.city,
  slots: hourSlots.map((slot, index) => ({
    slot,
    value: Math.max(
      12,
      Math.min(99, Math.round(city.occupancy - 26 + index * 9 + (rowIndex * 7 + index * 5) % 17))
    )
  }))
}));

export const hotelOccupancyRanking = properties.
map((property) => ({
  propertyId: property.id,
  propertyName: property.name,
  city: property.city,
  occupancy: property.occupancy,
  rooms: property.rooms
})).
sort((a, b) => b.occupancy - a.occupancy);

export const peakHours = [
{ label: '20–24', bookings: 3120 },
{ label: '16–20', bookings: 2480 },
{ label: '12–16', bookings: 1910 },
{ label: '08–12', bookings: 1240 },
{ label: '04–08', bookings: 610 },
{ label: '00–04', bookings: 420 }];


/* --------------------------------------------------------------- customer */

export interface CustomerSegment {
  name: string;
  share: number;
  customers: number;
  repeatRate: number;
  ltv: number;
  avgSpend: number;
  retention: number;
}

export const customerSegments: CustomerSegment[] = [
{ name: 'Couples', share: 31, customers: 42180, repeatRate: 46, ltv: 14200, avgSpend: 2180, retention: 61 },
{ name: 'Business Travelers', share: 24, customers: 32640, repeatRate: 68, ltv: 28400, avgSpend: 3420, retention: 74 },
{ name: 'Layover Guests', share: 16, customers: 21760, repeatRate: 22, ltv: 5100, avgSpend: 1240, retention: 29 },
{ name: 'Remote Workers', share: 13, customers: 17680, repeatRate: 57, ltv: 19800, avgSpend: 2740, retention: 66 },
{ name: 'Students', share: 9, customers: 12240, repeatRate: 34, ltv: 6800, avgSpend: 980, retention: 41 },
{ name: 'Families', share: 7, customers: 9520, repeatRate: 28, ltv: 11600, avgSpend: 4120, retention: 38 }];


export const customerHeadline = {
  total: 136020,
  active: 48310,
  repeat: 21840,
  newThisMonth: 8410,
  repeatRate: 45.2,
  ltv: 16280,
  retention: 58.4,
  avgSpend: 2410
};

/* ------------------------------------------------------------ ai insights */

export interface AiInsight {
  id: string;
  category: 'Revenue Opportunity' | 'Occupancy' | 'Customer Trend' | 'Pricing' | 'Market Expansion';
  confidence: number;
  headline: string;
  detail: string;
  impact: string;
  action: string;
  actionTo: string;
}

export const aiInsights: AiInsight[] = [
{
  id: 'AI-01',
  category: 'Occupancy',
  confidence: 94,
  headline: 'Chennai demand increased 18% this week',
  detail:
  'Searches for 6-hour slots in Chennai rose 18% week on week while inventory stayed flat. 4 hotels hit 95%+ occupancy on Friday and Saturday nights.',
  impact: '≈ ₹6.2L of unserved demand',
  action: 'Open surge pricing for Chennai',
  actionTo: '/os/pricing-governance'
},
{
  id: 'AI-02',
  category: 'Revenue Opportunity',
  confidence: 88,
  headline: 'Hotel Empire Stay rejects 65% of extension requests',
  detail:
  'The property declines most 3-hour extensions between 4 PM and 8 PM, citing housekeeping turnaround. Guests who are declined book a competitor 41% of the time.',
  impact: '₹3.4L monthly extension revenue at risk',
  action: 'Review extension performance',
  actionTo: '/os/extensions'
},
{
  id: 'AI-03',
  category: 'Market Expansion',
  confidence: 81,
  headline: 'Coimbatore occupancy is growing rapidly',
  detail:
  'Guest searches originating in Coimbatore grew 34% over eight weeks with only 2 listed properties. The nearest supply is 190 km away in Chennai.',
  impact: '6–9 hotel supply gap',
  action: 'Open onboarding pipeline',
  actionTo: '/os/compliance'
},
{
  id: 'AI-04',
  category: 'Pricing',
  confidence: 86,
  headline: 'Jaipur is priced 22% above market for its occupancy',
  detail:
  'At 44% occupancy, Jaipur listings sit well above the regional median rate. A 12–15% correction on weekday slots should recover volume.',
  impact: '+₹1.8L monthly if occupancy reaches 60%',
  action: 'Enforce a price ceiling',
  actionTo: '/os/pricing-governance'
},
{
  id: 'AI-05',
  category: 'Customer Trend',
  confidence: 79,
  headline: 'Business travelers now drive 68% repeat bookings',
  detail:
  'Repeat rate for business travelers climbed 9 points this quarter, concentrated in Bengaluru and Mumbai weekday check-ins before 11 AM.',
  impact: 'LTV up ₹4,100 per customer',
  action: 'See customer intelligence',
  actionTo: '/os/customer-intelligence'
},
{
  id: 'AI-06',
  category: 'Revenue Opportunity',
  confidence: 73,
  headline: 'Refund impact concentrated in 3 properties',
  detail:
  'Two Goa villas and one Delhi hotel account for 58% of refund value this month, mostly overbooking on weekends.',
  impact: '₹6.5L refund exposure',
  action: 'Open dispute center',
  actionTo: '/os/disputes'
}];