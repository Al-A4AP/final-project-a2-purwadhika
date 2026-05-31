import { useState } from "react";
import { toast } from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/errorMessage";
import { getOrderStatusLabel } from "@/lib/orderStatus";
import { orderService } from "@/services/orderService";
import type { Order } from "@/types";
import { canTransitionOrder, getConfirmMessage } from "./orderTransitions";
import type { ConfirmModalState } from "./tenantOrdersTypes";

const initialModal: ConfirmModalState = {
  confirmText: "Ya",
  isOpen: false,
  message: "",
  onConfirm: () => {},
  title: "",
};

export const useTenantOrderActions = (orders: Order[], refetch: () => void) => {
  const [updating, setUpdating] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>(initialModal);
  const closeConfirm = () => setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  const handleUpdateStatus = (orderId: string, status: string) =>
    requestStatusUpdate(orderId, status, orders, setConfirmModal, setUpdating, refetch);
  return { closeConfirm, confirmModal, handleUpdateStatus, updating };
};

const requestStatusUpdate = (
  orderId: string,
  status: string,
  orders: Order[],
  setConfirmModal: (modal: ConfirmModalState) => void,
  setUpdating: (orderId: string | null) => void,
  refetch: () => void,
) => {
  const order = orders.find((item) => item.id === orderId);
  if (!order || !validateTransition(order, status)) return;
  setConfirmModal(createConfirmModal(orderId, status, setUpdating, refetch));
};

const validateTransition = (order: Order, status: string) => {
  if (canTransitionOrder(order.status, status)) return true;
  toast.error(`Transisi status dari ${getOrderStatusLabel(order.status)} ke ${getOrderStatusLabel(status)} tidak diperbolehkan.`);
  return false;
};

const createConfirmModal = (
  orderId: string,
  status: string,
  setUpdating: (orderId: string | null) => void,
  refetch: () => void,
): ConfirmModalState => ({
  confirmText: "Ya",
  isOpen: true,
  message: getConfirmMessage(status),
  onConfirm: () => confirmStatusUpdate(orderId, status, setUpdating, refetch),
  title: "Konfirmasi Aksi",
});

const confirmStatusUpdate = async (
  orderId: string,
  status: string,
  setUpdating: (orderId: string | null) => void,
  refetch: () => void,
) => {
  setUpdating(orderId);
  try { await orderService.updateOrderStatus(orderId, status); toast.success("Status pesanan berhasil diperbarui!"); refetch(); }
  catch (err) { toast.error(getApiErrorMessage(err, "Status pesanan gagal diperbarui. Muat ulang daftar pesanan lalu coba lagi.")); }
  finally { setUpdating(null); }
};
