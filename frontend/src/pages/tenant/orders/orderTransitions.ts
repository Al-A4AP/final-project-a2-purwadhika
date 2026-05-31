import type { OrderStatus } from "@/types";
import { getOrderStatusLabel } from "@/lib/orderStatus";

export const ALLOWED_ORDER_TRANSITIONS: Partial<Record<OrderStatus, OrderStatus[]>> = {
  WAITING_CONFIRMATION: ["PROCESSED", "CANCELLED"],
  WAITING_PAYMENT: ["CANCELLED"],
};

export const getConfirmMessage = (status: string) => {
  if (status === "PROCESSED") return "Terima pembayaran dan proses pesanan ini?";
  if (status === "CANCELLED") return "Batalkan pesanan ini?";
  return `Ubah status pesanan menjadi ${getOrderStatusLabel(status)}?`;
};

export const canTransitionOrder = (from: OrderStatus, to: string) =>
  ALLOWED_ORDER_TRANSITIONS[from]?.includes(to as OrderStatus) || false;
