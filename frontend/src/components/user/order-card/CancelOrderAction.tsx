import type { FC } from "react";
import { XCircle } from "lucide-react";
import type { Order } from "@/types";

interface CancelOrderActionProps {
  canceling: string | null;
  handleCancelClick: (id: string) => void;
  order: Order;
}

export const CancelOrderAction: FC<CancelOrderActionProps> = ({ canceling, handleCancelClick, order }) => (
  <button onClick={() => handleCancelClick(order.id)} disabled={canceling === order.id} className="mt-2 flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60 dark:border-red-900/40 dark:hover:bg-red-900/20">
    <XCircle size={16} /> {canceling === order.id ? "Membatalkan..." : "Batalkan Pesanan"}
  </button>
);
