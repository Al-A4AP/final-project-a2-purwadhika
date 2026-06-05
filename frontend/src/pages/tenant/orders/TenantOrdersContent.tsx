import type { FC } from "react";

import type { TenantOrdersState } from "./tenantOrdersTypes";
import { TenantOrdersConfirmModal } from "./TenantOrdersConfirmModal";
import { TenantOrdersFilterPanel } from "./TenantOrdersFilterPanel";
import { TenantOrdersTableSection } from "./TenantOrdersTableSection";
import { Link } from "react-router-dom";
import { CalendarCheck, ChevronRight } from "lucide-react";

interface TenantOrdersContentProps {
  closeConfirm: () => void;
  state: TenantOrdersState;
}

export const TenantOrdersContent: FC<TenantOrdersContentProps> = ({ closeConfirm, state }) => (
  <div className="min-h-screen bg-slate-50 px-4 py-8 md:p-10 dark:bg-slate-900 pb-24">
    <div className="mx-auto max-w-7xl space-y-8">
      
      {/* Header Section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Reservasi
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Kelola daftar pesanan masuk dan reservasi aktif di seluruh properti Anda.
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <Link 
            to="/tenant/payment-confirmation"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            <CalendarCheck size={16} />
            Konfirmasi Pembayaran
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        <TenantOrdersFilterPanel state={state} />
        <TenantOrdersTableSection state={state} />
      </div>

      <TenantOrdersConfirmModal onCancel={closeConfirm} state={state} />
    </div>
  </div>
);
