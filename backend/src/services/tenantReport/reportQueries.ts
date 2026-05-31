import type { Prisma } from '@prisma/client';
import prisma from '../../config/prisma';
import type { NormalizedReportOptions } from './reportTypes';

export const getTenantPropertyIds = async (tenantId: string) => {
  const properties = await prisma.property.findMany({ where: { tenantId, deleted_at: null }, select: { id: true } });
  return properties.map((property) => property.id);
};

export const aggregateRevenue = async (where: Prisma.OrderWhereInput) => {
  const result = await prisma.order.aggregate({ where, _sum: { total_price: true } });
  return result._sum.total_price || 0;
};

export const groupOrdersByStatus = async (where: Prisma.OrderWhereInput) => {
  const rows = await prisma.order.groupBy({ by: ['status'], where, _count: { id: true } });
  return rows.map((row) => ({ name: row.status, count: row._count.id }));
};

export const countReportOrders = (where: Prisma.OrderWhereInput) =>
  prisma.order.count({ where });

export const findReportOrders = (where: Prisma.OrderWhereInput, options: NormalizedReportOptions) => (
  prisma.order.findMany({
    where,
    orderBy: { [options.sortBy]: options.sortOrder },
    skip: (options.page - 1) * options.limit,
    take: options.limit,
    include: { property: { select: { name: true } }, user: { select: { name: true } } },
  })
);
