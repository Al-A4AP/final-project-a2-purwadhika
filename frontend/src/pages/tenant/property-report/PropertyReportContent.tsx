import { useState } from "react";
import type { FC } from "react";
import { BarChart2, CalendarDays, Building2 } from "lucide-react";
import { SectionLoading } from "@/components/common/SectionLoading";
import { ErrorState } from "@/components/common/ErrorState";
import { OccupancyCalendar } from "@/components/tenant/OccupancyCalendar";
import { PropertyReportSummary } from "./PropertyReportSummary";
import { PropertyPerformanceList } from "./PropertyPerformanceList";
import type { PropertyReportState } from "@/hooks/tenant/property-report/usePropertyReportState";
import type { OccupancyProperty } from "@/services/tenantReportService";

export const PropertyReportContent: FC<{ state: PropertyReportState }> = ({
  state,
}) => (
  <div className="min-h-screen bg-slate-50 px-4 py-8 md:p-10 dark:bg-slate-900 pb-24">
    <div className="mx-auto max-w-7xl space-y-8">
      <PropertyReportHeader />
      <ReportBody state={state} />
    </div>
  </div>
);

const PropertyReportHeader: FC = () => (
  <div>
    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
      Laporan & Ketersediaan
    </h1>
    <p className="mt-2 text-slate-600 dark:text-slate-400">
      Pantau performa penjualan dan kalender ketersediaan properti.
    </p>
  </div>
);

const AvailabilitySummary: FC<{ data: OccupancyProperty[] }> = ({ data }) => {
  const totalProperties = data.length;
  const totalRooms = data.reduce((acc, prop) => acc + prop.rooms.length, 0);
  const totalBookings = data.reduce(
    (acc, prop) =>
      acc +
      prop.rooms.reduce((roomAcc, room) => roomAcc + room.orders.length, 0),
    0,
  );

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <Building2 size={22} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
              Total Properti
            </p>
            <p className="mt-0.5 text-3xl tracking-tight font-bold text-slate-900 dark:text-white">
              {totalProperties}
            </p>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
            <CalendarDays size={22} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
              Total Tipe Kamar
            </p>
            <p className="mt-0.5 text-3xl tracking-tight font-bold text-slate-900 dark:text-white">
              {totalRooms}
            </p>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
            <CalendarDays size={22} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
              Total Reservasi Terjadwal
            </p>
            <p className="mt-0.5 text-3xl tracking-tight font-bold text-slate-900 dark:text-white">
              {totalBookings}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReportBody: FC<{ state: PropertyReportState }> = ({ state }) => {
  const [activeTab, setActiveTab] = useState<"report" | "calendar">("report");
  if (state.loading)
    return <SectionLoading label="Memuat data..." size="lg" variant="report" />;
  if (state.error)
    return (
      <ErrorState
        title="Data belum bisa dimuat"
        message={state.error}
        onRetry={state.refetch}
      />
    );

  return (
    <div className="space-y-6">
      <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-800 pb-px overflow-x-auto">
        <button
          onClick={() => setActiveTab("report")}
          className={`flex whitespace-nowrap items-center gap-2 px-4 py-2 font-medium transition-colors ${
            activeTab === "report"
              ? "border-b-2 border-slate-900 text-slate-900 dark:border-white dark:text-white"
              : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
          }`}
        >
          <BarChart2 size={18} />
          Ringkasan Performa
        </button>
        <button
          onClick={() => setActiveTab("calendar")}
          className={`flex whitespace-nowrap items-center gap-2 px-4 py-2 font-medium transition-colors ${
            activeTab === "calendar"
              ? "border-b-2 border-slate-900 text-slate-900 dark:border-white dark:text-white"
              : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
          }`}
        >
          <CalendarDays size={18} />
          Kalender Ketersediaan
        </button>
      </div>

      {activeTab === "report" ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <PropertyReportSummary data={state.data} />
          <PropertyPerformanceList data={state.data} />
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <AvailabilitySummary data={state.data} />
          {state.data.length === 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <CalendarDays
                size={48}
                className="mx-auto mb-4 text-slate-300 dark:text-slate-600"
              />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Tidak ada data properti
              </h3>
              <p className="mt-2 text-slate-500 dark:text-slate-400">
                Tambahkan properti dan kamar terlebih dahulu.
              </p>
            </div>
          ) : (
            <OccupancyCalendar data={state.data} />
          )}
        </div>
      )}
    </div>
  );
};
