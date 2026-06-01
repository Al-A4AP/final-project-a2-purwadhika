import type { FC } from "react";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import type { UserOrdersState } from "./userOrdersTypes";

export const UserCancelOrderModal: FC<{ state: UserOrdersState }> = ({ state }) => (
  <ConfirmModal
    isOpen={state.cancelModal.isOpen}
    title="Batalkan Pesanan"
    message={`Batalkan pesanan ${state.cancelModal.orderNumber}? Tindakan ini tidak dapat dibatalkan.`}
    confirmText={state.canceling ? "Membatalkan..." : "Ya"}
    confirmDisabled={Boolean(state.canceling)}
    onConfirm={state.confirmCancelOrder}
    onCancel={state.closeCancelModal}
  />
);
