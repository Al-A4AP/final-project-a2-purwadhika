import type { FC } from "react";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import type { TenantOrdersState } from "./tenantOrdersTypes";

export const TenantOrdersConfirmModal: FC<{ onCancel: () => void; state: TenantOrdersState }> = ({ onCancel, state }) => (
  <ConfirmModal
    isOpen={state.confirmModal.isOpen}
    title={state.confirmModal.title}
    message={state.confirmModal.message}
    confirmText={state.confirmModal.confirmText}
    onConfirm={state.confirmModal.onConfirm}
    onCancel={onCancel}
  />
);
