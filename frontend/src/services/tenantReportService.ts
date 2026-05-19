import { api } from './api';
import type { ApiResponse } from '@/types';
import type { Order } from '@/types';

export interface DashboardAnalytics {
  totalRevenue: number;
  totalOrders: number;
  ordersByStatus: { name: string; count: number }[];
  recentOrders: Order[];
}

export const tenantReportService = {
  async getDashboardAnalytics(): Promise<DashboardAnalytics> {
    const res = await api.get<ApiResponse<DashboardAnalytics>>('/tenant/reports');
    return res.data.data;
  }
};
