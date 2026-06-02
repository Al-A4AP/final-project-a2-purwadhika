import { OrderStatus } from '@prisma/client';
import prisma from '../config/prisma';

export interface GetUserOrdersOptions {
  orderNumber?: string; status?: string;
  startDate?: string; endDate?: string;
  sortBy?: string; sortOrder?: 'asc' | 'desc';
  page?: number; limit?: number;
}

export const getUserOrders = async (userId: string, options: GetUserOrdersOptions = {}) => {
  const { sortBy = 'created_at', sortOrder = 'desc', page = 1, limit = 10 } = options;
  await syncExpiredUserOrders(userId);
  const where = buildUserOrdersWhere(userId, options);
  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        property: { select: { name: true, city: true, featured_image_url: true } },
        room: { select: { room_type: true } },
        review: true,
      },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);
  return { orders, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

const syncExpiredUserOrders = (userId: string) => {
  const now = new Date();
  return prisma.order.updateMany({
    where: { userId, status: OrderStatus.WAITING_PAYMENT, expires_at: { lt: now } },
    data: { status: OrderStatus.CANCELLED, canceled_at: now },
  });
};

const buildUserOrdersWhere = (userId: string, options: GetUserOrdersOptions) => {
  const where: any = { userId };
  if (options.orderNumber) where.order_number = { contains: options.orderNumber, mode: 'insensitive' };
  if (options.status) where.status = options.status;
  if (options.startDate || options.endDate) where.check_in_date = buildDateRange(options);
  return where;
};

const buildDateRange = (options: GetUserOrdersOptions) => {
  const range: any = {};
  if (options.startDate) range.gte = new Date(options.startDate);
  if (options.endDate) { const end = new Date(options.endDate); end.setHours(23, 59, 59, 999); range.lte = end; }
  return range;
};
