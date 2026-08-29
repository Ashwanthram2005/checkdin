/**
 * Live derivations over AdminOS state. Every ranking, score, and rollup in the
 * UI is computed here from the current records, so an approval or a status
 * change immediately moves the analytics that depend on it.
 */
import { properties } from '../../data/properties';
import { cityOccupancy, revenueHeadline } from '../../data/adminos/intelligence';
import type { AdminOsState, ExtensionRecord, RiskRecord } from './store';

export interface ExtensionPerformanceRow {
  propertyId: string;
  propertyName: string;
  city: string;
  requests: number;
  approvals: number;
  rejections: number;
  approvalRate: number;
  avgResponseMinutes: number;
  revenue: number;
}

export function extensionPerformance(extensions: ExtensionRecord[]): ExtensionPerformanceRow[] {
  return properties.
  map((property) => {
    const rows = extensions.filter((request) => request.propertyId === property.id);
    const approvals = rows.filter((request) => request.status === 'Approved');
    const rejections = rows.filter((request) => request.status === 'Rejected');
    const responded = rows.filter((request) => request.responseMinutes !== null);
    return {
      propertyId: property.id,
      propertyName: property.name,
      city: property.city,
      requests: rows.length,
      approvals: approvals.length,
      rejections: rejections.length,
      approvalRate: rows.length ? Math.round(approvals.length / rows.length * 100) : 0,
      avgResponseMinutes: responded.length ?
      Math.round(responded.reduce((sum, row) => sum + (row.responseMinutes ?? 0), 0) / responded.length) :
      0,
      revenue: approvals.reduce((sum, row) => sum + row.revenue, 0)
    };
  }).
  filter((row) => row.requests > 0);
}

export function extensionTotals(extensions: ExtensionRecord[]) {
  const approved = extensions.filter((row) => row.status === 'Approved');
  const responded = extensions.filter((row) => row.responseMinutes !== null);
  return {
    total: extensions.length,
    approved: approved.length,
    rejected: extensions.filter((row) => row.status === 'Rejected').length,
    expired: extensions.filter((row) => row.status === 'Expired').length,
    pending: extensions.filter((row) => row.status === 'Pending').length,
    revenue: approved.reduce((sum, row) => sum + row.revenue, 0),
    approvalRate: extensions.length ? Math.round(approved.length / extensions.length * 100) : 0,
    avgResponseMinutes: responded.length ?
    Math.round(responded.reduce((sum, row) => sum + (row.responseMinutes ?? 0), 0) / responded.length) :
    0
  };
}

export interface HotelHealthRow {
  propertyId: string;
  propertyName: string;
  city: string;
  partnerName: string;
  occupancy: number;
  rating: number;
  acceptance: number;
  extensionApproval: number;
  responseMinutes: number;
  cancellation: number;
  revenue: number;
  score: number;
  breakdown: {label: string;weight: number;value: number;contribution: number;}[];
}

/** Weighted composite health score, recomputed from live extension behaviour. */
export function hotelHealth(state: AdminOsState): HotelHealthRow[] {
  const performance = extensionPerformance(state.extensions);

  return properties.
  map((property, index) => {
    const extension = performance.find((row) => row.propertyId === property.id);
    const visibility = state.visibility.find((row) => row.propertyId === property.id);
    const acceptance = Math.max(
      40,
      78 + index * 5 % 20 - (visibility && visibility.state !== 'Live' ? 18 : 0)
    );
    const cancellation = 4 + index * 3 % 12;
    const responseMinutes = extension?.avgResponseMinutes || 12 + index % 20;
    const extensionApproval = extension?.approvalRate ?? 60;
    const ratingScore = property.rating / 5 * 100;
    const responseScore = Math.max(0, 100 - responseMinutes * 2);
    const cancellationScore = Math.max(0, 100 - cancellation * 4);

    const breakdown = [
    { label: 'Occupancy rate', weight: 25, value: property.occupancy },
    { label: 'Review rating', weight: 20, value: Math.round(ratingScore) },
    { label: 'Booking acceptance', weight: 20, value: acceptance },
    { label: 'Extension approval', weight: 15, value: extensionApproval },
    { label: 'Response time', weight: 10, value: Math.round(responseScore) },
    { label: 'Cancellation rate', weight: 10, value: Math.round(cancellationScore) }].
    map((factor) => ({ ...factor, contribution: Math.round(factor.value * factor.weight / 100) }));

    return {
      propertyId: property.id,
      propertyName: property.name,
      city: property.city,
      partnerName: property.partnerName,
      occupancy: property.occupancy,
      rating: property.rating,
      acceptance,
      extensionApproval,
      responseMinutes,
      cancellation,
      revenue: property.revenue + (extension?.revenue ?? 0),
      score: breakdown.reduce((sum, factor) => sum + factor.contribution, 0),
      breakdown
    };
  }).
  sort((a, b) => b.score - a.score);
}

