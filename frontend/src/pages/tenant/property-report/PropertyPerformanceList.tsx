import type { FC } from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "@/components/common/EmptyState";
import type { OccupancyProperty } from "@/services/tenantReportService";
import { getRoomBookings } from "./propertyReportUtils";
import { BedDouble, CalendarDays, Building2 } from "lucide-react";

interface PropertyPerformanceListProps {
  data: OccupancyProperty[];
}

export const PropertyPerformanceList: FC<PropertyPerformanceListProps> = ({ data }) => (
  <div className="rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">Performa Per Properti</h2>
      <Link to="/tenant/occupancy" className="text-sm font-semibold text-slate-500 transition hover:text-slate-900 dark:hover:text-white">
        Lihat Ketersediaan Kamar &gt;
      </Link>
    </div>
    <div className="divide-y divide-slate-50 dark:divide-slate-800">
      {data.length === 0 ? (
        <div className="p-10">
          <EmptyState
            title="Belum ada data properti"
            description="Tambahkan properti dan kamar untuk melihat ringkasan performa di sini."
            action={
              <Link to="/tenant/properties" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900">
                <Building2 size={16} /> Kelola Properti
              </Link>
            }
          />
        </div>
      ) : (
        data.map((property) => <PropertyRow key={property.id} property={property} />)
      )}
    </div>
  </div>
);

const PropertyRow: FC<{ property: OccupancyProperty }> = ({ property }) => {
  const totalRooms = property.rooms.length;
  const totalBookings = getRoomBookings(property);

  return (
    <div className="group flex flex-col gap-4 p-5 transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
          <Building2 size={20} />
        </div>
        <div className="min-w-0">
          <p className="truncate font-bold text-slate-900 dark:text-white">{property.name}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{totalRooms} tipe kamar</p>
        </div>
      </div>
      <div className="flex shrink-0 gap-5">
        <Stat icon={<BedDouble size={15} />} label="Kamar" value={String(totalRooms)} />
        <Stat icon={<CalendarDays size={15} />} label="Reservasi" value={String(totalBookings)} />
      </div>
    </div>
  );
};

const Stat: FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex flex-col items-center gap-0.5">
    <div className="flex items-center gap-1 text-slate-400">{icon}<span className="text-[10px] font-semibold uppercase tracking-wider">{label}</span></div>
    <span className="text-xl font-bold text-slate-900 dark:text-white">{value}</span>
  </div>
);
