import type { FC } from "react";
import type { DashboardStats } from "@/types";
import { formatCurrency } from "@/lib/formatters";
import { BedDouble, Building2, Clock, Wallet, type LucideIcon } from "lucide-react";

interface TenantKpiGridProps {
  stats: DashboardStats | null;
}

export const TenantKpiGrid: FC<TenantKpiGridProps> = ({ stats }) => {
  if (!stats) return null;
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">{getKpis(stats).map((kpi) => <KpiCard key={kpi.label} {...kpi} />)}</div>;
};

const KpiCard: FC<KpiItem> = ({ icon: Icon, iconClass, label, value }) => (
  <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div className="flex items-center gap-4">
      <div className={`flex h-12 w-12 items-center justify-center rounded-full ${iconClass}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      </div>
    </div>
  </div>
);

const getKpis = (stats: DashboardStats): KpiItem[] => [
  { label: "Total Pendapatan", value: formatCurrency(stats.revenue), icon: Wallet, iconClass: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
  { label: "Menunggu Konfirmasi", value: stats.pendingOrders, icon: Clock, iconClass: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
  { label: "Properti Aktif", value: stats.propertyCount, icon: Building2, iconClass: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
  { label: "Total Kamar", value: stats.roomCount, icon: BedDouble, iconClass: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" },
];

interface KpiItem {
  icon: LucideIcon;
  iconClass: string;
  label: string;
  value: number | string;
}