/** Signal-weighted risk score, recomputed from live records. */
export function riskScore(entity: RiskRecord, state: AdminOsState): number {
  if (entity.status === 'Cleared') return Math.min(entity.score, 30);
  if (entity.status === 'Blocked') return 100;

  const weights: {match: RegExp;weight: number;}[] = [
  { match: /fake booking/i, weight: 26 },
  { match: /excessive cancellation/i, weight: 22 },
  { match: /payment abuse/i, weight: 24 },
  { match: /refund/i, weight: 20 },
  { match: /extension/i, weight: 18 },
  { match: /chargeback/i, weight: 25 },
  { match: /duplicate/i, weight: 14 }];


  const signalScore = entity.signals.reduce((sum, signal) => {
    const hit = weights.find((weight) => weight.match.test(signal));
    return sum + (hit?.weight ?? 10);
  }, 0);

  const openDisputes = state.disputes.filter(
    (dispute) =>
    (dispute.propertyName === entity.name || dispute.raisedBy === entity.name) &&
    dispute.status !== 'Resolved' &&
    dispute.status !== 'Rejected'
  ).length;

  const exposureScore = Math.min(20, Math.round(entity.exposure / 5000));
  return Math.max(5, Math.min(100, signalScore + exposureScore + openDisputes * 6));
}

export function revenueTotals(state: AdminOsState) {
  const extensionRevenue = state.extensions.
  filter((row) => row.status === 'Approved').
  reduce((sum, row) => sum + row.revenue, 0);
  const settled = state.settlements.
  filter((row) => row.status === 'Processed').
  reduce((sum, row) => sum + row.net, 0);
  const commission = state.settlements.reduce((sum, row) => sum + row.commission, 0);
  const gst = state.settlements.reduce((sum, row) => sum + row.gst, 0);
  const gross = state.settlements.reduce((sum, row) => sum + row.gross, 0) + extensionRevenue;

  return {
    gross,
    net: gross - commission - gst,
    extension: extensionRevenue,
    commission,
    gst,
    settled,
    refundImpact: revenueHeadline.refundImpact,
    pendingPayout: state.settlements.
    filter((row) => row.status === 'Pending' || row.status === 'Upcoming').
    reduce((sum, row) => sum + row.net, 0)
  };
}

export function supplyTotals(state: AdminOsState) {
  return {
    total: state.visibility.length,
    live: state.visibility.filter((row) => row.state === 'Live').length,
    paused: state.visibility.filter((row) => row.state === 'Paused').length,
    offline: state.visibility.filter((row) => row.state === 'Offline').length,
    vacation: state.visibility.filter((row) => row.state === 'Vacation').length
  };
}

/** City occupancy blended with live supply, so pausing hotels moves the number. */
export function liveCityOccupancy(state: AdminOsState) {
  return cityOccupancy.map((city) => {
    const local = state.visibility.filter((row) => row.city === city.city);
    const liveCount = local.filter((row) => row.state === 'Live').length;
    const penalty = local.length ? Math.round((local.length - liveCount) / local.length * 8) : 0;
    return { ...city, occupancy: Math.max(10, city.occupancy - penalty), liveHotels: liveCount || city.hotels };
  });
}

export function unreadNotifications(state: AdminOsState) {
  return state.notifications.filter((row) => !row.read && !row.archived);
}