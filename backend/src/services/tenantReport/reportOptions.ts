import type { GetDashboardAnalyticsOptions, NormalizedReportOptions } from './reportTypes';

const clampPositive = (value: number | undefined, fallback: number) =>
  value && value > 0 ? value : fallback;

export const normalizeReportOptions = (options: GetDashboardAnalyticsOptions = {}): NormalizedReportOptions => ({
  ...options,
  limit: clampPositive(options.limit, 10),
  page: clampPositive(options.page, 1),
  sortBy: options.sortBy || 'created_at',
  sortOrder: options.sortOrder === 'asc' ? 'asc' : 'desc',
});
