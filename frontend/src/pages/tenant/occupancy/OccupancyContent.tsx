import type { FC } from "react";
import { ErrorState } from "@/components/common/ErrorState";
import { SectionLoading } from "@/components/common/SectionLoading";
import { OccupancyCalendar } from "@/components/tenant/OccupancyCalendar";
import type { OccupancyPageState } from "../../../hooks/tenant/occupancy/useOccupancyPageState";
import { Building2, CalendarDays } from "lucide-react";

export const OccupancyContent: FC<{ state: OccupancyPageState }> = ({ state }) => (
  <div className="min-h-screen bg-slate-50 px-4 py-8 md:p-10 dark:bg-slate-900 pb-24">
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Ketersediaan Kamar
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Pantau tanggal kamar yang sudah terisi dan kosong dalam tampilan kalender.
          </p>
        </div>
      </div>

      <AvailabilitySummary state={state} />

      {renderContent(state)}
    </div>
  </div>
);

const AvailabilitySummary: FC<{ state: OccupancyPageState }> = ({ state }) => {
  if (state.loading || state.error) return null;

  const totalProperties = state.data.length;
  const totalRooms = state.data.reduce((acc, prop) => acc + prop.rooms.length, 0);
  const totalBookings = state.data.reduce((acc, prop) => 
    acc + prop.rooms.reduce((roomAcc, room) => roomAcc + room.orders.length, 0)
  , 0);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <Building2 size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Properti</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalProperties}</p>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
            <CalendarDays size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Tipe Kamar</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalRooms}</p>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
            <CalendarDays size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Reservasi Terjadwal</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalBookings}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const renderContent = (state: OccupancyPageState) => {
  if (state.loading) return <SectionLoading label="Memuat Kalender Ketersediaan..." size="lg" variant="report" />;
  if (state.error) return <ErrorState title="Kalender belum bisa dimuat" message={state.error} onRetry={state.refetch} />;
  
  if (state.data.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <CalendarDays size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Tidak ada data properti</h3>
        <p className="mt-2 text-slate-500 dark:text-slate-400">Tambahkan properti dan kamar terlebih dahulu.</p>
      </div>
    );
  }

  return <OccupancyCalendar data={state.data} />;
};
