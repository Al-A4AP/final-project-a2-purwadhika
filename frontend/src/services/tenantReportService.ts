import { api } from './api';
import type { ApiResponse, PaginationMeta } from '@/types';
import type { Order } from '@/types';

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
  orders: {
    id: string;
    order_number: string;
    check_in_date: string;
    check_out_date: string;
    user: { name: string };
  }[];
}

export interface OccupancyProperty {
  id: string;
  name: string;
  rooms: OccupancyRoom[];
}

export const tenantReportService = {
  async getDashboardAnalytics(params?: {
    startDate?: string;
    endDate?: string;
    propertyId?: string;
    status?: string;
    userName?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }): Promise<DashboardAnalytics> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined) query.append(key, String(val));
      });
    }
    const res = await api.get<ApiResponse<DashboardAnalytics>>(`/tenant/reports?${query.toString()}`);
    return res.data.data;
  },

  async getOccupancyCalendar(): Promise<OccupancyProperty[]> {
    const res = await api.get<ApiResponse<OccupancyProperty[]>>('/tenant/reports/occupancy');
    return res.data.data;
  }
};
