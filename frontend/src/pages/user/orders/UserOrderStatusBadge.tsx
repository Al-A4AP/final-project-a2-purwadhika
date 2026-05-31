import type { FC, ReactNode } from "react";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import type { OrderStatus } from "@/types";
import { ORDER_STATUS_SOFT_CLASSES } from "@/lib/constants";
import { getOrderStatusLabel, isOrderStatus } from "@/lib/orderStatus";

const badgeClass = "inline-flex items-center justify-center gap-1 px-2 py-1 rounded-md text-center text-xs font-medium";

const STATUS_ICONS: Record<OrderStatus, ReactNode> = {
  WAITING_PAYMENT: <Clock size={14} />,
  WAITING_CONFIRMATION: <Clock size={14} />,
  PROCESSED: <CheckCircle2 size={14} />,
  COMPLETED: <CheckCircle2 size={14} />,
  CANCELLED: <XCircle size={14} />,
};

export const UserOrderStatusBadge: FC<{ status: string }> = ({ status }) =>
  isOrderStatus(status) ? (
    <span className={`${badgeClass} ${ORDER_STATUS_SOFT_CLASSES[status]}`}>
      {STATUS_ICONS[status]} {getOrderStatusLabel(status)}
    </span>
  ) : null;
