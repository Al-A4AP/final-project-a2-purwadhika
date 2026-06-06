import prisma from '../../config/prisma';
import { buildVerifiedRevenueDateWhere } from '../revenueDateFilter';
import { getRevenueDateRange, normalizeRevenuePeriod, type DashboardRevenuePeriod } from './dashboardRevenuePeriod';
import type { GetDashboardStatsOptions } from './tenantPropertyTypes';

export const getTenantDashboardStats = async (tenantId: string, options: GetDashboardStatsOptions = {}) => {
  const revenuePeriod = normalizeRevenuePeriod(options.revenuePeriod);
  const { start, end } = getRevenueDateRange(revenuePeriod);
  const [propertyCount, roomCount, pendingOrders, recentOrders, revenue, revenueTrend] = await Promise.all([
    countProperties(tenantId),
    countRooms(tenantId),
    countPendingOrders(tenantId),
    findRecentOrders(tenantId),
    aggregateRevenue(tenantId, start, end),
    buildRevenueTrend(tenantId, start, end, revenuePeriod),
  ]);
  return buildDashboardStats(propertyCount, roomCount, pendingOrders, recentOrders, revenue._sum.total_price || 0, revenuePeriod, revenueTrend);
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

const buildRevenueTrend = async (tenantId: string, start: Date, end: Date, period: DashboardRevenuePeriod) => {
  const orders = await prisma.order.findMany({
    where: { property: { tenantId }, status: { in: ['PROCESSED', 'COMPLETED'] }, ...buildVerifiedRevenueDateWhere(start, end) },
    select: { payment_verified_at: true, total_price: true }
  });

  const isDaily = period === 'weekly' || period === 'monthly';
  const trendMap = new Map<string, number>();

  let current = new Date(start);
  while (current < end) {
    let key = '';
    if (isDaily) {
      key = current.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      current.setDate(current.getDate() + 1);
    } else {
      key = current.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
      current.setMonth(current.getMonth() + 1);
    }
    trendMap.set(key, 0);
  }

  orders.forEach(order => {
    if (!order.payment_verified_at) return;
    const date = new Date(order.payment_verified_at);
    const key = isDaily 
      ? date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
      : date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
    if (trendMap.has(key)) {
      trendMap.set(key, trendMap.get(key)! + order.total_price);
    }
  });

  return Array.from(trendMap.entries()).map(([label, amount]) => ({ label, amount }));
};

const buildDashboardStats = (propertyCount: number, roomCount: number, pendingOrders: number, recentOrders: unknown[], revenue: number, revenuePeriod: string, revenueTrend: { label: string; amount: number }[]) => ({
  propertyCount, roomCount, pendingOrders, revenue, monthlyRevenue: revenue, revenuePeriod, recentOrders, revenueTrend
});
