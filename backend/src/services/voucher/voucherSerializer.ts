import type { Voucher } from '@prisma/client';
import type { VoucherInput } from '../../validations/voucherValidation';

export const buildVoucherCreateData = (tenantId: string, data: VoucherInput) => ({
  ...buildVoucherUpdateData(data),
  tenantId,
});

export const buildVoucherUpdateData = (data: VoucherInput) => {
  return {
    code: normalizeVoucherCode(data.code),
    description: data.description || null,
    discount_type: data.discount_type,
    discount_value: data.discount_value,
    expires_at: normalizeEndDate(data.expires_at),
    is_active: data.is_active ?? true,
    max_discount: data.max_discount || null,
    name: data.name || normalizeVoucherCode(data.code),
    new_user_only: data.new_user_only ?? false,
    quota: data.quota || null,
    starts_at: normalizeStartDate(data.starts_at),
  };
};

export const serializeVoucher = (voucher: Voucher) => ({ ...voucher, code: voucher.code });

export const normalizeVoucherCode = (code: string) => code.trim().toUpperCase();

export const buildNoVoucherResult = (subtotal: number) => ({
  discountAmount: 0,
  subtotalPrice: subtotal,
  totalPrice: subtotal,
  voucherId: null,
});

const normalizeStartDate = (value: string) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const normalizeEndDate = (value: string) => {
  const date = new Date(value);
  date.setHours(23, 59, 59, 999);
  return date;
};
