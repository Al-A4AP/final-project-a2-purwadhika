import type { FC } from "react";
import type { Order } from "@/types";
import { formatDate, formatPrice } from "@/lib/formatters";
import { OrderStatusBadge } from "../OrderStatusBadge";
import { PaymentProofLink } from "./PaymentProofLink";
import { getUserRefundStatus } from "@/lib/orderStatus";

export const OrderGuestCell: FC<{ order: Order }> = ({ order }) => (
  <td className="px-6 py-4">
    <p className="font-semibold text-slate-900 dark:text-white">
      {order.order_number}
    </p>
    <p className="text-xs text-slate-500 mt-0.5">{order.user?.name}</p>
    <p className="text-xs text-slate-400">{order.user?.email}</p>
  </td>
);

export const OrderPropertyCell: FC<{ order: Order }> = ({ order }) => (
  <td className="px-6 py-4">
    <p className="font-semibold text-slate-900 dark:text-white">
      {order.property?.name}
    </p>
    <p className="text-xs text-slate-500 mt-0.5">{order.room?.room_type}</p>
  </td>
);

export const OrderCreatedAtCell: FC<{ order: Order }> = ({ order }) => (
  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
    <p>{formatDate(order.created_at)}</p>
  </td>
);

export const OrderDatesCell: FC<{ order: Order }> = ({ order }) => (
  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
    <p>{formatDate(order.check_in_date)}</p>
    <p className="text-slate-400">{formatDate(order.check_out_date)}</p>
  </td>
);

export const OrderPaymentCell: FC<{ order: Order }> = ({ order }) => (
  <td className="px-6 py-4">
    <p className="font-semibold text-slate-900 dark:text-white">
      {formatPrice(order.total_price)}
    </p>
    <p className="text-xs text-slate-500 mt-0.5">{order.payment_method}</p>
  </td>
);

export const OrderStatusCell: FC<{ order: Order }> = ({ order }) => {
  const refundStatus = getUserRefundStatus(order);

  return (
    <td className="px-6 py-4">
      <div className="flex flex-col items-start gap-2">
        <OrderStatusBadge status={order.status} />
        {refundStatus === "PENDING" && (
          <span className="inline-flex items-center justify-center rounded-md px-2 py-1 text-center text-xs font-medium bg-orange-100 text-orange-800">
            Refund Diperlukan
          </span>
        )}
        {refundStatus === "COMPLETED" && (
          <span className="inline-flex items-center justify-center rounded-md px-2 py-1 text-center text-xs font-medium bg-emerald-100 text-emerald-800">
            Refund Selesai
          </span>
        )}
        {order.payment_proof_url && (
          <PaymentProofLink
            orderNumber={order.order_number}
            url={order.payment_proof_url}
          />
        )}
      </div>
    </td>
  );
};
