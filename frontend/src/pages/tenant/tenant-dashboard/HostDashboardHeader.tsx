import type { FC } from "react";
import { Link } from "react-router-dom";
import { Plus, CheckCircle, CalendarDays } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

export const HostDashboardHeader: FC = () => {
  const { user } = useAuthStore();

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Halo, {user?.name || "Host"}
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Ringkasan performa dan manajemen operasional properti Anda hari ini.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link 
          to="/tenant/payment-confirmation"
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <CheckCircle size={16} className="text-slate-500" />
          Konfirmasi Bayar
        </Link>
        <Link 
          to="/tenant/orders"
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <CalendarDays size={16} className="text-slate-500" />
          Reservasi
        </Link>
        <Link 
          to="/tenant/properties/new"
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
        >
          <Plus size={16} />
          Tambah Properti
        </Link>
      </div>
    </div>
  );
};
