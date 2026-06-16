import { OrderStatus, PaymentMethod, type Prisma } from '@prisma/client';
import prisma from '../../config/prisma';
import { createPaymentDeadline } from '../../constants/orderConstants';
import { AppError } from '../../middlewares/errorHandler';
import { createSnapTransaction } from '../midtransService';
import { buildRetryPaymentOrderId } from '../midtrans/paymentOrderId';

const include = { user: true, property: true, room: true };

export const retryUserMidtransPayment = async (orderId: string, userId: string) => {
  const order = await getActionableOrder(orderId, userId);
  const updated = await refreshMidtransOrder(order);
  const snap = await createSnap(updated, buildRetryPaymentOrderId(updated.id));
  return { order: updated, snapToken: snap.token, snapRedirectUrl: snap.redirectUrl };
};

export const switchUserMidtransToManual = async (orderId: string, userId: string) => {
  const order = await getActionableOrder(orderId, userId);
  return updateOrder(order.id, buildWaitingManualData());
};

const getActionableOrder = async (orderId: string, userId: string) => {
  const order = await findUserMidtransOrder(orderId, userId);
  assertActionableMidtransOrder(order);
  return order;
};

const findUserMidtransOrder = (orderId: string, userId: string) =>
  prisma.order.findFirst({ where: { id: orderId, userId }, include });

const assertActionableMidtransOrder = (order: UserMidtransOrder) => {
  if (!order) throw new AppError('Pesanan tidak ditemukan atau akses ditolak', 404);
  if (order.payment_method !== PaymentMethod.MIDTRANS) throw new AppError('Aksi ini hanya untuk pembayaran Midtrans', 400);
  if (!isActionableStatus(order.status)) throw new AppError('Status pesanan tidak bisa dibayar ulang', 400);
  assertPaymentWindowOpen(order);
  assertFutureStay(order.check_in_date);
};

const isActionableStatus = (status: OrderStatus) =>
  status === OrderStatus.WAITING_PAYMENT;

const refreshMidtransOrder = (order: MidtransOrder) => {
  return updateOrder(order.id, { expires_at: createPaymentDeadline(), midtrans_transaction_id: null });
};

const buildWaitingManualData = (): Prisma.OrderUpdateInput => ({
  payment_method: PaymentMethod.MANUAL, payment_proof_url: null, midtrans_transaction_id: null, expires_at: createPaymentDeadline(),
});

const assertFutureStay = (checkIn: Date) => {
  if (checkIn < todayUtc()) throw new AppError('Tanggal check-in pesanan sudah lewat', 400);
};

const assertPaymentWindowOpen = (order: MidtransOrder) => {
  if (!order.expires_at || order.expires_at > new Date()) return;
  throw new AppError('Batas waktu pembayaran telah berakhir', 400);
};

const createSnap = (order: MidtransOrder, paymentOrderId: string) =>
  createSnapTransaction(paymentOrderId, order.total_price, getNights(order), order.user.name, order.user.email, order.user.phone || '', order.property.name, order.room.room_type, order.roomId);

const updateOrder = (orderId: string, data: Prisma.OrderUpdateInput) =>
  prisma.order.update({ where: { id: orderId }, data, include });

const getNights = (order: MidtransOrder) =>
  Math.ceil((order.check_out_date.getTime() - order.check_in_date.getTime()) / 86400000);

const todayUtc = () => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return today;
};

type UserMidtransOrder = Awaited<ReturnType<typeof findUserMidtransOrder>>;
type MidtransOrder = NonNullable<UserMidtransOrder>;
