import type { FC } from "react";
import type { OrderStatus } from "@/types";
import { ORDER_STATUS_SOFT_CLASSES } from "@/lib/constants";
import { getOrderStatusLabel } from "@/lib/orderStatus";

export const RecentOrderStatus: FC<{ status: OrderStatus }> = ({ status }) => (
  <span className={`inline-flex justify-center rounded-full px-2.5 py-1 text-center text-[10px] font-semibold md:text-xs ${ORDER_STATUS_SOFT_CLASSES[status]}`}>
    {getOrderStatusLabel(status)}
  </span>
);
