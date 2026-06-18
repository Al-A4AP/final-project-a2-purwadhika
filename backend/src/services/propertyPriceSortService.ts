import { Prisma } from '@prisma/client';
import prisma from '../config/prisma';
import type { PropertyFilters } from './propertyQueryService';

const like = (value?: string) => `%${value?.trim() || ''}%`;
const toNumber = (value?: number) => (value === undefined ? undefined : Math.max(0, Number(value)));

const parseAmenities = (amenities?: string | string[]) => {
  if (!amenities) return [];
  const values = Array.isArray(amenities) ? amenities : amenities.split(',');
  return values.map((item) => item.trim()).filter(Boolean);
};

const capacityValue = (filters: PropertyFilters) => {
  return Number(filters.adults || filters.capacity || 0);
};

const baseConditions = () => [
  Prisma.sql`p.deleted_at IS NULL`,
  Prisma.sql`r.deleted_at IS NULL`,
];

const addTextFilters = (conditions: Prisma.Sql[], filters: PropertyFilters) => {
  if (filters.search?.trim()) conditions.push(Prisma.sql`p.name ILIKE ${like(filters.search)}`);
  if (filters.city?.trim()) conditions.push(Prisma.sql`p.city ILIKE ${like(filters.city)}`);
  if (filters.category?.trim()) conditions.push(Prisma.sql`c.name ILIKE ${like(filters.category)}`);
};

const addRoomFilters = (conditions: Prisma.Sql[], filters: PropertyFilters) => {
  const capacity = capacityValue(filters);
  const minPrice = toNumber(filters.min_price);
  const maxPrice = toNumber(filters.max_price);
  if (capacity > 0) conditions.push(Prisma.sql`r.capacity >= ${capacity}`);
  if (minPrice !== undefined) conditions.push(Prisma.sql`r.base_price >= ${minPrice}`);
  if (maxPrice !== undefined) conditions.push(Prisma.sql`r.base_price <= ${maxPrice}`);
};

const addAmenitiesFilter = (conditions: Prisma.Sql[], filters: PropertyFilters) => {
  const amenities = parseAmenities(filters.amenities);
  if (amenities.length) conditions.push(Prisma.sql`p.amenities @> ARRAY[${Prisma.join(amenities)}]::text[]`);
};

const buildWhere = (filters: PropertyFilters) => {
  const conditions = baseConditions();
  addTextFilters(conditions, filters);
  addRoomFilters(conditions, filters);
  addAmenitiesFilter(conditions, filters);
  return Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}`;
};

const countPriceSortedProperties = async (where: Prisma.Sql) => {
  const rows = await prisma.$queryRaw<{ total: bigint }[]>(Prisma.sql`
    SELECT COUNT(*)::bigint AS total FROM (
      SELECT p.id FROM properties p
      JOIN property_categories c ON c.id = p."categoryId"
      JOIN rooms r ON r."propertyId" = p.id
      ${where}
      GROUP BY p.id
    ) counted
  `);
  return Number(rows[0]?.total || 0);
};

export const getPriceSortedPropertyPage = async (filters: PropertyFilters, order: string, skip: number, limit: number) => {
  const where = buildWhere(filters);
  const direction = order === 'asc' ? Prisma.sql`ASC` : Prisma.sql`DESC`;
  const rows = await prisma.$queryRaw<{ id: string }[]>(Prisma.sql`
    SELECT p.id FROM properties p
    JOIN property_categories c ON c.id = p."categoryId"
    JOIN rooms r ON r."propertyId" = p.id
    ${where}
    GROUP BY p.id
    ORDER BY MIN(r.base_price) ${direction}, p.created_at DESC
    LIMIT ${limit} OFFSET ${skip}
  `);
  return { ids: rows.map((row) => row.id), total: await countPriceSortedProperties(where) };
};
