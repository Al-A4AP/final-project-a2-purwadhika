import type { Prisma } from '@prisma/client';
import prisma from '../../config/prisma';
import type { NormalizedTenantPropertyOptions } from './tenantPropertyTypes';
import { upsertWholePropertyRoom, type WholePropertyRoomData } from './wholePropertyRoom';

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
  options.sortBy === 'min_price'
    ? findTenantPropertiesByMinPrice(where, options)
    : findTenantPropertiesByColumn(where, options);

const findTenantPropertiesByColumn = (where: Prisma.PropertyWhereInput, options: NormalizedTenantPropertyOptions) =>
  prisma.property.findMany({
    where,
    include: propertyListInclude,
    orderBy: { [options.sortBy]: options.sortOrder },
    skip: (options.page - 1) * options.limit,
    take: options.limit,
  });

const findTenantPropertiesByMinPrice = async (where: Prisma.PropertyWhereInput, options: NormalizedTenantPropertyOptions) => {
  const properties = await prisma.property.findMany({ where, include: propertyListInclude });
  return sortByMinPrice(properties, options.sortOrder).slice(pageStart(options), pageEnd(options));
};

const sortByMinPrice = <T extends { rooms?: { base_price: number }[] }>(properties: T[], order: 'asc' | 'desc') =>
  [...properties].sort((left, right) => compareMinPrice(left, right, order));

const compareMinPrice = <T extends { rooms?: { base_price: number }[] }>(left: T, right: T, order: 'asc' | 'desc') => {
  const leftPrice = minRoomPrice(left);
  const rightPrice = minRoomPrice(right);
  if (leftPrice === null || rightPrice === null) return compareMissingPrice(leftPrice, rightPrice);
  return order === 'asc' ? leftPrice - rightPrice : rightPrice - leftPrice;
};

const minRoomPrice = (property: { rooms?: { base_price: number }[] }) =>
  property.rooms?.length ? Math.min(...property.rooms.map((room) => room.base_price)) : null;

const compareMissingPrice = (leftPrice: number | null, rightPrice: number | null) => {
  if (leftPrice === null && rightPrice === null) return 0;
  return leftPrice === null ? 1 : -1;
};

const pageStart = (options: NormalizedTenantPropertyOptions) =>
  (options.page - 1) * options.limit;

const pageEnd = (options: NormalizedTenantPropertyOptions) =>
  pageStart(options) + options.limit;

export const countTenantProperties = (where: Prisma.PropertyWhereInput) => prisma.property.count({ where });
export const findTenantPropertyNameConflict = (tenantId: string, name: string, exceptId?: string) =>
  prisma.property.findFirst({
    where: {
      tenantId,
      deleted_at: null,
      name: { equals: name.trim(), mode: 'insensitive' },
      ...(exceptId ? { id: { not: exceptId } } : {}),
    },
    select: { id: true },
  });
export const findTenantProperty = (id: string, tenantId: string) =>
  prisma.property.findFirst({ where: { id, tenantId, deleted_at: null } });
export const findTenantPropertyDetail = (id: string, tenantId: string) =>
  prisma.property.findFirst({ where: { id, tenantId, deleted_at: null }, include: propertyDetailInclude });
export const createTenantProperty = (data: Prisma.PropertyCreateInput) => prisma.property.create({ data });
export const updateTenantProperty = (id: string, data: Prisma.PropertyUncheckedUpdateInput) =>
  prisma.property.update({ where: { id }, data });
export const updateTenantPropertyWithWholeRoom = (
  id: string,
  data: Prisma.PropertyUncheckedUpdateInput,
  roomData: WholePropertyRoomData,
) => prisma.$transaction(async (tx) => {
  const property = await tx.property.update({ where: { id }, data });
  await upsertWholePropertyRoom(tx, id, roomData);
  return property;
});
export const softDeleteTenantProperty = (id: string) =>
  prisma.property.update({ where: { id }, data: { deleted_at: new Date() } });
