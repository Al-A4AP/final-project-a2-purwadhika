import type { FC } from "react";
import { formatPrice } from "@/lib/formatters";
import { formatVoucherBenefit } from "@/lib/voucherFormatters";
import type { Voucher } from "@/types";

export const BookingDiscountRow: FC<{ discountAmount?: number; voucher?: Voucher }> = ({ discountAmount, voucher }) => (
  discountAmount ? (
    <div className="mb-3 flex items-center justify-between text-sm text-emerald-600 dark:text-emerald-400">
      <span>{voucher ? formatVoucherBenefit(voucher) : "Diskon Voucher"}</span>
      {voucher?.discount_type !== "FREE_NIGHTS" && <span>-{formatPrice(discountAmount)}</span>}
    </div>
  ) : null
);
