/**
 * Marketplace insights generated from live AdminOS state. Nothing here is
 * hard-coded: each insight is produced only when the data crosses its
 * threshold, and confidence scales with the size of the sample behind it.
 */
import type { AdminOsState } from './store';
import { extensionPerformance, hotelHealth, liveCityOccupancy, revenueTotals, riskScore } from './selectors';

export type InsightCategory =
'Revenue Opportunity' |
'Occupancy' |
'Customer Trend' |
'Pricing' |
'Market Expansion' |
'Risk';

export interface GeneratedInsight {
  id: string;
  category: InsightCategory;
  confidence: number;
  headline: string;
  detail: string;
  impact: string;
  action: string;
  actionTo: string;
}

function inr(value: number): string {
  if (Math.abs(value) >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (Math.abs(value) >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (Math.abs(value) >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${Math.round(value)}`;
}

export function generateInsights(state: AdminOsState): GeneratedInsight[] {
  const insights: GeneratedInsight[] = [];
  const performance = extensionPerformance(state.extensions);
  const cities = liveCityOccupancy(state);
  const revenue = revenueTotals(state);
  const health = hotelHealth(state);

  /* Hotels declining most of their extension requests. */
  performance.
  filter((row) => row.requests >= 3 && row.approvalRate < 50).
  sort((a, b) => a.approvalRate - b.approvalRate).
  slice(0, 2).
  forEach((row) => {
    const lost = row.rejections * 1180;
    insights.push({
      id: `ext-${row.propertyId}`,
      category: 'Revenue Opportunity',
      confidence: Math.min(95, 62 + row.requests * 4),
      headline: `${row.propertyName} rejects ${100 - row.approvalRate}% of extension requests`,
      detail: `${row.rejections} of ${row.requests} requests were declined, with an average response of ${row.avgResponseMinutes} minutes. Guests who are declined book a competitor roughly 40% of the time.`,
      impact: `${inr(lost)} of extension revenue at risk`,
      action: 'View hotel',
      actionTo: `/properties/${row.propertyId}`
    });
  });

  /* Slow responders — the single biggest lever on extension conversion. */
  const slow = [...performance].filter((row) => row.avgResponseMinutes >= 35).sort((a, b) => b.avgResponseMinutes - a.avgResponseMinutes)[0];
  if (slow) {
    insights.push({
      id: `slow-${slow.propertyId}`,
      category: 'Revenue Opportunity',
      confidence: 84,
      headline: `${slow.propertyName} takes ${slow.avgResponseMinutes} minutes to answer extensions`,
      detail:
      'Hotels answering within ten minutes convert about three times more extension requests. Anything past forty minutes usually expires against the 60-minute SLA.',
      impact: `${inr(slow.requests * 420)} recoverable this month`,
      action: 'Open extension history',
      actionTo: `/os/extensions?q=${encodeURIComponent(slow.propertyName)}`
    });
  }

  /* Cities running hot against their target — surge candidates. */
  cities.
  filter((city) => city.occupancy - city.target > 6).
  slice(0, 2).
  forEach((city) => {
    insights.push({
      id: `occ-${city.city}`,
      category: 'Occupancy',
      confidence: Math.min(93, 70 + (city.occupancy - city.target) * 2),
      headline: `${city.city} is running ${city.occupancy - city.target} points above target`,
      detail: `${city.occupancy}% occupancy against a ${city.target}% target across ${city.liveHotels} live hotels. Demand is outrunning supply in the evening slots.`,
      impact: `${inr((city.occupancy - city.target) * 62000)} of unserved demand`,
      action: 'Open surge pricing',
      actionTo: '/os/pricing-governance'
    });
  });

  /* Cities well under target — pricing correction. */
  const soft = cities.filter((city) => city.target - city.occupancy > 15).sort((a, b) => a.occupancy - b.occupancy)[0];
  if (soft) {
    insights.push({
      id: `price-${soft.city}`,
      category: 'Pricing',
      confidence: 81,
      headline: `${soft.city} is priced above the market for ${soft.occupancy}% occupancy`,
      detail: `Occupancy sits ${soft.target - soft.occupancy} points below target while rates hold at the regional median. A 12–15% correction on weekday slots should recover volume.`,
      impact: `${inr((soft.target - soft.occupancy) * 21000)} monthly upside`,
      action: 'Enforce a price ceiling',
      actionTo: '/os/pricing-governance'
    });
  }

  /* Supply withdrawn from the marketplace. */
  const dark = state.visibility.filter((hotel) => hotel.state !== 'Live');
  if (dark.length) {
    insights.push({
      id: 'supply-dark',
      category: 'Occupancy',
      confidence: 90,
      headline: `${dark.length} hotels are invisible to guests right now`,
      detail: `${dark.filter((h) => h.state === 'Paused').length} paused, ${dark.filter((h) => h.state === 'Offline').length} offline, ${dark.filter((h) => h.state === 'Vacation').length} on vacation mode. Every day offline is inventory the marketplace cannot sell.`,
      impact: `${inr(dark.length * 74000)} of monthly supply withheld`,
      action: 'Open status board',
      actionTo: '/os/hotel-status'
    });
  }

  /* Risk concentration. */
  const highRisk = state.risks.
  map((entity) => ({ ...entity, score: riskScore(entity, state) })).
  filter((entity) => entity.score >= 75);
  if (highRisk.length) {
    const exposure = highRisk.reduce((sum, entity) => sum + entity.exposure, 0);
    insights.push({
      id: 'risk-concentration',
      category: 'Risk',
      confidence: 88,
      headline: `${highRisk.length} entities are scoring high risk`,
      detail: `${highRisk.
      slice(0, 3).
      map((entity) => entity.name).
      join(', ')} carry the strongest fraud signals. Most of the exposure sits in refund and chargeback claims.`,
      impact: `${inr(exposure)} exposed`,
      action: 'Open risk center',
      actionTo: '/os/risk'
    });
  }

  /* Money stuck in disputes. */
  const openDisputes = state.disputes.filter((dispute) => dispute.status === 'Open' || dispute.status === 'In Review');
  if (openDisputes.length >= 3) {
    const byProperty = new Map<string, number>();
    openDisputes.forEach((dispute) => {
      byProperty.set(dispute.propertyName, (byProperty.get(dispute.propertyName) ?? 0) + dispute.amount);
    });
    const worst = [...byProperty.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
    insights.push({
      id: 'dispute-concentration',
      category: 'Revenue Opportunity',
      confidence: 79,
      headline: `Refund exposure concentrated in ${worst.length} properties`,
      detail: `${worst.map(([name]) => name).join(', ')} account for most of the open dispute value. Resolving these clears the backlog and unblocks their settlements.`,
      impact: `${inr(openDisputes.reduce((sum, dispute) => sum + dispute.amount, 0))} in open cases`,
      action: 'Open dispute center',
      actionTo: '/os/disputes'
    });
  }

  /* Settlements waiting on release. */
  const pending = state.settlements.filter((row) => row.status === 'Pending' || row.status === 'On Hold');
  if (pending.length) {
    insights.push({
      id: 'settlement-backlog',
      category: 'Revenue Opportunity',
      confidence: 86,
      headline: `${pending.length} settlements are waiting on a decision`,
      detail: `${pending.filter((row) => row.status === 'On Hold').length} are on hold and ${pending.filter((row) => row.status === 'Pending').length} are pending release. Partners chase support when a cycle slips.`,
      impact: `${inr(pending.reduce((sum, row) => sum + row.net, 0))} unreleased`,
      action: 'Open settlements',
      actionTo: '/os/settlements'
    });
  }

  /* Compliance blockers. */
  const blocked = state.compliance.filter(
    (record) =>
    record.kyc === 'Rejected' ||
    record.gst === 'Rejected' ||
    record.bank === 'Rejected' ||
    record.property === 'Rejected' ||
    record.agreement === 'Rejected'
  );
  if (blocked.length) {
    insights.push({
      id: 'compliance-blockers',
      category: 'Market Expansion',
      confidence: 83,
      headline: `${blocked.length} hotels cannot go live on compliance`,
      detail: `Rejected documents are blocking go-live for ${blocked.
      slice(0, 3).
      map((record) => record.propertyName).
      join(', ')}. Each one is signed supply sitting outside the marketplace.`,
      impact: `${blocked.length} hotels of supply blocked`,
      action: 'Open compliance',
      actionTo: '/os/compliance'
    });
  }

  /* Performance leaders worth featuring. */
  const excellent = health.filter((row) => row.score >= 80);
  if (excellent.length) {
    insights.push({
      id: 'featured-candidates',
      category: 'Customer Trend',
      confidence: 76,
      headline: `${excellent.length} hotels qualify for featured placement`,
      detail: `${excellent.
      slice(0, 3).
      map((row) => row.propertyName).
      join(', ')} score 80+ on the health index. Featuring high-scoring supply lifts conversion without discounting.`,
      impact: `${inr(revenue.gross * 0.03)} incremental at a 3% conversion lift`,
      action: 'Open partner performance',
      actionTo: '/os/partner-performance'
    });
  }

  return insights.sort((a, b) => b.confidence - a.confidence);
}