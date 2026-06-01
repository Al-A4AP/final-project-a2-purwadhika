import type { DashboardRevenuePeriod } from '../tenantProperty/dashboardRevenuePeriod';

export interface GetDashboardAnalyticsOptions {
  endDate?: string;
  limit?: number;
  page?: number;
  propertyId?: string;
  revenuePeriod?: DashboardRevenuePeriod | string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  startDate?: string;
  status?: string;
  userName?: string;
}

export interface NormalizedReportOptions extends GetDashboardAnalyticsOptions {
  limit: number;
  page: number;
  revenuePeriod: DashboardRevenuePeriod;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}
