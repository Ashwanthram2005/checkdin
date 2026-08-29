/** Module 5 — occupancy, all slot-level. Checkdin never tracks individual rooms. */
export const occupancyNow = {
  current: 76,
  daily: 71,
  weekly: 68,
  monthly: 64,
  slotsSold: 137,
  slotsAllocated: 180
};

export const occupancyDaily = [
{ label: 'Mon', value: 62 },
{ label: 'Tue', value: 58 },
{ label: 'Wed', value: 66 },
{ label: 'Thu', value: 71 },
{ label: 'Fri', value: 84 },
{ label: 'Sat', value: 91 },
{ label: 'Sun', value: 79 }];


export const occupancyMonthly = [
{ label: 'Mar', value: 58 },
{ label: 'Apr', value: 61 },
{ label: 'May', value: 66 },
{ label: 'Jun', value: 63 },
{ label: 'Jul', value: 69 },
{ label: 'Aug', value: 76 }];


export const hourlyDemand = [
{ hour: '6 AM', value: 12 },
{ hour: '9 AM', value: 28 },
{ hour: '12 PM', value: 54 },
{ hour: '3 PM', value: 82 },
{ hour: '6 PM', value: 91 },
{ hour: '9 PM', value: 74 },
{ hour: '12 AM', value: 46 },
{ hour: '3 AM', value: 18 }];


export const occupancyForecast = [
{ label: 'Today', value: 76, projected: 78 },
{ label: 'Tue', value: 0, projected: 64 },
{ label: 'Wed', value: 0, projected: 69 },
{ label: 'Thu', value: 0, projected: 73 },
{ label: 'Fri', value: 0, projected: 88 },
{ label: 'Sat', value: 0, projected: 93 },
{ label: 'Sun', value: 0, projected: 81 }];


export const utilizationHeatmap = [
{ day: 'Mon', values: [18, 34, 52, 71, 63, 38] },
{ day: 'Tue', values: [15, 30, 48, 66, 58, 33] },
{ day: 'Wed', values: [20, 38, 57, 74, 66, 41] },
{ day: 'Thu', values: [23, 42, 62, 80, 71, 46] },
{ day: 'Fri', values: [31, 55, 78, 94, 86, 61] },
{ day: 'Sat', values: [36, 62, 84, 97, 91, 68] },
{ day: 'Sun', values: [28, 49, 70, 86, 77, 52] }];


export const heatmapBands = ['6 AM', '10 AM', '2 PM', '6 PM', '9 PM', '1 AM'];

/** Module 7 — revenue forecasting. */
export const forecastSummary = {
  today: { expected: 21400, growth: 9, confidence: 92 },
  week: { expected: 138600, growth: 14, confidence: 86 },
  month: { expected: 561200, growth: 16, confidence: 78 }
};

export const forecastSeries = [
{ label: 'Mon', actual: 14200, forecast: 14000 },
{ label: 'Tue', actual: 12900, forecast: 13400 },
{ label: 'Wed', actual: 16100, forecast: 15600 },
{ label: 'Thu', actual: 17800, forecast: 17200 },
{ label: 'Fri', actual: 21600, forecast: 20800 },
{ label: 'Sat', actual: 0, forecast: 24900 },
{ label: 'Sun', actual: 0, forecast: 21400 }];


/** Module 8 — customer intelligence. */
export type CustomerSegment = {
  id: string;
  label: string;
  share: number;
  averageSpend: number;
  repeatRate: number;
  frequency: string;
  preferredDuration: string;
  revenue: number;
  color: string;
};

export const customerSegments: CustomerSegment[] = [
{
  id: 'couples',
  label: 'Couples',
  share: 31,
  averageSpend: 1420,
  repeatRate: 38,
  frequency: '1.8 / month',
  preferredDuration: '3 Hours',
  revenue: 151000,
  color: '#D9FF3F'
},
{
  id: 'business',
  label: 'Business Travellers',
  share: 24,
  averageSpend: 2180,
  repeatRate: 52,
  frequency: '2.4 / month',
  preferredDuration: '6 Hours',
  revenue: 128400,
  color: '#1F6B33'
},
{
  id: 'remote',
  label: 'Remote Workers',
  share: 16,
  averageSpend: 1310,
  repeatRate: 44,
  frequency: '3.1 / month',
  preferredDuration: '6 Hours',
  revenue: 74600,
  color: '#98A70F'
},
{
  id: 'layover',
  label: 'Layover Guests',
  share: 12,
  averageSpend: 1890,
  repeatRate: 11,
  frequency: '0.4 / month',
  preferredDuration: '12 Hours',
  revenue: 58900,
  color: '#8FB800'
},
{
  id: 'families',
  label: 'Families',
  share: 10,
  averageSpend: 2460,
  repeatRate: 19,
  frequency: '0.7 / month',
  preferredDuration: '12 Hours',
  revenue: 49200,
  color: '#C9C9C9'
},
{
  id: 'students',
  label: 'Students',
  share: 7,
  averageSpend: 940,
  repeatRate: 26,
  frequency: '1.2 / month',
  preferredDuration: '3 Hours',
  revenue: 23800,
  color: '#E2F183'
}];


/** Module 12 — cancellations. */
export const cancellationTotals = {
  rate: 6.4,
  lostRevenue: 62400,
  refunded: 48900,
  count: 47
};

export const cancellationTrend = [
{ label: 'Mar', rate: 8.1, lost: 74000 },
{ label: 'Apr', rate: 7.6, lost: 69800 },
{ label: 'May', rate: 7.2, lost: 71200 },
{ label: 'Jun', rate: 6.9, lost: 66400 },
{ label: 'Jul', rate: 6.6, lost: 64100 },
{ label: 'Aug', rate: 6.4, lost: 62400 }];


export const cancellationReasons = [
{ label: 'Change Of Plans', count: 24, share: 51, color: '#D9FF3F' },
{ label: 'Price Concerns', count: 14, share: 30, color: '#1F6B33' },
{ label: 'Booking Errors', count: 9, share: 19, color: '#C9C9C9' }];