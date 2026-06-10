import type { FC } from "react";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import type { UserOrdersState } from "@/hooks/user/orders/userOrdersTypes";

export const UserCancelOrderModal: FC<{ state: UserOrdersState }> = ({ state }) => {
  const isWaitingConfirmation = state.cancelModal.status === "WAITING_CONFIRMATION";
  
  const title = isWaitingConfirmation ? "Ajukan Pembatalan" : "Batalkan Pesanan";
  const message = isWaitingConfirmation
    ? `Pesanan sudah memiliki bukti pembayaran.\n\nPembatalan akan mengubah status pesanan menjadi Dibatalkan.\nPengembalian dana dilakukan langsung oleh pengelola properti dan berada di luar sistem Purwaloka.\n\nPurwaloka tidak memproses maupun menahan dana pembayaran manual.\n\nLanjutkan pembatalan pesanan ${state.cancelModal.orderNumber}?`
    : `Batalkan pesanan ${state.cancelModal.orderNumber}? Pesanan ini akan dibatalkan dan kamar/properti akan tersedia kembali. Tindakan ini tidak dapat dibatalkan.`;

  return (
    <ConfirmModal
      isOpen={state.cancelModal.isOpen}
      title={title}
      message={message}
      confirmText={state.canceling ? "Membatalkan..." : (isWaitingConfirmation ? "Ya, Ajukan Pembatalan" : "Ya, Batalkan Pesanan")}
      cancelText="Kembali"
      confirmDisabled={Boolean(state.canceling)}
      onConfirm={state.confirmCancelOrder}
      onCancel={state.closeCancelModal}
    />
  );
};
