interface DashboardAnalyticsData {
  ordersByStatus: Array<{ count: number; name: string }>;
  recentOrders: unknown[];
  totalOrders: number;
  totalRevenue: number;
}

export const emptyDashboardAnalytics = () => ({
  ordersByStatus: [],
  recentOrders: [],
  totalOrders: 0,
  totalRevenue: 0,
});

export const buildPagination = (page: number, limit: number, total: number) => ({
  limit,
  page,
  total,
  totalPages: Math.ceil(total / limit),
});

export const buildDashboardAnalyticsResponse = (data: DashboardAnalyticsData, page: number, limit: number) => ({
  ordersByStatus: data.ordersByStatus,
  recentOrders: data.recentOrders,
  totalOrders: data.totalOrders,
  totalRevenue: data.totalRevenue,
  pagination: buildPagination(page, limit, data.totalOrders),
});
