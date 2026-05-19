import prisma from '../config/prisma';

export const getDashboardAnalytics = async (tenantId: string) => {
  const propertyIds = (await prisma.property.findMany({ where: { tenantId }, select: { id: true } })).map(p => p.id);

  if (propertyIds.length === 0) {
    return {
      totalRevenue: 0,
      totalOrders: 0,
      recentOrders: [],
      ordersByStatus: []
    };
  }

  // Aggregate total revenue for PROCESSED orders
  const revenueAgg = await prisma.order.aggregate({
    where: { propertyId: { in: propertyIds }, status: 'PROCESSED' },
    _sum: { total_price: true }
  });

  // Group orders by status
  const ordersByStatus = await prisma.order.groupBy({
    by: ['status'],
    where: { propertyId: { in: propertyIds } },
    _count: { id: true }
  });

  const totalOrders = ordersByStatus.reduce((acc, curr) => acc + curr._count.id, 0);

  // Get recent 5 orders
  const recentOrders = await prisma.order.findMany({
    where: { propertyId: { in: propertyIds } },
    orderBy: { created_at: 'desc' },
    take: 5,
    include: {
      property: { select: { name: true } },
      user: { select: { name: true } }
    }
  });

  return {
    totalRevenue: revenueAgg._sum.total_price || 0,
    totalOrders,
    ordersByStatus: ordersByStatus.map(s => ({ name: s.status, count: s._count.id })),
    recentOrders
  };
};
