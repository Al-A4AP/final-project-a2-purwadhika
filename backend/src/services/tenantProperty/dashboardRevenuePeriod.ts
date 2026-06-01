export type DashboardRevenuePeriod = 'weekly' | 'monthly' | 'quarterly' | 'six_months' | 'yearly';

export const DEFAULT_REVENUE_PERIOD: DashboardRevenuePeriod = 'monthly';

const REVENUE_PERIODS: DashboardRevenuePeriod[] = ['weekly', 'monthly', 'quarterly', 'six_months', 'yearly'];

export const normalizeRevenuePeriod = (value?: string): DashboardRevenuePeriod =>
  REVENUE_PERIODS.includes(value as DashboardRevenuePeriod) ? value as DashboardRevenuePeriod : DEFAULT_REVENUE_PERIOD;

export const getRevenueDateRange = (period: DashboardRevenuePeriod) => {
  if (period === 'weekly') return buildWeeklyRange(new Date());
  if (period === 'yearly') return buildYearRange(new Date());
  return buildMonthSpanRange(new Date(), getMonthSpan(period));
};

const getMonthSpan = (period: DashboardRevenuePeriod) => {
  if (period === 'quarterly') return 3;
  if (period === 'six_months') return 6;
  return 1;
};

const buildMonthSpanRange = (now: Date, months: number) => ({
  start: new Date(now.getFullYear(), now.getMonth() - months + 1, 1),
  end: new Date(now.getFullYear(), now.getMonth() + 1, 1),
});

const buildYearRange = (now: Date) => ({
  start: new Date(now.getFullYear(), 0, 1),
  end: new Date(now.getFullYear() + 1, 0, 1),
});

const buildWeeklyRange = (now: Date) => {
  const start = startOfDay(now);
  start.setDate(start.getDate() + getMondayOffset(start.getDay()));
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  return { start, end };
};

const startOfDay = (date: Date) => {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

const getMondayOffset = (day: number) => day === 0 ? -6 : 1 - day;
