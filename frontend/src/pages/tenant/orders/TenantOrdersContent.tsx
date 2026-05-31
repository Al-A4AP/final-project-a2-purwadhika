import type { FC } from "react";
import { HelpText } from "@/components/common/HelpText";
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
    <div className="mb-6 space-y-3">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manajemen Pesanan</h1>
      <HelpText>Konfirmasi hanya pesanan dengan bukti bayar valid. Gunakan filter status untuk memprioritaskan pesanan yang menunggu tindakan.</HelpText>
    </div>
    <TenantOrdersFilterPanel state={state} />
    <TenantOrdersTableSection state={state} />
    <TenantOrdersConfirmModal onCancel={closeConfirm} state={state} />
  </div>
);
