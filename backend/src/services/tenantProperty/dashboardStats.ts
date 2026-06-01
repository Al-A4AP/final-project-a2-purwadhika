import prisma from '../../config/prisma';
import { buildVerifiedRevenueDateWhere } from '../revenueDateFilter';
import { getRevenueDateRange, normalizeRevenuePeriod } from './dashboardRevenuePeriod';
import type { GetDashboardStatsOptions } from './tenantPropertyTypes';

export const getTenantDashboardStats = async (tenantId: string, options: GetDashboardStatsOptions = {}) => {
  const revenuePeriod = normalizeRevenuePeriod(options.revenuePeriod);
  const { start, end } = getRevenueDateRange(revenuePeriod);
  const [propertyCount, roomCount, pendingOrders, recentOrders, revenue] = await Promise.all([
    countProperties(tenantId),
    countRooms(tenantId),
    countPendingOrders(tenantId),
    findRecentOrders(tenantId),
    aggregateRevenue(tenantId, start, end),
  ]);
  return buildDashboardStats(propertyCount, roomCount, pendingOrders, recentOrders, revenue._sum.total_price || 0, revenuePeriod);
};

const countProperties = (tenantId: string) => prisma.property.count({ where: { tenantId, deleted_at: null } });
const countRooms = (tenantId: string) => prisma.room.count({ where: { property: { tenantId }, deleted_at: null } });
const countPendingOrders = (tenantId: string) =>
  prisma.order.count({ where: { property: { tenantId }, status: 'WAITING_CONFIRMATION' } });
const findRecentOrders = (tenantId: string) => prisma.order.findMany({
  where: { property: { tenantId } },
  include: { user: { select: { name: true } }, property: { select: { name: true } }, room: { select: { room_type: true } } },
  orderBy: { created_at: 'desc' },
  take: 5,
});
const aggregateRevenue = (tenantId: string, start: Date, end: Date) => prisma.order.aggregate({
  where: { property: { tenantId }, status: { in: ['PROCESSED', 'COMPLETED'] }, ...buildVerifiedRevenueDateWhere(start, end) },
  _sum: { total_price: true },
});

const buildDashboardStats = (propertyCount: number, roomCount: number, pendingOrders: number, recentOrders: unknown[], revenue: number, revenuePeriod: string) => ({
  propertyCount, roomCount, pendingOrders, revenue, monthlyRevenue: revenue, revenuePeriod, recentOrders,
});
