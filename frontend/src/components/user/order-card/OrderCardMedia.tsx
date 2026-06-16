import type { FC } from "react";
import { BedDouble } from "lucide-react";
import { getUserRefundStatus } from "@/lib/orderStatus";
import type { OrderCardProps } from "./types";

export const OrderCardMedia: FC<Pick<OrderCardProps, "StatusBadge" | "order">> = ({ StatusBadge, order }) => (
  <div className="relative h-48 shrink-0 overflow-hidden bg-slate-200 dark:bg-slate-800 md:h-auto md:w-1/3">
    {order.property?.featured_image_url ? <OrderImage order={order} /> : <OrderImageFallback />}
    <OrderCardBadges StatusBadge={StatusBadge} order={order} />
  </div>
);

const OrderImage: FC<Pick<OrderCardProps, "order">> = ({ order }) => (
  <img src={order.property?.featured_image_url} alt={order.property?.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
);

const OrderImageFallback: FC = () => (
  <div className="flex h-full w-full items-center justify-center">
    <BedDouble size={40} className="text-slate-400" />
  </div>
);

const OrderCardBadges: FC<Pick<OrderCardProps, "StatusBadge" | "order">> = ({ StatusBadge, order }) => (
  <div className="absolute right-4 top-4 flex flex-col items-end gap-2">
    <StatusBadge status={order.status} />
    <RefundBadge status={getUserRefundStatus(order)} />
  </div>
);

const RefundBadge: FC<{ status: ReturnType<typeof getUserRefundStatus> }> = ({ status }) => {
  if (status === "PENDING") return <span className={pendingRefundClass}>Menunggu Refund Manual</span>;
  if (status === "COMPLETED") return <span className={completedRefundClass}>Refund Selesai</span>;
  return null;
};

const pendingRefundClass = "inline-flex items-center justify-center gap-1 rounded-md bg-orange-100 px-2 py-1 text-center text-xs font-medium text-orange-800 shadow-sm";
const completedRefundClass = "inline-flex items-center justify-center gap-1 rounded-md bg-emerald-100 px-2 py-1 text-center text-xs font-medium text-emerald-800 shadow-sm";
