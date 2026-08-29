import { properties } from '../properties';

export type ExtensionStatus = 'Approved' | 'Rejected' | 'Expired' | 'Pending';
export type ExtensionType = '1 hour' | '3 hours' | '6 hours' | 'Full night';

export interface ExtensionRequest {
  id: string;
  bookingId: string;
  guestName: string;
  propertyId: string;
  propertyName: string;
  city: string;
  state: string;
  type: ExtensionType;
  status: ExtensionStatus;
  requestedAt: string;
  decidedAt: string | null;
  responseMinutes: number | null;
  revenue: number;
  requestedDate: string;
}

const guests = [
'Aditya Sharma',
'Neha Kulkarni',
'Rahul Verma',
'Ishita Bose',
'Farhan Sheikh',
'Anjali Pillai',
'Rohit Desai',
'Sneha Nair',
'Manish Tiwari',
'Kavya Rao'];


const types: ExtensionType[] = ['1 hour', '3 hours', '6 hours', 'Full night'];
const rates: Record<ExtensionType, number> = {
  '1 hour': 420,
  '3 hours': 1180,
  '6 hours': 1940,
  'Full night': 2860
};

function statusFor(index: number): ExtensionStatus {
  if (index % 11 === 0) return 'Pending';
  if (index % 7 === 0) return 'Expired';
  if (index % 4 === 0) return 'Rejected';
  return 'Approved';
}

export const extensionRequests: ExtensionRequest[] = Array.from({ length: 64 }, (_, index) => {
  const property = properties[index % properties.length];
  const type = types[index % types.length];
  const status = statusFor(index);
  const day = 19 - Math.floor(index / 6);
  const hour = 8 + index % 12;
  const responseMinutes = status === 'Pending' ? null : status === 'Expired' ? 60 : 3 + index * 7 % 47;
  return {
    id: `EXT-${5200 + index}`,
    bookingId: `CHK-${74000 + index * 3}`,
    guestName: guests[index % guests.length],
    propertyId: property.id,
    propertyName: property.name,
    city: property.city,
    state: property.state,
    type,
    status,
    requestedAt: `${day} Aug, ${String(hour).padStart(2, '0')}:${String(index * 13 % 60).padStart(2, '0')}`,
    decidedAt:
    status === 'Pending' ?
    null :
    `${day} Aug, ${String(hour).padStart(2, '0')}:${String(index * 13 % 60 + (responseMinutes ?? 0) > 59 ? 59 : index * 13 % 60 + (responseMinutes ?? 0)).padStart(2, '0')}`,
    responseMinutes,
    revenue: status === 'Approved' ? rates[type] : 0,
    requestedDate: `2026-08-${String(day).padStart(2, '0')}`
  };
});

export interface HotelExtensionPerformance {
  propertyId: string;
  propertyName: string;
  city: string;
  requests: number;
  approvals: number;
  approvalRate: number;
  avgResponseMinutes: number;
  revenue: number;
}

export const extensionPerformance: HotelExtensionPerformance[] = properties.map((property) => {
  const rows = extensionRequests.filter((request) => request.propertyId === property.id);
  const approvals = rows.filter((request) => request.status === 'Approved');
  const responded = rows.filter((request) => request.responseMinutes !== null);
  return {
    propertyId: property.id,
    propertyName: property.name,
    city: property.city,
    requests: rows.length,
    approvals: approvals.length,
    approvalRate: rows.length ? Math.round(approvals.length / rows.length * 100) : 0,
    avgResponseMinutes: responded.length ?
    Math.round(responded.reduce((sum, request) => sum + (request.responseMinutes ?? 0), 0) / responded.length) :
    0,
    revenue: approvals.reduce((sum, request) => sum + request.revenue, 0)
  };
});

export const extensionTrend = Array.from({ length: 14 }, (_, index) => ({
  label: `${6 + index} Aug`,
  revenue: 42000 + index * 3100 + index % 3 * 7400,
  target: 68000
}));