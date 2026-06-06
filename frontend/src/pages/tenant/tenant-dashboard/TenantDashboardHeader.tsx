import type { FC } from "react";
import { useAuthStore } from "@/stores/authStore";

export const TenantDashboardHeader: FC = () => {
  const { user } = useAuthStore();

  return (
    <div className="mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Halo, {user?.name || "Tenant"}
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Ringkasan performa dan manajemen operasional properti Anda hari ini.
        </p>
      </div>
    </div>
  );
};
