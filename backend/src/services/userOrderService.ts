import { OrderStatus, type Prisma } from '@prisma/client';
import prisma from '../config/prisma';

export interface GetUserOrdersOptions {
  check_in_date?: string; check_out_date?: string;
  orderNumber?: string; status?: string;
  startDate?: string; endDate?: string;
  sortBy?: string; sortOrder?: 'asc' | 'desc';
  page?: number; limit?: number;
}

export const getUserOrders = async (userId: string, options: GetUserOrdersOptions = {}) => {
  const { sortBy = 'created_at', sortOrder = 'desc', page = 1, limit = 10 } = options;
  await syncExpiredUserOrders(userId);
  const where = buildUserOrdersWhere(userId, options);
  const [orders, total] = await fetchUserOrders(where, { limit, page, sortBy, sortOrder });
  return { orders, pagination: buildPagination(page, limit, total) };
};

const syncExpiredUserOrders = (userId: string) => {
  const now = new Date();
  return prisma.order.updateMany({
    where: { userId, status: OrderStatus.WAITING_PAYMENT, expires_at: { lt: now } },
    data: { status: OrderStatus.CANCELLED, canceled_at: now },
  });
};

const fetchUserOrders = (where: Prisma.OrderWhereInput, query: UserOrdersQuery) =>
  Promise.all([
    prisma.order.findMany({
      where,
      include: getUserOrderInclude(),
      orderBy: { [query.sortBy]: query.sortOrder },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
    prisma.order.count({ where }),
  ]);

const getUserOrderInclude = () => ({
  property: { select: { name: true, city: true, featured_image_url: true } },
  room: { select: { room_type: true } },
  review: true,
});

const buildUserOrdersWhere = (userId: string, options: GetUserOrdersOptions): Prisma.OrderWhereInput => {
  const where: Prisma.OrderWhereInput = { userId };
  if (options.orderNumber) where.order_number = { contains: options.orderNumber, mode: 'insensitive' };
  if (options.status) where.status = options.status as OrderStatus;
  applyStayDateFilters(where, options);
  return where;
};

const applyStayDateFilters = (where: Prisma.OrderWhereInput, options: GetUserOrdersOptions) => {
  const checkInDate = options.check_in_date || options.startDate;
  const checkOutDate = options.check_out_date || options.endDate;
  if (checkInDate) where.check_in_date = buildSingleDayRange(checkInDate);
  if (checkOutDate) where.check_out_date = buildSingleDayRange(checkOutDate);
};

const buildSingleDayRange = (value: string): Prisma.DateTimeFilter =>
  ({ gte: startOfDay(value), lte: endOfDay(value) });

const startOfDay = (value: string) =>
  new Date(value);

const endOfDay = (value: string) => {
  const date = new Date(value);
  date.setHours(23, 59, 59, 999);
  return date;
};

const buildPagination = (page: number, limit: number, total: number) =>
  ({ page, limit, total, totalPages: Math.ceil(total / limit) });

interface UserOrdersQuery {
  limit: number;
  page: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}
