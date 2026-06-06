import type { DashboardAnalytics } from "@/services/tenantReportService";
import type { DashboardRevenuePeriod, TenantProperty } from "@/types";

export interface ReportsFilters {
  endDate: string;
  reportPage: number;
  revenuePeriod: DashboardRevenuePeriod;
  selectedPropertyId: string;
  selectedStatus: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  startDate: string;
  userName: string;
}

export interface ReportsFilterActions {
  resetFilters: () => void;
  setEndDate: (value: string) => void;
  setReportPage: (page: number) => void;
  setRevenuePeriod: (value: DashboardRevenuePeriod) => void;
  setSelectedPropertyId: (value: string) => void;
  setSelectedStatus: (value: string) => void;
  setSortBy: (value: string) => void;
  setSortOrder: (value: "asc" | "desc") => void;
  setStartDate: (value: string) => void;
  setUserName: (value: string) => void;
}

export interface ReportsPageState {
  actions: ReportsFilterActions;
  analytics: DashboardAnalytics | null;
  error: string | null;
  filters: ReportsFilters;
  loading: boolean;
  properties: TenantProperty[];
  refetchReports: () => void;
}
