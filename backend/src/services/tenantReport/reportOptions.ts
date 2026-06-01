import type { GetDashboardAnalyticsOptions, NormalizedReportOptions } from './reportTypes';
import { normalizeRevenuePeriod } from '../tenantProperty/dashboardRevenuePeriod';

const clampPositive = (value: number | undefined, fallback: number) =>
  value && value > 0 ? value : fallback;

export const normalizeReportOptions = (options: GetDashboardAnalyticsOptions = {}): NormalizedReportOptions => ({
  ...options,
  limit: clampPositive(options.limit, 10),
  page: clampPositive(options.page, 1),
  revenuePeriod: normalizeRevenuePeriod(options.revenuePeriod),
  sortBy: options.sortBy || 'created_at',
  sortOrder: options.sortOrder === 'asc' ? 'asc' : 'desc',
});
