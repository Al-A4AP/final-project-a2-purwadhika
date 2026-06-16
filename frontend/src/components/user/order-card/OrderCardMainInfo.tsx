import type { FC } from "react";
import { BedDouble, MapPin } from "lucide-react";
import type { Order } from "@/types";
import { OrderStayDates } from "./OrderStayDates";

export const OrderCardMainInfo: FC<{ order: Order }> = ({ order }) => (
  <div>
    <OrderNumberPayment order={order} />
    <h3 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">{order.property?.name}</h3>
    <OrderPropertyMeta order={order} />
    <OrderStayDates order={order} />
  </div>
);

const OrderNumberPayment: FC<{ order: Order }> = ({ order }) => (
  <div className="mb-2 flex items-center justify-between">
    <p className="font-mono text-xs font-bold tracking-wider text-slate-500">#{order.order_number}</p>
    <p className="text-sm font-semibold uppercase text-slate-500">{order.payment_method}</p>
  </div>
);

const OrderPropertyMeta: FC<{ order: Order }> = ({ order }) => (
  <div className="mb-6 flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-400 md:flex-row md:items-center md:gap-6">
    <span className="flex items-center"><MapPin size={16} className="mr-1" /> {order.property?.city || "Lokasi"}</span>
    <span className="flex items-center"><BedDouble size={16} className="mr-1" /> {order.room?.room_type}</span>
  </div>
);
