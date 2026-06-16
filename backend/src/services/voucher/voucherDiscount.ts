import { VoucherDiscountType, type Voucher } from '@prisma/client';
import { AppError } from '../../middlewares/errorHandler';
import type { StayDetailBreakdown } from '../pricingService';

export type VoucherPricing = {
  breakdown?: StayDetailBreakdown[];
  subtotal: number;
  totalNights: number;
};

export const calculateDiscount = (
  pricing: VoucherPricing,
  voucher: Pick<Voucher, 'discount_type' | 'discount_value' | 'max_discount'>,
) => {
  const raw = getRawDiscount(pricing, voucher);
  const capped = voucher.max_discount ? Math.min(raw, voucher.max_discount) : raw;
  if (voucher.discount_type === VoucherDiscountType.PERCENTAGE) {
    return Math.min(capped, Math.floor(pricing.subtotal * 0.9));
  }
  return Math.min(capped, pricing.subtotal);
};

export const getPayableTotal = (subtotal: number, discountAmount: number) =>
  Math.max(0, subtotal - discountAmount);

const getRawDiscount = (
  pricing: VoucherPricing,
  voucher: Pick<Voucher, 'discount_type' | 'discount_value'>,
) => {
  if (voucher.discount_type === VoucherDiscountType.FREE_NIGHTS) {
    return calculateFreeNightDiscount(pricing, voucher.discount_value);
  }
  if (voucher.discount_type === VoucherDiscountType.PERCENTAGE) {
    return Math.floor((pricing.subtotal * voucher.discount_value) / 100);
  }
  throw new AppError('Voucher nominal tidak didukung', 400);
};

const calculateFreeNightDiscount = (pricing: VoucherPricing, freeNights: number) => {
  const discountedNights = Math.min(freeNights, Math.max(1, pricing.totalNights));
  if (pricing.breakdown?.length) return sumCheapestNights(pricing.breakdown, discountedNights);
  return Math.floor((pricing.subtotal / Math.max(1, pricing.totalNights)) * discountedNights);
};

const sumCheapestNights = (breakdown: StayDetailBreakdown[], count: number) =>
  [...breakdown].sort((left, right) => left.price - right.price).slice(0, count).reduce((total, item) => total + item.price, 0);
