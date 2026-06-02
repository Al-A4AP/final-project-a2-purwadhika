import { OrderStatus, type Prisma } from '@prisma/client';
import prisma from '../../config/prisma';

export interface GetTenantOrdersOptions {
  propertyId?: string; status?: string;
  startDate?: string; endDate?: string;
  sortBy?: string; sortOrder?: 'asc' | 'desc';
  page?: number; limit?: number;
}

export const getTenantOrders = async (tenantId: string, options: GetTenantOrdersOptions = {}) => {
  const paging = normalizeTenantOrderPaging(options);
  const where = buildTenantOrdersWhere(tenantId, options);
  const [orders, total] = await fetchTenantOrders(where, paging);
  return { orders, pagination: buildPagination(paging.page, paging.limit, total) };
};

const fetchTenantOrders = (where: Prisma.OrderWhereInput, paging: TenantOrderPaging) =>
  Promise.all([
    prisma.order.findMany({ where, include: tenantOrderInclude, orderBy: buildOrderBy(paging), skip: paging.skip, take: paging.limit }),
    prisma.order.count({ where }),
  ]);

const buildTenantOrdersWhere = (tenantId: string, options: GetTenantOrdersOptions) => {
  const where: Prisma.OrderWhereInput = { property: { tenantId } };
  applyTenantOrderFilters(where, options);
  return where;
};

const applyTenantOrderFilters = (where: Prisma.OrderWhereInput, options: GetTenantOrdersOptions) => {
  if (options.propertyId) where.propertyId = options.propertyId;
  if (options.status) where.status = options.status as OrderStatus;
  if (options.startDate || options.endDate) where.created_at = buildDateRange(options);
};

const buildDateRange = ({ startDate, endDate }: GetTenantOrdersOptions) => ({
  ...(startDate ? { gte: new Date(startDate) } : {}),
  ...(endDate ? { lte: endOfDay(endDate) } : {}),
});

const normalizeTenantOrderPaging = ({ sortBy = 'created_at', sortOrder = 'desc', page = 1, limit = 10 }: GetTenantOrdersOptions): TenantOrderPaging =>
  ({ sortBy, sortOrder, page, limit, skip: (page - 1) * limit });

const buildOrderBy = ({ sortBy, sortOrder }: TenantOrderPaging): Prisma.OrderOrderByWithRelationInput =>
  ({ [sortBy]: sortOrder });

const buildPagination = (page: number, limit: number, total: number) =>
  ({ page, limit, total, totalPages: Math.ceil(total / limit) });

const endOfDay = (date: string) => {
  const value = new Date(date);
  value.setHours(23, 59, 59, 999);
  return value;
};

const tenantOrderInclude = {
  user: { select: { name: true, email: true } },
  property: { select: { name: true } },
  room: { select: { room_type: true } },
} satisfies Prisma.OrderInclude;

interface TenantOrderPaging {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
  skip: number;
}
