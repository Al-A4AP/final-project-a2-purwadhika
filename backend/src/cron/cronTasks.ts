import { sendBookingReminderEmail, sendCancellationEmail } from '../utils/emailService';
import { getManualConfirmationCutoff } from '../constants/orderConstants';
import { cancelOrder, completeOrder, findCheckInReminderOrders, findExpiredManualConfirmationOrders, findExpiredUnpaidOrders, findProcessedOrdersAfterCheckout, updateCheckInReminderSent } from './cronQueries';
import { getCheckInReminderRange } from './cronRanges';
import type { ExpiredManualConfirmationOrder, ExpiredOrder, ProcessedOrder, ReminderOrder } from './cronQueries';

export const cancelExpiredUnpaidOrders = async () => {
  const now = new Date();
  const [unpaid, manualConfirmations] = await Promise.all([
    findExpiredUnpaidOrders(now),
    findExpiredManualConfirmationOrders(getManualConfirmationCutoff(now)),
  ]);
  await Promise.all([
    ...unpaid.map((order) => cancelExpiredOrder(order, now)),
    ...manualConfirmations.map((order) => cancelExpiredManualConfirmation(order, now)),
  ]);
};

export const completeProcessedOrders = async () => {
  const now = new Date();
  const orders = await findProcessedOrdersAfterCheckout(now);
  await Promise.all(orders.map((order) => completeProcessedOrder(order, now)));
};

export const sendCheckInReminders = async () => {
  const orders = await findCheckInReminderOrders(getCheckInReminderRange());
  const now = new Date();
  await Promise.allSettled(orders.map((order) => sendReminderEmail(order, now)));
};

export const cleanupExpiredRevokedTokens = async () => {
  const now = new Date();
  const { deleteExpiredRevokedTokens } = await import('./cronQueries');
  await deleteExpiredRevokedTokens(now);
};

const cancelExpiredOrder = async (order: ExpiredOrder, now: Date) => {
  await cancelOrder(order.id, now);
  await sendCancellationEmail(order.user.email, order.order_number, 'Batas waktu pembayaran telah berakhir').catch(() => {});
};
const cancelExpiredManualConfirmation = async (order: ExpiredManualConfirmationOrder, now: Date) => {
  await cancelOrder(order.id, now);
  await sendCancellationEmail(order.user.email, order.order_number, 'Batas waktu konfirmasi pembayaran telah berakhir').catch(() => {});
};
const completeProcessedOrder = (order: ProcessedOrder, now: Date) => completeOrder(order.id, now);
const sendReminderEmail = async (order: ReminderOrder, now: Date) => {
  await sendBookingReminderEmail(order.user.email, order.order_number, order.property.name);
  await updateCheckInReminderSent(order.id, now);
};
