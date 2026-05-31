import type { FC } from "react";
import { OrderMobileCard } from "../OrderMobileCard";
import type { OrdersTableViewProps } from "./types";

export const OrdersMobileList: FC<OrdersTableViewProps> = ({ orders, updating, handleUpdateStatus }) => (
  <div className="space-y-3 md:hidden">
    {orders.length === 0 ? (
      <p className="py-8 text-center text-sm text-gray-500">Belum ada pesanan masuk.</p>
    ) : (
      orders.map((order) => <OrderMobileCard key={order.id} order={order} updating={updating} handleUpdateStatus={handleUpdateStatus} />)
    )}
  </div>
);
