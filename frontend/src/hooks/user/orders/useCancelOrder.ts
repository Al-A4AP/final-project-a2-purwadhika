import { useState } from "react";
import { toast } from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/errorMessage";
import { userOrderActionService } from "@/services/userOrderActionService";
import type { Order } from "@/types";
import type { CancelOrderModalState } from "./userOrdersTypes";

const initialCancelModal: CancelOrderModalState = { isOpen: false, orderId: null, orderNumber: "" };

export const useCancelOrder = (orders: Order[], refetch: () => void) => {
  const [canceling, setCanceling] = useState<string | null>(null);
  const [cancelModal, setCancelModal] = useState<CancelOrderModalState>(initialCancelModal);
  const closeCancelModal = () => setCancelModal(initialCancelModal);
  const handleCancelClick = (orderId: string) => requestCancel(orderId, orders, setCancelModal);
  const confirmCancelOrder = () => cancelOrder(cancelModal.orderId, setCanceling, closeCancelModal, refetch);
  return { canceling, cancelModal, closeCancelModal, confirmCancelOrder, handleCancelClick };
};

const requestCancel = (orderId: string, orders: Order[], setCancelModal: (state: CancelOrderModalState) => void) => {
  const order = orders.find((item) => item.id === orderId);
  if (!order || !canCancelOrder(order)) return;
  setCancelModal({ isOpen: true, orderId, orderNumber: order.order_number, status: order.status, paymentMethod: order.payment_method });
};

const canCancelOrder = (order: Order) => {
  if (order.status === "WAITING_PAYMENT") return true;
  if (order.status === "WAITING_CONFIRMATION" && order.payment_method === "MANUAL") return true;
  toast.error("Pesanan ini tidak dapat dibatalkan dari halaman pengguna.");
  return false;
};

const cancelOrder = async (orderId: string | null, setCanceling: (value: string | null) => void, closeModal: () => void, refetch: () => void) => {
  if (!orderId) return;
  setCanceling(orderId);
  try { await userOrderActionService.cancelOrder(orderId); handleCancelSuccess(closeModal, refetch); }
  catch (err) { toast.error(getApiErrorMessage(err, "Pesanan gagal dibatalkan. Silakan coba lagi.")); }
  finally { setCanceling(null); }
};

const handleCancelSuccess = (closeModal: () => void, refetch: () => void) => {
  toast.success("Pesanan berhasil dibatalkan.");
  closeModal();
  refetch();
};
