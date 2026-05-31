import type { Prisma } from '@prisma/client';
import prisma from '../../config/prisma';
import type { NormalizedTenantPropertyOptions } from './tenantPropertyTypes';

const propertyListInclude = {
  category: true,
  rooms: { where: { deleted_at: null }, select: { base_price: true } },
  _count: { select: { rooms: true, orders: true, reviews: true } },
};
const propertyDetailInclude = {
  category: true,
  images: { orderBy: { order: 'asc' as const } },
  rooms: {
    where: { deleted_at: null },
    include: { images: { orderBy: { order: 'asc' as const } }, peakRates: { where: { deleted_at: null } } },
  },
};

export const findTenantProperties = (where: Prisma.PropertyWhereInput, options: NormalizedTenantPropertyOptions) =>
  prisma.property.findMany({
    where,
    include: propertyListInclude,
    orderBy: { [options.sortBy]: options.sortOrder },
    skip: (options.page - 1) * options.limit,
    take: options.limit,
  });

export const countTenantProperties = (where: Prisma.PropertyWhereInput) => prisma.property.count({ where });
export const findTenantProperty = (id: string, tenantId: string) =>
  prisma.property.findFirst({ where: { id, tenantId, deleted_at: null } });
export const findTenantPropertyDetail = (id: string, tenantId: string) =>
  prisma.property.findFirst({ where: { id, tenantId, deleted_at: null }, include: propertyDetailInclude });
export const createTenantProperty = (data: Prisma.PropertyUncheckedCreateInput) => prisma.property.create({ data });
export const updateTenantProperty = (id: string, data: Prisma.PropertyUncheckedUpdateInput) =>
  prisma.property.update({ where: { id }, data });
export const softDeleteTenantProperty = (id: string) =>
  prisma.property.update({ where: { id }, data: { deleted_at: new Date() } });
