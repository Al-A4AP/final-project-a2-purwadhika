export type VoucherDiscountType = "PERCENTAGE" | "NOMINAL" | "FREE_NIGHTS";

export interface Voucher {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  description?: string | null;
  discount_type: VoucherDiscountType;
  discount_value: number;
  max_discount?: number | null;
  quota?: number | null;
  used_count: number;
  starts_at: string;
  expires_at: string;
  is_active: boolean;
  new_user_only: boolean;
  created_at: string;
}

export interface VoucherFormInput {
  code: string;
  description?: string;
  discount_type: VoucherDiscountType;
  discount_value: number;
  expires_at: string;
  is_active?: boolean;
  max_discount?: number | null;
  name?: string;
  new_user_only?: boolean;
  quota?: number | null;
  starts_at: string;
}

export interface VoucherPreview {
  discountAmount: number;
  finalPrice: number;
  voucher: Voucher;
}

export interface UserVoucherSummary {
  vouchers: Voucher[];
}
