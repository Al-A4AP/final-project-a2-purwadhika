import type { FC } from "react";
import { OrdersEmptyRow } from "./OrdersEmptyRow";
import { OrdersTableHead } from "./OrdersTableHead";
import { OrdersTableRow } from "./OrdersTableRow";
import type { OrdersTableViewProps } from "./types";

export const OrdersDesktopTable: FC<OrdersTableViewProps> = ({ orders, updating, handleUpdateStatus }) => (
  <div className="hidden overflow-x-auto md:block">
    <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
      <OrdersTableHead />
      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
        {orders.length === 0 ? <OrdersEmptyRow /> : orders.map((order) => <OrdersTableRow key={order.id} order={order} updating={updating} handleUpdateStatus={handleUpdateStatus} />)}
      </tbody>
    </table>
  </div>
);
