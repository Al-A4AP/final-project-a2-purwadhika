import type { Prisma } from '@prisma/client';
import type { NormalizedReportOptions } from './reportTypes';
import { parseOrderStatus, REVENUE_STATUSES } from './reportConstants';
import { buildVerifiedRevenueDateWhere } from '../revenueDateFilter';
import { getRevenueDateRange } from '../tenantProperty/dashboardRevenuePeriod';

const endOfDay = (date: string) => {
  const value = new Date(date);
  value.setHours(23, 59, 59, 999);
  return value;
};

const buildPropertyFilter = (propertyIds: string[], propertyId?: string) => {
  if (!propertyId) return { in: propertyIds };
  return propertyIds.includes(propertyId) ? propertyId : { in: [] };
};

export const buildReportWhere = (propertyIds: string[], options: NormalizedReportOptions): Prisma.OrderWhereInput => ({
  propertyId: buildPropertyFilter(propertyIds, options.propertyId),
  ...(parseOrderStatus(options.status) ? { status: parseOrderStatus(options.status) } : {}),
  ...(options.userName ? { user: { name: { contains: options.userName, mode: 'insensitive' } } } : {}),
  ...(options.startDate || options.endDate ? { created_at: buildDateFilter(options) } : {}),
});

const buildDateFilter = (options: NormalizedReportOptions): Prisma.DateTimeFilter => ({
  ...(options.startDate ? { gte: new Date(options.startDate) } : {}),
  ...(options.endDate ? { lte: endOfDay(options.endDate) } : {}),
});

export const buildRevenueWhere = (where: Prisma.OrderWhereInput, options: NormalizedReportOptions): Prisma.OrderWhereInput => {
  const { created_at: _createdAt, status: _status, ...baseWhere } = where;
  const { start, end } = getRevenueDateRange(options.revenuePeriod);
  return { ...baseWhere, status: buildRevenueStatusFilter(options.status), ...buildVerifiedRevenueDateWhere(start, end) };
};

const buildRevenueStatusFilter = (status?: string) => {
  const parsed = parseOrderStatus(status);
  if (!parsed) return { in: REVENUE_STATUSES };
  return REVENUE_STATUSES.includes(parsed) ? parsed : { in: [] };
};

export const buildStatusWhere = (where: Prisma.OrderWhereInput): Prisma.OrderWhereInput => {
  const { status: _status, ...rest } = where;
  return rest;
};
