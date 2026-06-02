import {
  buildOrderBy,
  buildPropertyWhere,
  type PropertyFilters,
} from "../propertyQueryService";
import type { PropertyListContext } from "./listTypes";

const ALLOWED_SORTS = ["created_at", "name", "price", "rating", "popularity"];
const MEMORY_SORTS = ["price", "rating", "popularity"];

const normalizePage = (value?: number) =>
  Math.max(1, Math.floor(Number(value) || 1));

const normalizeLimit = (value?: number) =>
  Math.min(24, Math.max(1, Math.floor(Number(value) || 12)));

const normalizeSort = (sort?: string) =>
  ALLOWED_SORTS.includes(String(sort)) ? String(sort) : "created_at";

const normalizeOrder = (order?: string) =>
  order === "asc" ? "asc" : "desc";

const toValidDate = (value?: string) => {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
};

const getDateRange = (filters: PropertyFilters) => {
  const checkIn = toValidDate(filters.check_in_date);
  const checkOut = toValidDate(filters.check_out_date);
  if (!checkIn || !checkOut || checkOut <= checkIn) return { checkIn: null, checkOut: null };
  return { checkIn, checkOut };
};

const isMemorySort = (sort: string) =>
  MEMORY_SORTS.includes(sort);

export const buildListContext = (filters: PropertyFilters): PropertyListContext => {
  const options = getNormalizedOptions(filters);
  const dates = getDateRange(filters);
  return buildContext(filters, options, dates);
};

const getNormalizedOptions = (filters: PropertyFilters) => ({
  limit: normalizeLimit(filters.limit),
  order: normalizeOrder(filters.order),
  page: normalizePage(filters.page),
  sort: normalizeSort(filters.sort),
});

const buildContext = (
  filters: PropertyFilters,
  options: ReturnType<typeof getNormalizedOptions>,
  dates: ReturnType<typeof getDateRange>,
): PropertyListContext => ({
  ...options,
  ...dates,
  useMemFilter: !!(dates.checkIn && dates.checkOut),
  skip: (options.page - 1) * options.limit,
  where: buildPropertyWhere(filters),
  orderBy: buildOrderBy(options.sort, options.order),
  useMemSort: isMemorySort(options.sort),
});

export const shouldUseMemoryPage = (ctx: PropertyListContext) =>
  ctx.useMemFilter || ctx.useMemSort;

export const shouldUseDbPriceSort = (ctx: PropertyListContext) =>
  ctx.sort === "price" && !ctx.useMemFilter;
