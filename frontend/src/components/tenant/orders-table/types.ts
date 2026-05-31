import type { Order } from "@/types";

export type OrderStatusUpdateHandler = (id: string, status: string) => void;

export interface OrdersTableViewProps {
  handleUpdateStatus: OrderStatusUpdateHandler;
  orders: Order[];
  updating: string | null;
}

export interface OrderRowProps {
  handleUpdateStatus: OrderStatusUpdateHandler;
  order: Order;
  updating: string | null;
}
