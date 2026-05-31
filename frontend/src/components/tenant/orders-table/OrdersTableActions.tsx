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
  </button>
);

const ConfirmationActions: FC<OrderRowProps> = (props) => (
  <div className="flex gap-2">
    <StatusActionButton {...props} className="flex h-9 w-9 items-center justify-center rounded bg-green-50 text-green-600 hover:bg-green-100 disabled:opacity-50" icon="check" label="Terima" nextStatus="PROCESSED" />
    <StatusActionButton {...props} className="flex h-9 w-9 items-center justify-center rounded bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50" icon="x" label="Tolak" nextStatus="CANCELLED" />
  </div>
);

const ManualCancelAction: FC<OrderRowProps> = (props) => (
  <button onClick={() => props.handleUpdateStatus(props.order.id, "CANCELLED")} disabled={props.updating === props.order.id} className="text-xs text-red-600 hover:underline" title="Batalkan pesanan manual" aria-label={`Batalkan pesanan ${props.order.order_number}`}>
    Batalkan Pesanan
  </button>
);

export const OrdersTableActions: FC<OrderRowProps> = (props) => {
  if (props.order.status === "WAITING_CONFIRMATION") return <ConfirmationActions {...props} />;
  if (props.order.status === "WAITING_PAYMENT" && props.order.payment_method === "MANUAL") return <ManualCancelAction {...props} />;
  return null;
};
