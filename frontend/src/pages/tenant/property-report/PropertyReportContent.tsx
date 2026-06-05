import type { FC } from "react";
import { Link } from "react-router-dom";
import { BarChart3, CalendarDays } from "lucide-react";
import { SectionLoading } from "@/components/common/SectionLoading";
import { ErrorState } from "@/components/common/ErrorState";
import { PropertyReportSummary, PropertyReportShortcuts } from "./PropertyReportSummary";
import { PropertyPerformanceList } from "./PropertyPerformanceList";
import type { PropertyReportState } from "./usePropertyReportState";

export const PropertyReportContent: FC<{ state: PropertyReportState }> = ({ state }) => (
  <div className="min-h-screen bg-slate-50 px-4 py-8 md:p-10 dark:bg-slate-900 pb-24">
    <div className="mx-auto max-w-7xl space-y-8">
      <PropertyReportHeader />
      <AvailabilityInfoBanner />
      <ReportBody state={state} />
      <PropertyReportShortcuts />
    </div>
  </div>
);

const PropertyReportHeader: FC = () => (
  <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
        Laporan Properti
      </h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Pantau performa properti, ketersediaan kamar, dan kesehatan operasional.
      </p>
    </div>
    <div className="flex shrink-0 flex-wrap gap-3">
      <Link
        to="/tenant/occupancy"
        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
      >
        <CalendarDays size={16} /> Kalender Ketersediaan
      </Link>
      <Link
        to="/tenant/reports"
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
      >
        <BarChart3 size={16} /> Laporan Penjualan
      </Link>
    </div>
  </div>
);

const AvailabilityInfoBanner: FC = () => (
  <div className="rounded-2xl border border-amber-100 bg-amber-50/60 px-6 py-4 dark:border-amber-900/30 dark:bg-amber-900/10">
    <p className="text-sm text-amber-800 dark:text-amber-400">
      <strong>Catatan:</strong> Halaman ini menampilkan ringkasan berdasarkan data reservasi terjadwal dari kalender ketersediaan. Untuk aksi pengelolaan, gunakan menu <strong>Kalender Ketersediaan</strong>.
    </p>
  </div>
);

const ReportBody: FC<{ state: PropertyReportState }> = ({ state }) => {
  if (state.loading) return <SectionLoading label="Memuat laporan properti..." size="lg" variant="report" />;
  if (state.error) return <ErrorState title="Laporan belum bisa dimuat" message={state.error} onRetry={state.refetch} />;
  return (
    <div className="space-y-6">
      <PropertyReportSummary data={state.data} />
      <PropertyPerformanceList data={state.data} />
    </div>
  );
};
