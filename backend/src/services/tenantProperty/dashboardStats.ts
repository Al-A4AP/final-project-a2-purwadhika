import prisma from '../../config/prisma';

export const getTenantDashboardStats = async (tenantId: string) => {
  const { start, end } = getCurrentMonthRange();
  const [propertyCount, roomCount, pendingOrders, recentOrders, revenue] = await Promise.all([
    countProperties(tenantId),
    countRooms(tenantId),
    countPendingOrders(tenantId),
    findRecentOrders(tenantId),
    aggregateMonthlyRevenue(tenantId, start, end),
  ]);
  return { propertyCount, roomCount, pendingOrders, monthlyRevenue: revenue._sum.total_price || 0, recentOrders };
};

const getCurrentMonthRange = () => {
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 1);
  return { start, end };
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
const aggregateMonthlyRevenue = (tenantId: string, start: Date, end: Date) => prisma.order.aggregate({
  where: { property: { tenantId }, status: { in: ['PROCESSED', 'COMPLETED'] }, payment_verified_at: { gte: start, lt: end } },
  _sum: { total_price: true },
});
