import type { FC } from "react";
import { formatDate } from "@/lib/formatters";
import type { Order } from "@/types";

export const OrderStayInfo: FC<{ order: Order }> = ({ order }) => (
  <div>
    <p className="mb-1 text-gray-500">Jadwal Menginap</p>
    <p className="font-medium text-gray-900 dark:text-white">{formatDate(order.check_in_date)} - {formatDate(order.check_out_date)}</p>
  </div>
);
