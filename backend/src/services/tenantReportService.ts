import { buildReportWhere, buildRevenueWhere, buildStatusWhere } from './tenantReport/reportFilters';
import { findOccupancyCalendar } from './tenantReport/occupancyQuery';
import { normalizeReportOptions } from './tenantReport/reportOptions';
import { buildDashboardAnalyticsResponse, emptyDashboardAnalytics } from './tenantReport/reportResponse';
import { aggregateRevenue, countReportOrders, findReportOrders, getTenantPropertyIds, groupOrdersByStatus } from './tenantReport/reportQueries';
import type { GetDashboardAnalyticsOptions, NormalizedReportOptions } from './tenantReport/reportTypes';
import type { Prisma } from '@prisma/client';

export type { GetDashboardAnalyticsOptions } from './tenantReport/reportTypes';

const loadDashboardAnalytics = async (where: Prisma.OrderWhereInput, options: NormalizedReportOptions) => {
  const [totalRevenue, ordersByStatus, totalOrders, recentOrders] = await Promise.all([
    aggregateRevenue(buildRevenueWhere(where, options.status)),
    groupOrdersByStatus(buildStatusWhere(where)),
    countReportOrders(where),
    findReportOrders(where, options),
  ]);
  return { ordersByStatus, recentOrders, totalOrders, totalRevenue };
};

export const getDashboardAnalytics = async (tenantId: string, options: GetDashboardAnalyticsOptions = {}) => {
  const reportOptions = normalizeReportOptions(options);
  const propertyIds = await getTenantPropertyIds(tenantId);
  if (propertyIds.length === 0) return emptyDashboardAnalytics();
  const where = buildReportWhere(propertyIds, reportOptions);
  const data = await loadDashboardAnalytics(where, reportOptions);
  return buildDashboardAnalyticsResponse(data, reportOptions.page, reportOptions.limit);
};

export const getOccupancyCalendar = (tenantId: string) => findOccupancyCalendar(tenantId);
