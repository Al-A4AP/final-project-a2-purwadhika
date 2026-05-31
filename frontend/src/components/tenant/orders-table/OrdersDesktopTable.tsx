import type { FC } from "react";
import { OrdersEmptyRow } from "./OrdersEmptyRow";
import { OrdersTableHead } from "./OrdersTableHead";
import { OrdersTableRow } from "./OrdersTableRow";
import type { OrdersTableViewProps } from "./types";

export const OrdersDesktopTable: FC<OrdersTableViewProps> = ({ orders, updating, handleUpdateStatus }) => (
  <div className="hidden overflow-x-auto md:block">
    <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
      <OrdersTableHead />
      <tbody>
        {orders.length === 0 ? <OrdersEmptyRow /> : orders.map((order) => <OrdersTableRow key={order.id} order={order} updating={updating} handleUpdateStatus={handleUpdateStatus} />)}
      </tbody>
    </table>
  </div>
);
