/** Module 6 — dynamic pricing rules layered over the base slot prices. */
export type PricingRuleGroup = 'Time of day' | 'Weekend' | 'Seasonal' | 'Demand';

export type PricingRule = {
  id: string;
  group: PricingRuleGroup;
  label: string;
  window: string;
  adjustment: number;
  active: boolean;
  impact: number;
};

export const pricingRules: PricingRule[] = [
{
  id: 'morning',
  group: 'Time of day',
  label: 'Morning',
  window: '6 AM – 12 PM',
  adjustment: -10,
  active: true,
  impact: 4200
},
{
  id: 'afternoon',
  group: 'Time of day',
  label: 'Afternoon',
  window: '12 PM – 5 PM',
  adjustment: 0,
  active: true,
  impact: 0
},
{
  id: 'evening',
  group: 'Time of day',
  label: 'Evening',
  window: '5 PM – 10 PM',
  adjustment: 12,
  active: true,
  impact: 18600
},
{
  id: 'night',
  group: 'Time of day',
  label: 'Night',
  window: '10 PM – 6 AM',
  adjustment: 8,
  active: true,
  impact: 9400
},
{
  id: 'saturday',
  group: 'Weekend',
  label: 'Saturday premium',
  window: 'All Saturday slots',
  adjustment: 15,
  active: true,
  impact: 22800
},
{
  id: 'sunday',
  group: 'Weekend',
  label: 'Sunday premium',
  window: 'All Sunday slots',
  adjustment: 10,
  active: true,
  impact: 14100
},
{
  id: 'holiday',
  group: 'Seasonal',
  label: 'Public holidays',
  window: 'Gazetted holidays',
  adjustment: 18,
  active: true,
  impact: 16200
},
{
  id: 'festival',
  group: 'Seasonal',
  label: 'Festival season',
  window: 'Pongal, Diwali, New Year',
  adjustment: 25,
  active: false,
  impact: 31500
},
{
  id: 'events',
  group: 'Seasonal',
  label: 'Local events',
  window: 'Trade fairs and concerts nearby',
  adjustment: 20,
  active: true,
  impact: 12700
},
{
  id: 'surge',
  group: 'Demand',
  label: 'Surge pricing',
  window: 'When occupancy crosses 85%',
  adjustment: 20,
  active: true,
  impact: 26400
},
{
  id: 'discount',
  group: 'Demand',
  label: 'Low demand discount',
  window: 'When occupancy falls below 45%',
  adjustment: -12,
  active: true,
  impact: 8900
}];


/** Module 15 — promotions and offers. */
export type PromotionStatus = 'Live' | 'Scheduled' | 'Ended';

export type Promotion = {
  id: string;
  name: string;
  type: 'Happy Hour' | 'Last Minute' | 'Low Occupancy' | 'Festival';
  window: string;
  discount: number;
  slots: string;
  status: PromotionStatus;
  revenue: number;
  conversion: number;
  occupancyLift: number;
};

export const promotions: Promotion[] = [
{
  id: 'p1',
  name: 'Weekday Happy Hour',
  type: 'Happy Hour',
  window: 'Mon–Thu, 11 AM – 3 PM',
  discount: 15,
  slots: '3 Hours',
  status: 'Live',
  revenue: 42600,
  conversion: 18.4,
  occupancyLift: 11
},
{
  id: 'p2',
  name: 'Same-day Last Minute',
  type: 'Last Minute',
  window: 'Within 3 hours of check-in',
  discount: 12,
  slots: '3 & 6 Hours',
  status: 'Live',
  revenue: 28900,
  conversion: 24.1,
  occupancyLift: 8
},
{
  id: 'p3',
  name: 'Low Occupancy Rescue',
  type: 'Low Occupancy',
  window: 'Auto — below 45% occupancy',
  discount: 20,
  slots: 'All slots',
  status: 'Scheduled',
  revenue: 0,
  conversion: 0,
  occupancyLift: 0
},
{
  id: 'p4',
  name: 'Pongal Festival Offer',
  type: 'Festival',
  window: '12–16 Jan 2027',
  discount: 10,
  slots: '6 & 12 Hours',
  status: 'Ended',
  revenue: 61200,
  conversion: 21.7,
  occupancyLift: 16
}];


/** Module 16 — AI recommendations, generated from the property's own signals. */
export type Recommendation = {
  id: string;
  category: 'Pricing' | 'Revenue' | 'Occupancy' | 'Customers' | 'Promotion' | 'Performance';
  headline: string;
  observation: string;
  action: string;
  upside: number;
  confidence: number;
};

export const recommendations: Recommendation[] = [
{
  id: 'r1',
  category: 'Pricing',
  headline: 'Cut tomorrow’s 3-hour price by 10%',
  observation: 'Occupancy tomorrow is forecast at 41%, well below your 68% weekly average.',
  action: 'Apply a −10% afternoon rule for 3-hour slots tomorrow only.',
  upside: 4200,
  confidence: 88
},
{
  id: 'r2',
  category: 'Revenue',
  headline: 'Answer extensions inside 2 minutes',
  observation: '14 extension requests expired last month while the average response took 4m 20s.',
  action: 'Turn on extension alerts for the reception role.',
  upside: 7420,
  confidence: 94
},
{
  id: 'r3',
  category: 'Occupancy',
  headline: 'Add 4 more slots on Friday evening',
  observation: 'Friday 6–10 PM sold out in 5 of the last 6 weeks.',
  action: 'Raise Friday allocation from 18 to 22 slots.',
  upside: 9800,
  confidence: 81
},
{
  id: 'r4',
  category: 'Promotion',
  headline: 'Extend Happy Hour to Sunday mornings',
  observation: 'Sunday before noon runs at 34% occupancy with no active offer.',
  action: 'Add Sunday 9 AM – 1 PM to the Weekday Happy Hour campaign.',
  upside: 5600,
  confidence: 74
},
{
  id: 'r5',
  category: 'Customers',
  headline: 'Target business travellers with 6-hour bundles',
  observation: 'They spend ₹2,180 on average and repeat 52% of the time — your strongest segment.',
  action: 'Send a 6-hour weekday offer to the 214 business guests who stayed this quarter.',
  upside: 11200,
  confidence: 69
},
{
  id: 'r6',
  category: 'Performance',
  headline: 'Reply to 6 unanswered reviews',
  observation: 'Response rate is 78%; properties above 90% rank higher in search.',
  action: 'Clear the review reply queue this week.',
  upside: 0,
  confidence: 91
}];