import { ConfirmModal } from "@/components/common/ConfirmModal";
import type { PaymentConfirmationState } from "./paymentConfirmationTypes";

export const PaymentConfirmationModal = ({ state }: { state: PaymentConfirmationState }) => (
  <ConfirmModal
    isOpen={state.confirmModal.isOpen}
    title={state.confirmModal.title}
    message={state.confirmModal.message}
    confirmText={state.updating ? "Memproses..." : state.confirmModal.confirmText}
    confirmDisabled={Boolean(state.updating)}
    onConfirm={state.confirmModal.onConfirm}
    onCancel={state.closeConfirm}
  />
);

