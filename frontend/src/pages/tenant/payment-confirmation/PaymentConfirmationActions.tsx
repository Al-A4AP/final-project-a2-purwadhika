import { Check, X } from "lucide-react";
import type { ReactNode } from "react";
import type { Order } from "@/types";
import type { PaymentConfirmationState } from "./paymentConfirmationTypes";

export const PaymentConfirmationActions = ({ order, state }: PaymentConfirmationActionsProps) => (
  <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 dark:border-slate-800 sm:flex-row">
    <ActionButton disabled={state.updating === order.id} onClick={() => state.handleUpdateStatus(order.id, "PROCESSED")} variant="accept">
      <Check size={18} /> Terima Pembayaran
    </ActionButton>
    <ActionButton disabled={state.updating === order.id} onClick={() => state.handleUpdateStatus(order.id, "CANCELLED")} variant="reject">
      <X size={18} /> Tolak & Batalkan
    </ActionButton>
  </div>
);

const ActionButton = ({ children, disabled, onClick, variant }: ActionButtonProps) => (
  <button onClick={onClick} disabled={disabled} className={actionButtonClass(variant)}>
    {children}
  </button>
);

const actionButtonClass = (variant: "accept" | "reject") =>
  variant === "accept" ? ACCEPT_CLASS : REJECT_CLASS;

const ACCEPT_CLASS = "flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 font-bold text-white transition hover:bg-slate-800 disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200";
const REJECT_CLASS = "flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-6 font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900/40 dark:bg-slate-800 dark:text-red-400 dark:hover:bg-red-900/20";

interface PaymentConfirmationActionsProps {
  order: Order;
  state: PaymentConfirmationState;
}

interface ActionButtonProps {
  children: ReactNode;
  disabled: boolean;
  onClick: () => void;
  variant: "accept" | "reject";
}
