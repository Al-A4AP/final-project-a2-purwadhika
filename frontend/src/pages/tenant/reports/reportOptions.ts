import { REVENUE_PERIOD_OPTIONS } from "../tenant-dashboard/dashboardRevenuePeriod";

export const REPORT_SORT_OPTIONS = [
  { value: "created_at-desc", label: "Tanggal: Terbaru" },
  { value: "created_at-asc", label: "Tanggal: Terlama" },
  { value: "total_price-desc", label: "Nilai: Terbesar" },
  { value: "total_price-asc", label: "Nilai: Terkecil" },
];

export const REPORT_REVENUE_PERIOD_OPTIONS = REVENUE_PERIOD_OPTIONS.map(({ label, value }) => ({ label, value }));
