import type { FC } from "react";
import { CreditCard } from "lucide-react";
import type { Order } from "@/types";

const paymentLabel = (method: string) => method === "MIDTRANS" ? "Otomatis (Midtrans)" : "Manual Transfer";

export const OrderPaymentInfo: FC<{ order: Order }> = ({ order }) => (
  <div className="flex gap-4">
    <div>
      <p className="mb-1 text-gray-500">Metode Pembayaran</p>
      <p className="flex items-center gap-2 font-medium text-gray-900 dark:text-white">
        <CreditCard size={16} /> {paymentLabel(order.payment_method)}
      </p>
    </div>
    
    {order.payment_method === 'MANUAL' && order.payment_proof_url && (
      <div className="ml-4 border-l border-slate-100 pl-4 dark:border-slate-800">
        <p className="mb-2 text-xs text-gray-500">Bukti Transfer</p>
        <a href={order.payment_proof_url} target="_blank" rel="noopener noreferrer" className="group block overflow-hidden rounded-lg border border-slate-200 shadow-sm transition hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600">
          <img src={order.payment_proof_url} alt="Bukti" loading="lazy" className="h-16 w-16 object-cover transition-transform duration-300 group-hover:scale-105" />
        </a>
      </div>
    )}
  </div>
);
