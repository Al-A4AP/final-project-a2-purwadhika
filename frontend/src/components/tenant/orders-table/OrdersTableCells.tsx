import type { FC } from "react";
import type { Order } from "@/types";
import { formatDate, formatPrice } from "@/lib/formatters";
import { OrderStatusBadge } from "../OrderStatusBadge";
import { PaymentProofLink } from "./PaymentProofLink";

export const OrderGuestCell: FC<{ order: Order }> = ({ order }) => (
  <td className="px-6 py-4">
    <p className="font-semibold text-gray-900 dark:text-white">{order.order_number}</p>
    <p className="text-xs">{order.user?.name}</p>
    <p className="text-xs">{order.user?.email}</p>
  </td>
);

export const OrderPropertyCell: FC<{ order: Order }> = ({ order }) => (
  <td className="px-6 py-4">
    <p className="font-semibold text-gray-900 dark:text-white">{order.property?.name}</p>
    <p className="text-xs">{order.room?.room_type}</p>
  </td>
);

export const OrderDatesCell: FC<{ order: Order }> = ({ order }) => (
  <td className="px-6 py-4">
    <p>{formatDate(order.check_in_date)}</p>
    <p>{formatDate(order.check_out_date)}</p>
  </td>
);

export const OrderPaymentCell: FC<{ order: Order }> = ({ order }) => (
  <td className="px-6 py-4">
    <p className="font-semibold text-gray-900 dark:text-white">{formatPrice(order.total_price)}</p>
    <p className="text-xs">{order.payment_method}</p>
  </td>
);

export const OrderStatusCell: FC<{ order: Order }> = ({ order }) => (
  <td className="px-6 py-4">
    <OrderStatusBadge status={order.status} />
    {order.payment_proof_url && <PaymentProofLink orderNumber={order.order_number} url={order.payment_proof_url} />}
  </td>
);
