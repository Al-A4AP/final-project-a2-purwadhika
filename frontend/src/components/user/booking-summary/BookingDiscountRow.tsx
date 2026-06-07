import type { FC } from "react";
import { formatPrice } from "@/lib/formatters";

export const BookingDiscountRow: FC<{ discountAmount?: number }> = ({ discountAmount }) => (
  discountAmount ? (
    <div className="mb-3 flex items-center justify-between text-sm text-emerald-600 dark:text-emerald-400">
      <span>Diskon Voucher</span>
      <span>-{formatPrice(discountAmount)}</span>
    </div>
  ) : null
);
