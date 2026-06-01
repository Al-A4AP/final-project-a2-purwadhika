import { OrderStatus, PaymentMethod, type Prisma } from '@prisma/client';
import prisma from '../../config/prisma';
import { createPaymentDeadline } from '../../constants/orderConstants';
import { AppError } from '../../middlewares/errorHandler';
import { createSnapTransaction } from '../midtransService';
import { buildRetryPaymentOrderId } from '../midtrans/paymentOrderId';
import { getValidatedStayDetails } from '../pricingService';

const include = { user: true, property: true, room: true };

export const retryUserMidtransPayment = async (orderId: string, userId: string) => {
  const order = await getActionableOrder(orderId, userId);
  const updated = await prepareRetryOrder(order);
  const snap = await createSnap(updated, buildRetryPaymentOrderId(updated.id));
  return { order: updated, snapToken: snap.token, snapRedirectUrl: snap.redirectUrl };
};

export const switchUserMidtransToManual = async (orderId: string, userId: string) => {
  const order = await getActionableOrder(orderId, userId);
  const data = await buildManualSwitchData(order);
  return updateOrder(order.id, data);
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
};

const isActionableStatus = (status: OrderStatus) =>
  status === OrderStatus.WAITING_PAYMENT || status === OrderStatus.CANCELLED;

const prepareRetryOrder = (order: MidtransOrder) =>
  order.status === OrderStatus.CANCELLED ? reopenMidtransOrder(order) : refreshMidtransOrder(order);

const refreshMidtransOrder = (order: MidtransOrder) => {
  assertFutureStay(order.check_in_date);
  return updateOrder(order.id, { expires_at: createPaymentDeadline(), midtrans_transaction_id: null });
};

const reopenMidtransOrder = async (order: MidtransOrder) => {
  const totalPrice = await getCurrentValidPrice(order);
  return updateOrder(order.id, buildReopenData(PaymentMethod.MIDTRANS, totalPrice));
};

const buildManualSwitchData = async (order: MidtransOrder): Promise<Prisma.OrderUpdateInput> => {
  if (order.status !== OrderStatus.CANCELLED) return buildWaitingManualData();
  return buildReopenData(PaymentMethod.MANUAL, await getCurrentValidPrice(order));
};

const buildWaitingManualData = (): Prisma.OrderUpdateInput => ({
  payment_method: PaymentMethod.MANUAL, payment_proof_url: null, midtrans_transaction_id: null, expires_at: createPaymentDeadline(),
});

const buildReopenData = (method: PaymentMethod, totalPrice: number): Prisma.OrderUpdateInput => ({
  status: OrderStatus.WAITING_PAYMENT, payment_method: method, payment_proof_url: null,
  midtrans_transaction_id: null, canceled_at: null, expires_at: createPaymentDeadline(), total_price: totalPrice,
});

const getCurrentValidPrice = async (order: MidtransOrder) => {
  assertFutureStay(order.check_in_date);
  try { return (await getValidatedStayDetails(order.roomId, order.check_in_date, order.check_out_date)).totalPrice; }
  catch (err) { throw new AppError(getErrorMessage(err), 400); }
};

const assertFutureStay = (checkIn: Date) => {
  if (checkIn < todayUtc()) throw new AppError('Tanggal check-in pesanan sudah lewat', 400);
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

const getErrorMessage = (err: unknown) =>
  err instanceof Error ? err.message : 'Pesanan tidak tersedia untuk dibayar ulang';

type UserMidtransOrder = Awaited<ReturnType<typeof findUserMidtransOrder>>;
type MidtransOrder = NonNullable<UserMidtransOrder>;
