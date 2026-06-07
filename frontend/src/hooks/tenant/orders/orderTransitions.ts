import { getOrderStatusLabel } from "@/lib/orderStatus";
import type { OrderStatus } from "@/types";

export const ALLOWED_ORDER_TRANSITIONS: Partial<Record<OrderStatus, OrderStatus[]>> = {
  WAITING_CONFIRMATION: ["PROCESSED", "CANCELLED", "WAITING_PAYMENT"],
  WAITING_PAYMENT: ["CANCELLED"],
};

export const getConfirmMessage = (status: string) => {
  if (status === "PROCESSED") return "Terima pembayaran dan proses pesanan ini?";
  if (status === "CANCELLED") return "Batalkan pesanan ini?";
  if (status === "WAITING_PAYMENT") return "Tolak bukti pembayaran dan kembalikan ke status Menunggu Pembayaran?";
  return `Ubah status pesanan menjadi ${getOrderStatusLabel(status)}?`;
};

export const canTransitionOrder = (from: OrderStatus, to: string) =>
  ALLOWED_ORDER_TRANSITIONS[from]?.includes(to as OrderStatus) || false;
