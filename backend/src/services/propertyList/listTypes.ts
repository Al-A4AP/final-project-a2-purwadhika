import type { Prisma } from "@prisma/client";

export type RatingReview = { rating: number };

export type Room = {
  base_price: number;
  capacity: number;
  id: string;
  [key: string]: unknown;
};

export type RoomWithStatus = Room & {
  is_available?: boolean;
  priceDetails?: unknown;
};

export interface RoomEvaluationResult {
  hasAvailable: boolean;
  minPrice: number;
  roomsWithStatus: RoomWithStatus[];
}

export interface PropertyItem {
  _count?: { orders: number };
  id: string;
  reviews?: RatingReview[];
  rooms: Room[];
  [key: string]: unknown;
}

export interface ProcessedPropertyItem extends PropertyItem {
  min_price: number;
  order_count: number;
  rating?: number;
  review_count: number;
  rooms: RoomWithStatus[];
}

export interface PropertyListContext {
  checkIn: Date | null;
  checkOut: Date | null;
  limit: number;
  order: string;
  orderBy: Prisma.PropertyOrderByWithRelationInput;
  page: number;
  skip: number;
  sort: string;
  useMemFilter: boolean;
  useMemSort: boolean;
  where: Prisma.PropertyWhereInput;
}
