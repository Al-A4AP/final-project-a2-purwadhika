import type { FC } from "react";
import { formatPrice } from "@/lib/formatters";

const TotalValue: FC<{ totalPrice: number }> = ({ totalPrice }) => (
  totalPrice === 0 ? <span className="text-xl font-bold text-green-600 dark:text-green-400">Gratis</span> : <span className="text-xl font-bold text-red-600">{formatPrice(totalPrice)}</span>
);

export const BookingTotal: FC<{ totalPrice: number }> = ({ totalPrice }) => (
  <div className="mb-8 flex items-center justify-between">
    <span className="font-bold text-gray-900 dark:text-white">Total</span>
    <TotalValue totalPrice={totalPrice} />
  </div>
);
