import prisma from '../config/prisma';

export interface GetDashboardAnalyticsOptions {
  startDate?: string;
  endDate?: string;
  propertyId?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  userName?: string;
}

export const getDashboardAnalytics = async (tenantId: string, options: GetDashboardAnalyticsOptions = {}) => {
  const {
    startDate,
    endDate,
    propertyId,
    status,
    sortBy = 'created_at',
    sortOrder = 'desc',
    userName,
  } = options;

  const tenantPropertyIds = (await prisma.property.findMany({ where: { tenantId, deleted_at: null }, select: { id: true } })).map(p => p.id);

  if (tenantPropertyIds.length === 0) {
    return {
      totalRevenue: 0,
      totalOrders: 0,
      recentOrders: [],
      ordersByStatus: []
    };
  }

  const where: any = {
    propertyId: { in: tenantPropertyIds }
  };

  if (propertyId) {
    where.propertyId = propertyId;
  }

  if (status) {
    where.status = status;
  }

  if (userName) {
    where.user = {
      name: { contains: userName, mode: 'insensitive' }
    };
  }

  if (startDate || endDate) {
    where.created_at = {};
    if (startDate) {
      where.created_at.gte = new Date(startDate);
    }
    if (endDate) {
      const endOf = new Date(endDate);
      endOf.setHours(23, 59, 59, 999);
      where.created_at.lte = endOf;
    }
  }

  // Aggregate total revenue for PROCESSED/COMPLETED orders (or matching status if provided)
  const revenueWhere = { ...where };
  if (!status) {
    revenueWhere.status = { in: ['PROCESSED', 'COMPLETED'] };
  }
  const revenueAgg = await prisma.order.aggregate({
    where: revenueWhere,
    _sum: { total_price: true }
  });

  // Group orders by status
  const statusWhere = { ...where };
  delete statusWhere.status;
  const ordersByStatus = await prisma.order.groupBy({
    by: ['status'],
    where: statusWhere,
    _count: { id: true }
  });

  const totalOrders = await prisma.order.count({ where });

  // Get orders list sorted
  const recentOrders = await prisma.order.findMany({
    where,
    orderBy: { [sortBy]: sortOrder },
    take: 50,
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

export const getOccupancyCalendar = async (tenantId: string) => {
  return prisma.property.findMany({
    where: { tenantId, deleted_at: null },
    select: {
      id: true,
      name: true,
      rooms: {
        where: { deleted_at: null },
        select: {
          id: true,
          room_type: true,
          orders: {
            where: {
              status: { in: ['WAITING_PAYMENT', 'WAITING_CONFIRMATION', 'PROCESSED', 'COMPLETED'] }
            },
            select: {
              id: true,
              order_number: true,
              check_in_date: true,
              check_out_date: true,
              user: { select: { name: true } }
            }
          }
        }
      }
    }
  });
};
