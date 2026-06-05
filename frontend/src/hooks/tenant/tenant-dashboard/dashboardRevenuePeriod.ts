import type { DashboardRevenuePeriod } from "@/types";

export const DEFAULT_REVENUE_PERIOD: DashboardRevenuePeriod = "monthly";

export const REVENUE_PERIOD_OPTIONS: Array<{ label: string; statLabel: string; value: DashboardRevenuePeriod }> = [
  { value: "weekly", label: "Mingguan", statLabel: "Pendapatan Minggu Ini" },
  { value: "monthly", label: "Bulanan", statLabel: "Pendapatan Bulan Ini" },
  { value: "quarterly", label: "Per 3 Bulan", statLabel: "Pendapatan 3 Bulan Ini" },
  { value: "six_months", label: "Per 6 Bulan", statLabel: "Pendapatan 6 Bulan Ini" },
  { value: "yearly", label: "Tahunan", statLabel: "Pendapatan Tahun Ini" },
];

export const getRevenueStatLabel = (period: DashboardRevenuePeriod) =>
  REVENUE_PERIOD_OPTIONS.find((item) => item.value === period)?.statLabel || "Pendapatan";
