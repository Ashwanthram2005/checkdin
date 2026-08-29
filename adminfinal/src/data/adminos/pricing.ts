import { properties } from '../properties';

export type PricingRuleKind = 'Surge' | 'Seasonal' | 'Discount';
export type PricingRuleStatus = 'Active' | 'Flagged' | 'Paused' | 'Blocked';

export interface PartnerPricingRule {
  id: string;
  name: string;
  propertyId: string;
  propertyName: string;
  city: string;
  kind: PricingRuleKind;
  delta: number;
  baseRate: number;
  effectiveRate: number;
  status: PricingRuleStatus;
  override: {type: string;value: number;reason: string;by: string;at: string;} | null;
}

const kinds: PricingRuleKind[] = ['Surge', 'Seasonal', 'Discount'];

export const partnerPricingRules: PartnerPricingRule[] = properties.flatMap((property, index) =>
[0, 1].map((offset) => {
  const kind = kinds[(index + offset) % kinds.length];
  const baseRate = 2400 + index * 220;
  const delta = kind === 'Surge' ? 0.34 + offset * 0.14 : kind === 'Seasonal' ? 0.18 : -0.22;
  return {
    id: `PRC-${property.id}-${offset}`,
    name:
    kind === 'Surge' ?
    'Weekend surge' :
    kind === 'Seasonal' ?
    'Festive season uplift' :
    'Weekday occupancy discount',
    propertyId: property.id,
    propertyName: property.name,
    city: property.city,
    kind,
    delta,
    baseRate,
    effectiveRate: Math.round(baseRate * (1 + delta)),
    status: (delta > 0.45 ? 'Flagged' : offset === 1 && index % 4 === 0 ? 'Paused' : 'Active') as PricingRuleStatus,
    override: null
  };
})
);

export const defaultGuardrails = {
  floorEnabled: true,
  floor: 900,
  ceilingEnabled: true,
  ceiling: 1.45
};

export type Guardrails = typeof defaultGuardrails;