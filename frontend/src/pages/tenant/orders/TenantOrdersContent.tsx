import type { FC } from "react";
import type { TenantOrdersState } from "./tenantOrdersTypes";
import { TenantOrdersConfirmModal } from "./TenantOrdersConfirmModal";
import { TenantOrdersFilterPanel } from "./TenantOrdersFilterPanel";
import { TenantOrdersTableSection } from "./TenantOrdersTableSection";

interface TenantOrdersContentProps {
  closeConfirm: () => void;
  state: TenantOrdersState;
}

export const TenantOrdersContent: FC<TenantOrdersContentProps> = ({ closeConfirm, state }) => (
  <div className="p-6 md:p-8">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Manajemen Pesanan</h1>
    <TenantOrdersFilterPanel state={state} />
    <TenantOrdersTableSection state={state} />
    <TenantOrdersConfirmModal onCancel={closeConfirm} state={state} />
  </div>
);
