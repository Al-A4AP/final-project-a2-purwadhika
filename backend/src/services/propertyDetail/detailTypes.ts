import type { RentalType } from "@prisma/client";

export type RatingReview = { rating: number };

export type RoomRecord = {
  id: string;
  quantity: number;
  base_price?: number;
  [key: string]: unknown;
};

export type RoomCalendarAvailability = {
  date: Date;
  id: string;
  is_available: boolean;
  roomId: string;
  source?: string;
};

export type RoomCalendarOrder = {
  check_in_date: Date;
  check_out_date: Date;
  id: string;
  roomId: string;
};

export type RoomRelation = {
  availability?: RoomCalendarAvailability[];
  images?: unknown[];
  orders?: RoomCalendarOrder[];
  peakRates?: unknown[];
};

export interface PropertyDetailFilters {
  check_in_date?: string;
  check_out_date?: string;
}

export interface PropertyRecord {
  id: string;
  rental_type: RentalType;
  _count?: { orders: number };
  images?: unknown[];
  reviews?: RatingReview[];
  rooms?: RoomRecord[];
  [key: string]: unknown;
}

export interface RoomCalendarRange {
  end: Date;
  start: Date;
}

export interface AvailabilityReason {
  reason?: string;
  source?: string;
}
