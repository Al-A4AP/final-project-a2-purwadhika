import prisma from "../config/prisma";
import type { Prisma } from "@prisma/client";
import { calculateStayDetails } from "./pricingService";
import { checkAvailability } from "./availabilityService";
import {
  buildOrderBy,
  buildPropertyWhere,
  type PropertyFilters,
} from "./propertyQueryService";
import { getPriceSortedPropertyPage } from "./propertyPriceSortService";

export { getPropertyDetail } from "./propertyDetailService";

const includeListRelations = {
  category: true,
  rooms: { where: { deleted_at: null } },
  reviews: { where: { deleted_at: null }, select: { rating: true } },
  _count: { select: { orders: true } },
};

const ALLOWED_SORTS = ["created_at", "name", "price", "rating", "popularity"];

type RatingReview = { rating: number };

type Room = {
  id: string;
  base_price: number;
  capacity: number;
  [key: string]: unknown;
};

type RoomWithStatus = Room & {
  is_available?: boolean;
  priceDetails?: unknown;
};

interface RoomEvaluationResult {
  hasAvailable: boolean;
  minPrice: number;
  roomsWithStatus: RoomWithStatus[];
}

interface PropertyItem {
  id: string;
  rooms: Room[];
  reviews?: RatingReview[];
  _count?: { orders: number };
  [key: string]: unknown;
}

interface ProcessedPropertyItem extends PropertyItem {
  min_price: number;
  rating?: number;
  review_count: number;
  order_count: number;
  rooms: RoomWithStatus[];
}

interface PropertyListContext {
  page: number;
  limit: number;
  sort: string;
  order: string;
  checkIn: Date | null;
  checkOut: Date | null;
  useMemFilter: boolean;
  skip: number;
  where: Prisma.PropertyWhereInput;
  orderBy: Prisma.PropertyOrderByWithRelationInput;
  useMemSort: boolean;
}

const normalizePage = (value?: number) =>
  Math.max(1, Math.floor(Number(value) || 1));

const normalizeLimit = (value?: number) =>
  Math.min(24, Math.max(1, Math.floor(Number(value) || 12)));

const normalizeSort = (sort?: string) =>
  ALLOWED_SORTS.includes(String(sort)) ? String(sort) : "created_at";

const normalizeOrder = (order?: string) => (order === "asc" ? "asc" : "desc");

const toValidDate = (value?: string) => {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
};

const getDateRange = (filters: PropertyFilters) => {
  const checkIn = toValidDate(filters.check_in_date);
  const checkOut = toValidDate(filters.check_out_date);
  if (!checkIn || !checkOut || checkOut <= checkIn)
    return { checkIn: null, checkOut: null };
  return { checkIn, checkOut };
};

const buildListContext = (filters: PropertyFilters): PropertyListContext => {
  const page = normalizePage(filters.page);
  const limit = normalizeLimit(filters.limit);
  const sort = normalizeSort(filters.sort);
  const order = normalizeOrder(filters.order);
  const { checkIn, checkOut } = getDateRange(filters);
  const useMemFilter = !!(checkIn && checkOut);
  return {
    page,
    limit,
    sort,
    order,
    checkIn,
    checkOut,
    useMemFilter,
    skip: (page - 1) * limit,
    where: buildPropertyWhere(filters),
    orderBy: buildOrderBy(sort, order),
    useMemSort: ["price", "rating", "popularity"].includes(sort),
  };
};

export const getProperties = async (filters: PropertyFilters) => {
  const ctx = buildListContext(filters);
  if (ctx.sort === "price" && !ctx.useMemFilter) {
    const data = await getDbPriceSortedItems(
      filters,
      ctx.order,
      ctx.skip,
      ctx.limit,
    );
    return buildListResponse(data.items, data.total, ctx.page, ctx.limit);
  }
  const items = await fetchPropertyItems(ctx);
  const formatted = await processPropertyItems(
    items,
    ctx.checkIn,
    ctx.checkOut,
    ctx.useMemFilter,
  );
  const data = await getFinalSortedItems(formatted, ctx);
  return buildListResponse(data.finalItems, data.total, ctx.page, ctx.limit);
};

const buildListResponse = (
  items: ProcessedPropertyItem[],
  total: number,
  page: number,
  limit: number,
) => ({
  items,
  pagination: { total, page, limit, pages: Math.ceil(total / limit) },
});

const fetchPropertyItems = (ctx: PropertyListContext) =>
  prisma.property.findMany({
    where: ctx.where,
    orderBy: ctx.orderBy,
    include: includeListRelations,
    ...(ctx.useMemFilter || ctx.useMemSort
      ? {}
      : { skip: ctx.skip, take: ctx.limit }),
  });

