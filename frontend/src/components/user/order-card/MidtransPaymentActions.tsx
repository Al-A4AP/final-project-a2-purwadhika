import type { FC } from "react";
import { CreditCard, Wallet } from "lucide-react";
import type { Order } from "@/types";

interface MidtransPaymentActionsProps {
  order: Order;
  paymentActionId: string | null;
  retryMidtransPayment: (id: string) => void;
  switchToManualPayment: (id: string) => void;
}

const buttonClass = "mt-2 flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition disabled:opacity-60";
const midtransClass = `${buttonClass} border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-900/20`;
const manualClass = `${buttonClass} border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-900/40 dark:hover:bg-blue-900/20`;

export const MidtransPaymentActions: FC<MidtransPaymentActionsProps> = (props) => {
  const busy = props.paymentActionId === props.order.id;
  return (
    <div className="mt-2">
      <p className="text-xs italic text-yellow-600">{getNotice(props.order.status)}</p>
      <button onClick={() => props.retryMidtransPayment(props.order.id)} disabled={busy} className={midtransClass}>
        <CreditCard size={16} /> {busy ? "Memproses..." : "Coba lagi Midtrans"}
      </button>
      <button onClick={() => props.switchToManualPayment(props.order.id)} disabled={busy} className={manualClass}>
        <Wallet size={16} /> Pakai manual transfer
      </button>
    </div>
  );
};

const getNotice = (status: Order["status"]) =>
  status === "CANCELLED" ? "Pembayaran Midtrans dibatalkan. Anda bisa mencoba lagi jika tanggal masih tersedia." : "Jika popup Midtrans tertutup, buka ulang pembayaran atau pilih manual transfer.";
