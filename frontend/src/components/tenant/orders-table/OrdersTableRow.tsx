import type { FC } from "react";
import { OrderDatesCell, OrderGuestCell, OrderPaymentCell, OrderPropertyCell, OrderStatusCell } from "./OrdersTableCells";
import { OrdersTableActions } from "./OrdersTableActions";
import type { OrderRowProps } from "./types";

export const OrdersTableRow: FC<OrderRowProps> = ({ order, updating, handleUpdateStatus }) => (
  <tr className="border-b bg-white dark:border-slate-700 dark:bg-slate-800">
    <OrderGuestCell order={order} />
    <OrderPropertyCell order={order} />
    <OrderDatesCell order={order} />
    <OrderPaymentCell order={order} />
    <OrderStatusCell order={order} />
    <td className="px-6 py-4"><OrdersTableActions order={order} updating={updating} handleUpdateStatus={handleUpdateStatus} /></td>
  </tr>
);
