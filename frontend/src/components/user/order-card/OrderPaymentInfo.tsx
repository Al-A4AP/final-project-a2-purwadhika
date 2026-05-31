import type { FC } from "react";
import { CreditCard } from "lucide-react";
import type { Order } from "@/types";

const paymentLabel = (method: string) => method === "MIDTRANS" ? "Otomatis (Midtrans)" : "Manual Transfer";

export const OrderPaymentInfo: FC<{ order: Order }> = ({ order }) => (
  <div>
    <p className="mb-1 text-gray-500">Metode Pembayaran</p>
    <p className="flex items-center gap-2 font-medium text-gray-900 dark:text-white"><CreditCard size={16} /> {paymentLabel(order.payment_method)}</p>
  </div>
);
