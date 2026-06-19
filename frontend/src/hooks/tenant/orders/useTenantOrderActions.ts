import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/errorMessage";
import { getOrderStatusLabel } from "@/lib/orderStatus";
import { orderService } from "@/services/orderService";
import type { Order } from "@/types";
import { canTransitionOrder, getConfirmMessage } from "./orderTransitions";
import type { ConfirmModalState } from "./tenantOrdersTypes";
import {
  TENANT_REJECTION_REASON_MAX_LENGTH,
  TENANT_REJECTION_REASON_MIN_LENGTH,
} from "@/constants/validation";

type SubmitGuard = { current: boolean };

const initialModal: ConfirmModalState = { confirmText: "Ya", isOpen: false, message: "", onConfirm: () => {}, title: "", showReasonInput: false };

export const useTenantOrderActions = (orders: Order[], refetch: () => void) => {
  const submitGuard = useRef(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>(initialModal);
  const closeConfirm = () => setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  const handleUpdateStatus = (orderId: string, status: string) =>
    requestStatusUpdate({ closeConfirm, orders, orderId, refetch, setConfirmModal, setUpdating, status, submitGuard });

  const confirmRefundComplete = async (orderId: string) => {
    if (submitGuard.current) return;
    submitGuard.current = true;
    setUpdating(orderId);
    try {
      await orderService.markRefundComplete(orderId);
      toast.success("Refund ditandai selesai.");
      closeConfirm();
      refetch();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Gagal menandai refund selesai. Silakan coba lagi."));
    } finally {
      submitGuard.current = false;
      setUpdating(null);
    }
  };

  const handleMarkRefundComplete = (orderId: string) => {
    setConfirmModal({
      confirmText: "Ya, Tandai Selesai",
      isOpen: true,
      message: "Pastikan Anda sudah melakukan pengembalian dana kepada tamu secara manual.\n\nTindakan ini akan menandai refund sebagai selesai di sistem Purwaloka.\n\nLanjutkan?",
      onConfirm: () => confirmRefundComplete(orderId),
      title: "Tandai Refund Selesai",
      showReasonInput: false,
    });
  };

  return { closeConfirm, confirmModal, handleUpdateStatus, handleMarkRefundComplete, updating };
};

const requestStatusUpdate = (options: StatusRequestOptions) => {
  const order = options.orders.find((item) => item.id === options.orderId);
  if (!order || !validateTransition(order, options.status)) return;
  options.setConfirmModal(createConfirmModal(options, order));
};

const validateTransition = (order: Order, status: string) => {
  if (canTransitionOrder(order.status, status)) return true;
  toast.error(`Transisi status dari ${getOrderStatusLabel(order.status)} ke ${getOrderStatusLabel(status)} tidak diperbolehkan.`);
  return false;
};

const createConfirmModal = (options: StatusRequestOptions, order: Order): ConfirmModalState => ({
  confirmText: "Ya",
  isOpen: true,
  message: getConfirmMessage(options.status),
  onConfirm: (reason) => confirmStatusUpdate({ ...options, reason }),
  reasonMaxLength: TENANT_REJECTION_REASON_MAX_LENGTH,
  reasonMinLength: TENANT_REJECTION_REASON_MIN_LENGTH,
  title: "Konfirmasi Aksi",
  showReasonInput: order.status === "WAITING_CONFIRMATION" && options.status === "CANCELLED",
});

const confirmStatusUpdate = async (options: StatusRequestOptions & { reason?: string }) => {
  if (options.submitGuard.current) return;
  options.submitGuard.current = true;
  options.setUpdating(options.orderId);
  try {
    await orderService.updateOrderStatus(options.orderId, options.status, options.reason);
    handleStatusSuccess(options);
  } catch (err) {
    handleStatusError(err, options);
  } finally {
    options.submitGuard.current = false;
    options.setUpdating(null);
  }
};

const handleStatusSuccess = (options: StatusRequestOptions) => {
  toast.success("Status pesanan berhasil diperbarui!");
  options.closeConfirm();
  options.refetch();
};

const handleStatusError = (err: unknown, options: StatusRequestOptions) => {
  const message = getApiErrorMessage(err, "Status pesanan gagal diperbarui. Muat ulang daftar pesanan lalu coba lagi.");
  if (!message.includes("Transisi status")) return toast.error(message);
  toast.error("Status pesanan sudah berubah. Daftar pesanan dimuat ulang.");
  options.closeConfirm();
  options.refetch();
};

interface StatusRequestOptions {
  closeConfirm: () => void;
  orderId: string;
  orders: Order[];
  refetch: () => void;
  setConfirmModal: (modal: ConfirmModalState) => void;
  setUpdating: (orderId: string | null) => void;
  status: string;
  submitGuard: SubmitGuard;
}
