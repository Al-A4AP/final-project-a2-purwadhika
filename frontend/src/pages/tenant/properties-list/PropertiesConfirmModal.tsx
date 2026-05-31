import type { FC } from "react";
import { ConfirmModal } from "@/components/common/ConfirmModal";

interface ConfirmState {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  title: string;
}

export const PropertiesConfirmModal: FC<{ confirmModal: ConfirmState; onCancel: () => void }> = ({ confirmModal, onCancel }) => (
  <ConfirmModal isOpen={confirmModal.isOpen} title={confirmModal.title} message={confirmModal.message} onConfirm={confirmModal.onConfirm} onCancel={onCancel} />
);
