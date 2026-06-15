import type { FC } from "react";
import {
  OrderDatesCell,
  OrderGuestCell,
  OrderPaymentCell,
  OrderPropertyCell,
  OrderStatusCell,
  OrderCreatedAtCell,
} from "./OrdersTableCells";
import { OrdersTableActions } from "./OrdersTableActions";
import type { OrderRowProps } from "./types";

export const OrdersTableRow: FC<OrderRowProps> = ({
  order,
  updating,
  handleUpdateStatus,
  handleMarkRefundComplete,
}) => (
  <tr className="bg-white transition hover:bg-slate-50/50 dark:bg-slate-900 dark:hover:bg-slate-800/50">
    <OrderGuestCell order={order} />
    <OrderPropertyCell order={order} />
    <OrderCreatedAtCell order={order} />
    <OrderDatesCell order={order} />
    <OrderPaymentCell order={order} />
    <OrderStatusCell order={order} />
    <td className="px-6 py-4 whitespace-nowrap">
      <OrdersTableActions
        order={order}
        updating={updating}
        handleUpdateStatus={handleUpdateStatus}
        handleMarkRefundComplete={handleMarkRefundComplete}
      />
    </td>
  </tr>
);
