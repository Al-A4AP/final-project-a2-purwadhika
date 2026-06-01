import type { DashboardRevenuePeriod, Order, PaginationMeta } from "@/types";

export interface DashboardAnalytics {
  totalRevenue: number;
  totalOrders: number;
  ordersByStatus: { name: string; count: number }[];
  recentOrders: Order[];
  pagination: PaginationMeta;
}

export interface OccupancyRoom {
  id: string;
  room_type: string;
  orders: OccupancyOrder[];
}

export interface OccupancyProperty {
  id: string;
  name: string;
  rooms: OccupancyRoom[];
}

export interface DashboardAnalyticsParams {
  startDate?: string;
  endDate?: string;
  propertyId?: string;
  revenuePeriod?: DashboardRevenuePeriod;
  status?: string;
  userName?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

interface OccupancyOrder {
  id: string;
  order_number: string;
  check_in_date: string;
  check_out_date: string;
  user: { name: string };
}
