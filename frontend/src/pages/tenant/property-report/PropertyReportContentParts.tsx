import type { FC, ReactNode } from "react";
import { BarChart2, CalendarDays, Building2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { OccupancyCalendar } from "@/components/tenant/OccupancyCalendar";
import { PropertyReportSummary } from "./PropertyReportSummary";
import { PropertyPerformanceList } from "./PropertyPerformanceList";
import type { OccupancyProperty } from "@/services/tenantReportService";

interface ReportTabsProps {
  activeTab: "report" | "calendar";
  onChange: (tab: "report" | "calendar") => void;
}

export const PropertyReportHeader: FC = () => (
  <div>
    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Laporan & Ketersediaan</h1>
    <p className="mt-2 text-slate-600 dark:text-slate-400">Pantau performa penjualan dan kalender ketersediaan properti.</p>
  </div>
);

export const ReportTabs: FC<ReportTabsProps> = ({ activeTab, onChange }) => (
  <div className="flex space-x-2 overflow-x-auto border-b border-slate-200 pb-px dark:border-slate-800">
    <ReportTabButton active={activeTab === "report"} icon={<BarChart2 size={18} />} label="Ringkasan Performa" onClick={() => onChange("report")} />
    <ReportTabButton active={activeTab === "calendar"} icon={<CalendarDays size={18} />} label="Kalender Ketersediaan" onClick={() => onChange("calendar")} />
  </div>
);

export const ReportPanel: FC<{ data: OccupancyProperty[] }> = ({ data }) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
    <PropertyReportSummary data={data} />
    <PropertyPerformanceList data={data} />
  </div>
);

export const CalendarPanel: FC<{ data: OccupancyProperty[] }> = ({ data }) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
    <AvailabilitySummary data={data} />
    {data.length === 0 ? <EmptyCalendarData /> : <OccupancyCalendar data={data} />}
  </div>
);

const AvailabilitySummary: FC<{ data: OccupancyProperty[] }> = ({ data }) => {
  const stats = getAvailabilityStats(data);
  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <SummaryStatCard icon={Building2} label="Total Properti" value={stats.totalProperties} color="blue" />
      <SummaryStatCard icon={CalendarDays} label="Total Tipe Kamar" value={stats.totalRooms} color="emerald" />
      <SummaryStatCard icon={CalendarDays} label="Total Reservasi Terjadwal" value={stats.totalBookings} color="orange" />
    </div>
  );
};

const ReportTabButton: FC<{
  active: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}> = ({ active, icon, label, onClick }) => (
  <button onClick={onClick} className={`flex whitespace-nowrap items-center gap-2 px-4 py-2 font-medium transition-colors ${active ? "border-b-2 border-slate-900 text-slate-900 dark:border-white dark:text-white" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"}`}>
    {icon}
    {label}
  </button>
);

const SummaryStatCard: FC<{
  icon: LucideIcon;
  label: string;
  value: number;
  color: "blue" | "emerald" | "orange";
}> = ({ icon: Icon, label, value, color }) => (
  <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div className="flex items-center gap-4">
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${getStatColor(color)}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{label}</p>
        <p className="mt-0.5 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{value}</p>
      </div>
    </div>
  </div>
);

const EmptyCalendarData: FC = () => (
  <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <CalendarDays size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" />
    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Tidak ada data properti</h3>
    <p className="mt-2 text-slate-500 dark:text-slate-400">Tambahkan properti dan kamar terlebih dahulu.</p>
  </div>
);

const getAvailabilityStats = (data: OccupancyProperty[]) => ({
  totalProperties: data.length,
  totalRooms: data.reduce((acc, prop) => acc + prop.rooms.length, 0),
  totalBookings: data.reduce((acc, prop) => acc + countPropertyBookings(prop), 0),
});

const countPropertyBookings = (property: OccupancyProperty) =>
  property.rooms.reduce((acc, room) => acc + room.orders.length, 0);

const getStatColor = (color: "blue" | "emerald" | "orange") => {
  if (color === "blue") return "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";
  if (color === "emerald") return "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400";
  return "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400";
};
