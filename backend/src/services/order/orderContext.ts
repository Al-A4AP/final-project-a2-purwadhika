import { OrderStatus } from '@prisma/client';
import prisma from '../../config/prisma';
import { AppError } from '../../middlewares/errorHandler';
import { getValidatedStayDetails } from '../pricingService';
import { parseStayDates, validateDates } from './orderDateUtils';
import { pickGuestCounts } from './orderGuestUtils';
import type { CreateOrderData } from './orderTypes';

const MAX_ACTIVE_WAITING_PAYMENT_ORDERS = 3;

export const buildOrderContext = async (data: CreateOrderData) => {
  await validateUser(data.userId);
  await validateActiveWaitingPaymentOrders(data.userId);
  const dates = parseStayDates(data.check_in_date, data.check_out_date);
  validateDates(dates.checkIn, dates.checkOut);
  const stayDetails = await getStayPriceForRoom(
    data.roomId,
    dates.checkIn,
    dates.checkOut,
  );
  return { ...data, ...dates, guests: pickGuestCounts(data), nights: stayDetails.nights, stayDetails };
};

const validateUser = async (userId: string) => {
  const user = await prisma.user.findFirst({
    where: { id: userId, deleted_at: null },
  });
  if (!user) throw new AppError("User tidak ditemukan", 404);
  if (!user.verified_at) {
    throw new AppError("Akun Anda belum terverifikasi. Silakan verifikasi email Anda terlebih dahulu.", 403);
  }
};

const validateActiveWaitingPaymentOrders = async (userId: string) => {
  await cancelExpiredUserWaitingPayments(userId);
  const count = await prisma.order.count({ where: activeWaitingPaymentWhere(userId) });
  if (count >= MAX_ACTIVE_WAITING_PAYMENT_ORDERS) {
    throw new AppError("Anda masih memiliki 3 pesanan yang menunggu pembayaran. Selesaikan atau batalkan salah satu pesanan terlebih dahulu.", 400);
  }
};

const cancelExpiredUserWaitingPayments = (userId: string) =>
  prisma.order.updateMany({
    where: { userId, status: OrderStatus.WAITING_PAYMENT, expires_at: { lt: new Date() } },
    data: { status: OrderStatus.CANCELLED, canceled_at: new Date() },
  });

const getStayPriceForRoom = async (roomId: string, checkIn: Date, checkOut: Date) => {
  try { return await getValidatedStayDetails(roomId, checkIn, checkOut); }
  catch (err) { throw new AppError(getErrorMessage(err), 400); }
};

const activeWaitingPaymentWhere = (userId: string) => ({
  userId,
  status: OrderStatus.WAITING_PAYMENT,
  OR: [{ expires_at: null }, { expires_at: { gt: new Date() } }],
});

const getErrorMessage = (err: unknown) =>
  err instanceof Error ? err.message : "Tanggal menginap tidak valid";

export type OrderContext = Awaited<ReturnType<typeof buildOrderContext>>;