const getDbPriceSortedItems = async (
  filters: PropertyFilters,
  order: string,
  skip: number,
  limit: number,
) => {
  const { ids, total } = await getPriceSortedPropertyPage(
    filters,
    order,
    skip,
    limit,
  );
  const items = await fetchPropertiesByIds(ids);
  return {
    items: await processPropertyItems(sortByIds(items, ids), null, null, false),
    total,
  };
};

const fetchPropertiesByIds = (ids: string[]) =>
  prisma.property.findMany({
    where: { id: { in: ids }, deleted_at: null },
    include: includeListRelations,
  });

const sortByIds = (items: PropertyItem[], ids: string[]) => {
  const order = new Map(ids.map((id, index) => [id, index]));
  return [...items].sort(
    (a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0),
  );
};

const processPropertyItems = async (
  items: PropertyItem[],
  checkIn: Date | null,
  checkOut: Date | null,
  useMemFilter: boolean,
) => {
  const formattedItems: ProcessedPropertyItem[] = [];
  for (const item of items) {
    const roomData = await evaluateRooms(item.rooms, checkIn, checkOut);
    if (useMemFilter && !roomData.hasAvailable) continue;
    formattedItems.push(
      buildPropertyPayload(item, checkIn, checkOut, roomData),
    );
  }
  return formattedItems;
};

const evaluateRooms = async (
  rooms: Room[],
  checkIn: Date | null,
  checkOut: Date | null,
): Promise<RoomEvaluationResult> => {
  const data: RoomEvaluationResult = {
    hasAvailable: false,
    minPrice: Infinity,
    roomsWithStatus: [],
  };
  for (const room of rooms) await evaluateRoom(room, checkIn, checkOut, data);
  return data;
};

const evaluateRoom = async (
  room: Room,
  checkIn: Date | null,
  checkOut: Date | null,
  data: RoomEvaluationResult,
) => {
  if (!checkIn || !checkOut) return data.roomsWithStatus.push(room);
  try {
    const avail = await checkAvailability(room.id, checkIn, checkOut);
    if (!avail.available) return;
    const priceDetails = await calculateStayDetails(room.id, checkIn, checkOut);
    data.hasAvailable = true;
    data.minPrice = Math.min(data.minPrice, priceDetails.totalPrice);
    data.roomsWithStatus.push({ ...room, is_available: true, priceDetails });
  } catch {
    /* ignore unavailable room */
  }
};

const ratingSummary = (reviews?: RatingReview[]) => {
  const ratings = reviews?.map((review) => review.rating) || [];
  if (!ratings.length) return { rating: undefined, review_count: 0 };
  const avg = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  return { rating: Math.round(avg * 10) / 10, review_count: ratings.length };
};

const minPropertyPrice = (
  item: PropertyItem,
  checkIn: Date | null,
  checkOut: Date | null,
  minPrice: number,
) => {
  const prices =
    checkIn && checkOut
      ? [minPrice]
      : item.rooms.map((room) => room.base_price);
  return prices.length ? Math.min(...prices) : 0;
};

const buildPropertyPayload = (
  item: PropertyItem,
  checkIn: Date | null,
  checkOut: Date | null,
  roomData: RoomEvaluationResult,
) => ({
  ...item,
  min_price: minPropertyPrice(item, checkIn, checkOut, roomData.minPrice),
  ...ratingSummary(item.reviews),
  order_count: item._count?.orders ?? 0,
  rooms: roomData.roomsWithStatus,
  reviews: undefined,
  _count: undefined,
});

const applyMemorySort = (
  items: ProcessedPropertyItem[],
  sort: string,
  order: string,
) => {
  if (sort === "price")
    items.sort((a, b) =>
      order === "asc" ? a.min_price - b.min_price : b.min_price - a.min_price,
    );
  if (sort === "rating")
    items.sort((a, b) =>
      order === "asc"
        ? (a.rating || 0) - (b.rating || 0)
        : (b.rating || 0) - (a.rating || 0),
    );
  if (sort === "popularity")
    items.sort((a, b) =>
      order === "asc"
        ? a.order_count - b.order_count
        : b.order_count - a.order_count,
    );
};

const getFinalSortedItems = async (
  formattedItems: ProcessedPropertyItem[],
  ctx: PropertyListContext,
) => {
  applyMemorySort(formattedItems, ctx.sort, ctx.order);
  if (
    ctx.useMemFilter ||
    ["price", "rating", "popularity"].includes(ctx.sort)
  ) {
    return {
      finalItems: formattedItems.slice(ctx.skip, ctx.skip + ctx.limit),
      total: formattedItems.length,
    };
  }
  return {
    finalItems: formattedItems,
    total: await prisma.property.count({ where: ctx.where }),
  };
};

export const getCategories = async () =>
  prisma.propertyCategory.findMany({ orderBy: { name: "asc" } });
