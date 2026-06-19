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

type RevenueTrendOrder = {
  payment_verified_at: Date | null;
  total_price: number;
};

const formatRevenueTrendKey = (date: Date, isDaily: boolean) =>
  isDaily
    ? date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
    : date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });

const initializeRevenueTrend = (start: Date, end: Date, isDaily: boolean) => {
  const trend = new Map<string, number>();
  const current = new Date(start);
  while (current < end) {
    trend.set(formatRevenueTrendKey(current, isDaily), 0);
    if (isDaily) current.setDate(current.getDate() + 1);
    else current.setMonth(current.getMonth() + 1);
  }
  return trend;
};

const addOrdersToRevenueTrend = (
  trend: Map<string, number>,
  orders: RevenueTrendOrder[],
  isDaily: boolean,
) => orders.forEach((order) => {
  if (!order.payment_verified_at) return;
  const key = formatRevenueTrendKey(new Date(order.payment_verified_at), isDaily);
  if (trend.has(key)) trend.set(key, trend.get(key)! + order.total_price);
});

const buildRevenueTrend = async (tenantId: string, start: Date, end: Date, period: DashboardRevenuePeriod) => {
  const orders = await prisma.order.findMany({
    where: { property: { tenantId }, status: { in: ['PROCESSED', 'COMPLETED'] }, ...buildVerifiedRevenueDateWhere(start, end) },
    select: { payment_verified_at: true, total_price: true }
  });
  const isDaily = period === 'weekly' || period === 'monthly';
  const trendMap = initializeRevenueTrend(start, end, isDaily);
  addOrdersToRevenueTrend(trendMap, orders, isDaily);
  return Array.from(trendMap.entries()).map(([label, amount]) => ({ label, amount }));
};

const buildDashboardStats = (propertyCount: number, roomCount: number, pendingOrders: number, recentOrders: unknown[], revenue: number, revenuePeriod: string, revenueTrend: { label: string; amount: number }[]) => ({
  propertyCount, roomCount, pendingOrders, revenue, monthlyRevenue: revenue, revenuePeriod, recentOrders, revenueTrend
});
