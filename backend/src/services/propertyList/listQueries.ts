import prisma from "../../config/prisma";
import { getPriceSortedPropertyPage } from "../propertyPriceSortService";
import type { PropertyFilters } from "../propertyQueryService";
import type { PropertyListContext } from "./listTypes";

const includeListRelations = {
  category: true,
  rooms: { where: { deleted_at: null } },
  reviews: { where: { deleted_at: null }, select: { rating: true } },
  _count: { select: { orders: true } },
};

const shouldSkipDbPaging = (ctx: PropertyListContext) =>
  ctx.useMemFilter || ctx.useMemSort;

const buildBaseFindManyArgs = (ctx: PropertyListContext) => ({
    where: ctx.where,
    orderBy: ctx.orderBy,
    include: includeListRelations,
});

const buildFindManyArgs = (ctx: PropertyListContext) =>
  shouldSkipDbPaging(ctx)
    ? buildBaseFindManyArgs(ctx)
    : { ...buildBaseFindManyArgs(ctx), skip: ctx.skip, take: ctx.limit };

export const fetchPropertyItems = (ctx: PropertyListContext) =>
  prisma.property.findMany(buildFindManyArgs(ctx));

export const fetchPropertiesByIds = (ids: string[]) =>
  prisma.property.findMany({
    where: { id: { in: ids }, deleted_at: null },
    include: includeListRelations,
  });

export const getPriceSortedPageIds = (
  filters: PropertyFilters,
  order: string,
  skip: number,
  limit: number,
) => getPriceSortedPropertyPage(filters, order, skip, limit);

export const countProperties = (where: PropertyListContext["where"]) =>
  prisma.property.count({ where });

export const getCategories = async () =>
  prisma.propertyCategory.findMany({ orderBy: { name: "asc" } });
