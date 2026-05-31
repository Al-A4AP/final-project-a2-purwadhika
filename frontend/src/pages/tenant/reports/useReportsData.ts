import { useCallback, useEffect, useState } from "react";
import { getApiErrorMessage } from "@/lib/errorMessage";
import { tenantReportService, type DashboardAnalytics, type OccupancyProperty } from "@/services/tenantReportService";
import { tenantService } from "@/services/tenantService";
import type { TenantProperty } from "@/types";
import type { ReportsFilters } from "./reportsTypes";

export const useReportsData = (filters: ReportsFilters) => {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [properties, setProperties] = useState<TenantProperty[]>([]);
  const [occupancyData, setOccupancyData] = useState<OccupancyProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchAnalytics = useFetchAnalytics(filters, setAnalytics, setLoading, setError);
  useStaticReportData(setProperties, setOccupancyData);
  useEffect(() => { Promise.resolve().then(() => fetchAnalytics()); }, [fetchAnalytics]);
  return { analytics, error, loading, occupancyData, properties, refetchReports: fetchAnalytics };
};

const useStaticReportData = (
  setProperties: (properties: TenantProperty[]) => void,
  setOccupancyData: (data: OccupancyProperty[]) => void,
) => {
  useEffect(() => {
    tenantService.getProperties({ limit: 100 }).then((data) => setProperties(data.properties)).catch(() => {});
    tenantReportService.getOccupancyCalendar().then(setOccupancyData).catch(() => {});
  }, [setOccupancyData, setProperties]);
};

const useFetchAnalytics = (
  filters: ReportsFilters,
  setAnalytics: (analytics: DashboardAnalytics | null) => void,
  setLoading: (loading: boolean) => void,
  setError: (error: string | null) => void,
) => useCallback(() => {
  setLoading(true);
  setError(null);
  tenantReportService.getDashboardAnalytics(buildAnalyticsParams(filters))
    .then((data) => { setAnalytics(data); setError(null); })
    .catch((err) => { setAnalytics(null); setError(getApiErrorMessage(err, "Laporan belum bisa dimuat. Periksa koneksi lalu coba lagi.")); })
    .finally(() => setLoading(false));
}, [filters, setAnalytics, setError, setLoading]);

const buildAnalyticsParams = (filters: ReportsFilters) => ({
  propertyId: filters.selectedPropertyId || undefined,
  status: filters.selectedStatus || undefined,
  userName: filters.userName || undefined,
  startDate: filters.startDate || undefined,
  endDate: filters.endDate || undefined,
  sortBy: filters.sortBy,
  sortOrder: filters.sortOrder,
  page: filters.reportPage,
  limit: 10,
});
