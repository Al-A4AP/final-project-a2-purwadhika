import { api } from "./api";
import { buildUrl } from "./api/queryParams";
import type { ApiResponse } from "@/types";
import type { DashboardAnalytics, DashboardAnalyticsParams, OccupancyProperty } from "./tenantReport/types";

export type { DashboardAnalytics, DashboardAnalyticsParams, OccupancyProperty, OccupancyRoom } from "./tenantReport/types";

export const tenantReportService = {
  async getDashboardAnalytics(params?: DashboardAnalyticsParams): Promise<DashboardAnalytics> {
    const res = await api.get<ApiResponse<DashboardAnalytics>>(buildUrl("/tenant/reports", params));
    return res.data.data;
  },

  async getOccupancyCalendar(): Promise<OccupancyProperty[]> {
    const res = await api.get<ApiResponse<OccupancyProperty[]>>("/tenant/reports/occupancy");
    return res.data.data;
  },
};
