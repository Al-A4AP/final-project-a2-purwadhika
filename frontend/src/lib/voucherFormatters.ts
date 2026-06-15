import type { Voucher } from "@/types";

type VoucherBenefit = Pick<Voucher, "discount_type" | "discount_value">;

export const formatVoucherBenefit = (voucher: VoucherBenefit) => {
  if (voucher.discount_type === "PERCENTAGE") return `Diskon ${voucher.discount_value}%`;
  if (voucher.discount_type === "FREE_NIGHTS") return `Gratis ${voucher.discount_value} Malam`;
  return "Voucher nominal tidak didukung";
};
