import type { FC } from "react";
import { formatPrice } from "@/lib/formatters";

const PriceValue: FC<{ minPrice: number }> = ({ minPrice }) => (
  minPrice === 0 ? <span className="text-green-600 dark:text-green-400">Gratis</span> : <>{formatPrice(minPrice)}</>
);

export const PropertyPrice: FC<{ minPrice: number }> = ({ minPrice }) => (
  <div className="border-t border-gray-200 pt-3 dark:border-slate-700">
    <div className="text-2xl font-bold text-red-600"><PriceValue minPrice={minPrice} /></div>
    <p className="text-sm text-gray-600 dark:text-gray-400">per malam</p>
  </div>
);
