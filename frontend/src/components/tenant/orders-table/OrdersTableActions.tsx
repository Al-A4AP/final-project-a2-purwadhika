import type { FC } from "react";
import type { OrderStatus } from "@/types";
import { Check, X } from "lucide-react";
import type { OrderRowProps } from "./types";

interface ActionButtonProps extends OrderRowProps {
  className: string;
  icon: "check" | "x";
  label: string;
  nextStatus: OrderStatus;
}

const StatusActionButton: FC<ActionButtonProps> = ({ className, handleUpdateStatus, icon, label, nextStatus, order, updating }) => (
  <button onClick={() => handleUpdateStatus(order.id, nextStatus)} disabled={updating === order.id} className={className} title={label} aria-label={`${label} pesanan ${order.order_number}`}>
    {icon === "check" ? <Check size={16} /> : <X size={16} />}
    {label}
  </button>
);

const ConfirmationActions: FC<OrderRowProps> = (props) => (
  <div className="flex gap-2">
    <StatusActionButton {...props} className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-900 bg-slate-900 px-3 text-xs font-bold text-white transition hover:bg-slate-800 disabled:opacity-50 dark:border-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200" icon="check" label="Terima" nextStatus="PROCESSED" />
    <StatusActionButton {...props} className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900/40 dark:bg-slate-800 dark:text-red-400 dark:hover:bg-red-900/20" icon="x" label="Tolak" nextStatus="WAITING_PAYMENT" />
  </div>
);

const ManualCancelAction: FC<OrderRowProps> = (props) => (
  <button onClick={() => props.handleUpdateStatus(props.order.id, "CANCELLED")} disabled={props.updating === props.order.id} className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900/40 dark:bg-slate-800 dark:text-red-400 dark:hover:bg-red-900/20" title="Batalkan pesanan manual" aria-label={`Batalkan pesanan ${props.order.order_number}`}>
    <X size={16} />
    Batalkan
  </button>
);

export const OrdersTableActions: FC<OrderRowProps> = (props) => {
  if (props.order.status === "WAITING_CONFIRMATION") return <ConfirmationActions {...props} />;
  if (props.order.status === "WAITING_PAYMENT" && props.order.payment_method === "MANUAL") return <ManualCancelAction {...props} />;
  return null;
};
