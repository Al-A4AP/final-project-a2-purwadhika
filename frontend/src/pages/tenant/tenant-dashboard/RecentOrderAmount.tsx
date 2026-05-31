import type { FC } from "react";
import { formatPrice } from "@/lib/formatters";

export const RecentOrderAmount: FC<{ totalPrice: number }> = ({ totalPrice }) => (
  <p className="whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">{formatPrice(totalPrice)}</p>
);
