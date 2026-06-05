import type { ConfirmModalState } from "@/pages/tenant/orders/tenantOrdersTypes";
import type { Order, PaginationMeta } from "@/types";

export interface PaymentConfirmationState {
  closeConfirm: () => void;
  confirmModal: ConfirmModalState;
  error: string | null;
  fetchOrders: (page?: number) => Promise<void>;
  handleUpdateStatus: (orderId: string, status: string) => void;
  loading: boolean;
  orders: Order[];
  pagination: PaginationMeta;
  updating: string | null;
}

