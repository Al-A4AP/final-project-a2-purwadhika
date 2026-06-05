import type { FC } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, BarChart3, Building2, BedDouble, BookOpen } from "lucide-react";
import type { OccupancyProperty } from "@/services/tenantReportService";
import { getTotals } from "./propertyReportUtils";

interface PropertyReportSummaryProps {
  data: OccupancyProperty[];
}

export const PropertyReportSummary: FC<PropertyReportSummaryProps> = ({ data }) => {
  const { totalProperties, totalRooms, totalBookings } = getTotals(data);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <SummaryCard icon={<Building2 size={22} />} colorClass="text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30" label="Total Properti" value={String(totalProperties)} />
      <SummaryCard icon={<BedDouble size={22} />} colorClass="text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/30" label="Total Tipe Kamar" value={String(totalRooms)} />
      <SummaryCard icon={<BookOpen size={22} />} colorClass="text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/30" label="Reservasi Terjadwal" value={String(totalBookings)} />
    </div>
  );
};

const SummaryCard: FC<{ icon: React.ReactNode; colorClass: string; label: string; value: string }> = ({ icon, colorClass, label, value }) => (
  <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div className="flex items-center gap-4">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colorClass}`}>{icon}</div>
      <div>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
        <p className="mt-0.5 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{value}</p>
      </div>
    </div>
  </div>
);

export const PropertyReportShortcuts: FC = () => (
  <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <h2 className="mb-5 text-lg font-bold text-slate-900 dark:text-white">Navigasi Cepat</h2>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      <ShortcutLink to="/tenant/occupancy" icon={<CalendarDays size={18} />} label="Ketersediaan" />
      <ShortcutLink to="/tenant/rooms" icon={<BedDouble size={18} />} label="Kamar" />
      <ShortcutLink to="/tenant/properties" icon={<Building2 size={18} />} label="Properti" />
      <ShortcutLink to="/tenant/peak-season" icon={<BookOpen size={18} />} label="Harga Khusus" />
      <ShortcutLink to="/tenant/reports" icon={<BarChart3 size={18} />} label="Laporan Penjualan" />
    </div>
  </div>
);

const ShortcutLink: FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => (
  <Link to={to} className="flex flex-col items-center gap-2 rounded-xl border border-slate-100 p-4 text-center text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:bg-slate-900 hover:text-white dark:border-slate-800 dark:text-slate-300 dark:hover:border-white dark:hover:bg-white dark:hover:text-slate-900">
    {icon}
    {label}
  </Link>
);
