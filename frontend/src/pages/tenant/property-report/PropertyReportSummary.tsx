import type { FC } from "react";
import { Building2, BedDouble, BookOpen } from "lucide-react";
import type { OccupancyProperty } from "@/services/tenantReportService";
import { getTotals } from "@/hooks/tenant/property-report/propertyReportUtils";

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
