import type { Order } from "@/types";

export type OrderStatusUpdateHandler = (id: string, status: string) => void;

export interface OrdersTableViewProps {
  handleUpdateStatus: OrderStatusUpdateHandler;
  handleMarkRefundComplete: (id: string) => void;
  orders: Order[];
  updating: string | null;
}

export interface OrderRowProps {
  handleUpdateStatus: OrderStatusUpdateHandler;
  handleMarkRefundComplete: (id: string) => void;
  order: Order;
  updating: string | null;
}
