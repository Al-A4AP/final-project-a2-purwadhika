import type { PropertyFilters } from "../propertyQueryService";
import { buildListContext, shouldUseDbPriceSort } from "./listContext";
import { processPropertyItems } from "./propertyFormatter";
import {
  fetchPropertiesByIds,
  fetchPropertyItems,
  getPriceSortedPageIds,
} from "./listQueries";
import { buildListResponse, getFinalSortedItems } from "./listResponse";
import { sortByIds } from "./listSorting";
import type { ProcessedPropertyItem, PropertyListContext } from "./listTypes";

export const getProperties = async (filters: PropertyFilters) => {
  const ctx = buildListContext(filters);
  if (shouldUseDbPriceSort(ctx)) return getDbPriceSortedResponse(filters, ctx);
  return getDefaultListResponse(ctx);
};

const getDefaultListResponse = async (ctx: PropertyListContext) => {
  const items = await fetchPropertyItems(ctx);
  const formatted = await processContextItems(items, ctx);
  const data = await getFinalSortedItems(formatted, ctx);
  return buildListResponse(data.finalItems, data.total, ctx.page, ctx.limit);
};

const getDbPriceSortedResponse = async (
  filters: PropertyFilters,
  ctx: PropertyListContext,
) => {
  const data = await getDbPriceSortedItems(filters, ctx);
  return buildListResponse(data.items, data.total, ctx.page, ctx.limit);
};

const getDbPriceSortedItems = async (
  filters: PropertyFilters,
  ctx: PropertyListContext,
) => {
  const { ids, total } = await getPriceSortedPageIds(filters, ctx.order, ctx.skip, ctx.limit);
  const items = await fetchPropertiesByIds(ids);
  return { items: await processPropertyItems(sortByIds(items, ids), null, null, false), total };
};

const processContextItems = (
  items: Parameters<typeof processPropertyItems>[0],
  ctx: PropertyListContext,
): Promise<ProcessedPropertyItem[]> =>
  processPropertyItems(items, ctx.checkIn, ctx.checkOut, ctx.useMemFilter);
