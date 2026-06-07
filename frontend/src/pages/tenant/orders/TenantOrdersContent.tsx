import type { FC } from "react";

import type { TenantOrdersState } from "@/hooks/tenant/orders/tenantOrdersTypes";
import { TenantOrdersConfirmModal } from "./TenantOrdersConfirmModal";
import { TenantOrdersFilterPanel } from "./TenantOrdersFilterPanel";
import { TenantOrdersTableSection } from "./TenantOrdersTableSection";

interface TenantOrdersContentProps {
  closeConfirm: () => void;
  state: TenantOrdersState;
}

export const TenantOrdersContent: FC<TenantOrdersContentProps> = ({ closeConfirm, state }) => (
  <div className="min-h-screen bg-slate-50 px-4 py-8 md:p-10 dark:bg-slate-900 pb-24">
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Reservasi
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Kelola daftar pesanan masuk dan reservasi aktif di seluruh properti Anda.
        </p>
      </div>

      <div className="space-y-6">
        <TenantOrdersFilterPanel state={state} />
        <TenantOrdersTableSection state={state} />
      </div>

      <TenantOrdersConfirmModal onCancel={closeConfirm} state={state} />
    </div>
  </div>
);
