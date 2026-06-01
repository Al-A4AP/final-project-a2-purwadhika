import type { FC } from "react";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import type { TenantReviewsState } from "./tenantReviewsTypes";

export const TenantReviewDeleteModal: FC<{ state: TenantReviewsState }> = ({ state }) => (
  <ConfirmModal
    isOpen={Boolean(state.deleteTarget)}
    title="Hapus Ulasan"
    message={deleteMessage(state)}
    confirmText={state.deletingReviewId ? "Menghapus..." : "Ya"}
    confirmDisabled={Boolean(state.deletingReviewId)}
    onConfirm={state.confirmDeleteReview}
    onCancel={state.closeDeleteReview}
  />
);

const deleteMessage = (state: TenantReviewsState) => {
  const propertyName = state.deleteTarget?.property?.name || "properti ini";
  return `Hapus ulasan untuk ${propertyName}? Ulasan dan balasannya tidak akan tampil lagi.`;
};
