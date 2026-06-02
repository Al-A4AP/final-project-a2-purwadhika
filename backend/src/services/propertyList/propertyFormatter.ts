import type {
  ProcessedPropertyItem,
  PropertyItem,
  RatingReview,
  RoomEvaluationResult,
} from "./listTypes";
import { evaluateRooms } from "./roomEvaluation";

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
  const prices = checkIn && checkOut ? [minPrice] : item.rooms.map((room) => room.base_price);
  return prices.length ? Math.min(...prices) : 0;
};

const buildPropertyPayload = (
  item: PropertyItem,
  checkIn: Date | null,
  checkOut: Date | null,
  roomData: RoomEvaluationResult,
): ProcessedPropertyItem => ({
  ...item,
  min_price: minPropertyPrice(item, checkIn, checkOut, roomData.minPrice),
  ...ratingSummary(item.reviews),
  order_count: item._count?.orders ?? 0,
  rooms: roomData.roomsWithStatus,
  reviews: undefined,
  _count: undefined,
});

const shouldSkipUnavailable = (
  useMemFilter: boolean,
  roomData: RoomEvaluationResult,
) => useMemFilter && !roomData.hasAvailable;

export const processPropertyItems = async (
  items: PropertyItem[],
  checkIn: Date | null,
  checkOut: Date | null,
  useMemFilter: boolean,
) => {
  const formattedItems: ProcessedPropertyItem[] = [];
  for (const item of items) await appendProcessedItem(item, checkIn, checkOut, useMemFilter, formattedItems);
  return formattedItems;
};

const appendProcessedItem = async (
  item: PropertyItem,
  checkIn: Date | null,
  checkOut: Date | null,
  useMemFilter: boolean,
  formattedItems: ProcessedPropertyItem[],
) => {
  const roomData = await evaluateRooms(item.rooms, checkIn, checkOut);
  if (!shouldSkipUnavailable(useMemFilter, roomData)) {
    formattedItems.push(buildPropertyPayload(item, checkIn, checkOut, roomData));
  }
};
