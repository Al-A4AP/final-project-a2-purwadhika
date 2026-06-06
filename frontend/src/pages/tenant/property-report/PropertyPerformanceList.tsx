import { useMemo, useState, type FC, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "@/components/common/EmptyState";
import { Pagination } from "@/components/common/Pagination";
import type { OccupancyProperty } from "@/services/tenantReportService";
import { getRoomBookings } from "@/hooks/tenant/property-report/propertyReportUtils";
import { BedDouble, CalendarDays, Building2 } from "lucide-react";

const PROPERTY_PAGE_SIZE = 8;

interface PropertyPerformanceListProps {
  data: OccupancyProperty[];
}

export const PropertyPerformanceList: FC<PropertyPerformanceListProps> = ({ data }) => {
  const page = usePerformancePage(data);
  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <PerformanceHeader />
      <PerformanceBody data={data} page={page} />
      {page.totalPages > 1 && <PerformancePagination page={page} totalItems={data.length} />}
    </div>
  );
};

const PerformanceHeader: FC = () => (
  <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Performa Per Properti</h2>
    <Link to="/tenant/occupancy" className="text-sm font-semibold text-slate-500 transition hover:text-slate-900 dark:hover:text-white">
      Lihat Ketersediaan Kamar &gt;
    </Link>
  </div>
);

const PerformanceBody: FC<{ data: OccupancyProperty[]; page: PerformancePage }> = ({ data, page }) => (
  <div className="divide-y divide-slate-50 dark:divide-slate-800">
    {data.length ? <PropertyRows properties={page.items} /> : <EmptyPerformance />}
  </div>
);

const PropertyRows: FC<{ properties: OccupancyProperty[] }> = ({ properties }) => (
  properties.map((property) => <PropertyRow key={property.id} property={property} />)
);

const EmptyPerformance: FC = () => (
  <div className="p-10">
    <EmptyState
      title="Belum ada data properti"
      description="Tambahkan properti dan kamar untuk melihat ringkasan performa di sini."
      action={<ManagePropertiesLink />}
    />
  </div>
);

const ManagePropertiesLink: FC = () => (
  <Link to="/tenant/properties" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900">
    <Building2 size={16} /> Kelola Properti
  </Link>
);

const PropertyRow: FC<{ property: OccupancyProperty }> = ({ property }) => {
  const totalRooms = property.rooms.length;
  const totalBookings = getRoomBookings(property);
  return (
    <div className="group flex flex-col gap-4 p-5 transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40 sm:flex-row sm:items-center sm:justify-between">
      <PropertyIdentity property={property} totalRooms={totalRooms} />
      <PropertyStats totalBookings={totalBookings} totalRooms={totalRooms} />
    </div>
  );
};

const PropertyIdentity: FC<{ property: OccupancyProperty; totalRooms: number }> = ({ property, totalRooms }) => (
  <div className="flex min-w-0 items-center gap-4">
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
      <Building2 size={20} />
    </div>
    <div className="min-w-0">
      <p className="truncate font-bold text-slate-900 dark:text-white">{property.name}</p>
      <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{totalRooms} tipe kamar</p>
    </div>
  </div>
);

const PropertyStats: FC<{ totalBookings: number; totalRooms: number }> = ({ totalBookings, totalRooms }) => (
  <div className="flex shrink-0 gap-5">
    <Stat icon={<BedDouble size={15} />} label="Kamar" value={String(totalRooms)} />
    <Stat icon={<CalendarDays size={15} />} label="Reservasi" value={String(totalBookings)} />
  </div>
);

const PerformancePagination: FC<{ page: PerformancePage; totalItems: number }> = ({ page, totalItems }) => (
  <div className="px-6 pb-6">
    <Pagination currentPage={page.currentPage} totalPages={page.totalPages} totalItems={totalItems} onPageChange={page.setPage} />
  </div>
);

const usePerformancePage = (data: OccupancyProperty[]) => {
  const [currentPage, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(data.length / PROPERTY_PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const items = useMemo(() => getPageItems(data, safePage), [data, safePage]);
  return { currentPage: safePage, items, setPage, totalPages };
};

const getPageItems = (data: OccupancyProperty[], page: number) => {
  const start = (page - 1) * PROPERTY_PAGE_SIZE;
  return data.slice(start, start + PROPERTY_PAGE_SIZE);
};

const Stat: FC<{ icon: ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex flex-col items-center gap-0.5">
    <div className="flex items-center gap-1 text-slate-400">{icon}<span className="text-[10px] font-semibold uppercase tracking-wider">{label}</span></div>
    <span className="text-xl font-bold text-slate-900 dark:text-white">{value}</span>
  </div>
);

type PerformancePage = ReturnType<typeof usePerformancePage>;
