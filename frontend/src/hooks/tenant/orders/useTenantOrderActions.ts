import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/errorMessage";
import { getOrderStatusLabel } from "@/lib/orderStatus";
import { orderService } from "@/services/orderService";
import type { Order } from "@/types";
import { canTransitionOrder, getConfirmMessage } from "../../../pages/tenant/orders/orderTransitions";
import type { ConfirmModalState } from "../../../pages/tenant/orders/tenantOrdersTypes";

type SubmitGuard = { current: boolean };

const initialModal: ConfirmModalState = { confirmText: "Ya", isOpen: false, message: "", onConfirm: () => {}, title: "" };

export const useTenantOrderActions = (orders: Order[], refetch: () => void) => {
  const submitGuard = useRef(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>(initialModal);
  const closeConfirm = () => setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  const handleUpdateStatus = (orderId: string, status: string) =>
    requestStatusUpdate({ closeConfirm, orders, orderId, refetch, setConfirmModal, setUpdating, status, submitGuard });
  return { closeConfirm, confirmModal, handleUpdateStatus, updating };
};

const requestStatusUpdate = (options: StatusRequestOptions) => {
  const order = options.orders.find((item) => item.id === options.orderId);
  if (!order || !validateTransition(order, options.status)) return;
  options.setConfirmModal(createConfirmModal(options));
};

const validateTransition = (order: Order, status: string) => {
  if (canTransitionOrder(order.status, status)) return true;
  toast.error(`Transisi status dari ${getOrderStatusLabel(order.status)} ke ${getOrderStatusLabel(status)} tidak diperbolehkan.`);
  return false;
};

const createConfirmModal = (options: StatusRequestOptions): ConfirmModalState => ({
  confirmText: "Ya",
  isOpen: true,
  message: getConfirmMessage(options.status),
  onConfirm: () => confirmStatusUpdate(options),
  title: "Konfirmasi Aksi",
});

const confirmStatusUpdate = async (options: StatusRequestOptions) => {
  if (options.submitGuard.current) return;
  options.submitGuard.current = true;
  options.setUpdating(options.orderId);
  try {
    await orderService.updateOrderStatus(options.orderId, options.status);
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
