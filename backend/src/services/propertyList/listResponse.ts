import { shouldUseMemoryPage } from "./listContext";
import { countProperties } from "./listQueries";
import { applyMemorySort } from "./listSorting";
import type { ProcessedPropertyItem, PropertyListContext } from "./listTypes";

export const buildListResponse = (
  items: ProcessedPropertyItem[],
  total: number,
  page: number,
  limit: number,
) => ({
  items,
  pagination: { total, page, limit, pages: Math.ceil(total / limit) },
});

const sliceMemoryPage = (items: ProcessedPropertyItem[], ctx: PropertyListContext) =>
  items.slice(ctx.skip, ctx.skip + ctx.limit);

export const getFinalSortedItems = async (
  formattedItems: ProcessedPropertyItem[],
  ctx: PropertyListContext,
) => {
  applyMemorySort(formattedItems, ctx.sort, ctx.order);
  if (shouldUseMemoryPage(ctx)) {
    return { finalItems: sliceMemoryPage(formattedItems, ctx), total: formattedItems.length };
  }
  return { finalItems: formattedItems, total: await countProperties(ctx.where) };
};
