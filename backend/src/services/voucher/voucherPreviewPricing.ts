import prisma from '../../config/prisma';
import { AppError } from '../../middlewares/errorHandler';
import { getValidatedStayDetails } from '../pricingService';
import type { VoucherPreviewInput } from '../../validations/voucherValidation';
import type { VoucherPricing } from './voucherDiscount';

export const getVoucherPreviewPricing = async (
  input: VoucherPreviewInput,
): Promise<VoucherPricing> => {
  if (!hasStayPreviewInput(input)) return buildAveragePricing(input);
  await assertRoomBelongsToProperty(input.propertyId, input.roomId);
  const stay = await getValidatedStayDetails(input.roomId, new Date(input.check_in_date), new Date(input.check_out_date));
  return { breakdown: stay.breakdown, subtotal: stay.totalPrice, totalNights: stay.nights };
};

const hasStayPreviewInput = (input: VoucherPreviewInput): input is VoucherPreviewInput & {
  check_in_date: string;
  check_out_date: string;
  roomId: string;
} => Boolean(input.roomId && input.check_in_date && input.check_out_date);

const buildAveragePricing = (input: VoucherPreviewInput): VoucherPricing => ({
  subtotal: input.subtotal,
  totalNights: input.total_nights,
});

const assertRoomBelongsToProperty = async (propertyId: string, roomId: string) => {
  const room = await prisma.room.findFirst({ where: { id: roomId, propertyId, deleted_at: null }, select: { id: true } });
  if (!room) throw new AppError('Kamar tidak ditemukan pada properti ini', 404);
};
