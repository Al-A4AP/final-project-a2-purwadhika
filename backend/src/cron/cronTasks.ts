import { sendBookingReminderEmail, sendCancellationEmail } from '../utils/emailService';
import { cancelOrder, completeOrder, findCheckInReminderOrders, findExpiredUnpaidOrders, findProcessedOrdersAfterCheckout } from './cronQueries';
import { getCheckInReminderRange } from './cronRanges';
import type { ExpiredOrder, ProcessedOrder, ReminderOrder } from './cronQueries';

export const cancelExpiredUnpaidOrders = async () => {
  const now = new Date();
  const orders = await findExpiredUnpaidOrders(now);
  await Promise.all(orders.map((order) => cancelExpiredOrder(order, now)));
};

export const completeProcessedOrders = async () => {
  const now = new Date();
  const orders = await findProcessedOrdersAfterCheckout(now);
  await Promise.all(orders.map((order) => completeProcessedOrder(order, now)));
};

export const sendCheckInReminders = async () => {
  const orders = await findCheckInReminderOrders(getCheckInReminderRange());
  await Promise.all(orders.map(sendReminderEmail));
};

const cancelExpiredOrder = async (order: ExpiredOrder, now: Date) => {
  await cancelOrder(order.id, now);
  await sendCancellationEmail(order.user.email, order.order_number, 'Batas waktu pembayaran telah berakhir').catch(() => {});
};
const completeProcessedOrder = (order: ProcessedOrder, now: Date) => completeOrder(order.id, now);
const sendReminderEmail = (order: ReminderOrder) =>
  sendBookingReminderEmail(order.user.email, order.order_number, order.property.name).catch(() => {});
