import { snap } from '../config/midtrans';
import { sendPaymentConfirmationEmail } from '../utils/emailService';
import { findOrderForPayment, updatePaymentStatus } from './midtrans/midtransQueries';
import { resolveOrderStatus } from './midtrans/midtransStatus';
import { buildSnapParameter } from './midtrans/snapPayload';
import type { MidtransStatusResponse, NotificationData } from './midtrans/midtransTypes';

export const createSnapTransaction = async (orderId: string, totalPrice: number, nights: number, userName: string, userEmail: string, userPhone: string, propertyName: string, roomType: string, roomId: string) => {
  const input = { orderId, totalPrice, nights, userName, userEmail, userPhone, propertyName, roomType, roomId };
  const transaction = await snap.createTransaction(buildSnapParameter(input));
  return { token: transaction.token, redirectUrl: transaction.redirect_url };
};

export const handleNotification = async (notificationData: NotificationData) => {
  const statusResponse = await getMidtransStatus(notificationData);
  const order = await findOrderForPayment(statusResponse.order_id);
  if (!order) return;
  if (order.payment_method !== 'MIDTRANS') return;
  const newStatus = resolveOrderStatus(order.status, statusResponse);
  if (newStatus === order.status) return;
  await updatePaymentStatus(order.id, newStatus, statusResponse.transaction_id);
  if (newStatus === 'PROCESSED') await handleProcessedPayment(order.user.email, order.order_number);
};

const getMidtransStatus = (notificationData: NotificationData): Promise<MidtransStatusResponse> =>
  snap.transaction.notification(notificationData);
const handleProcessedPayment = async (email: string, orderNumber: string) => {
  await notifyPaymentConfirmed(email, orderNumber);
};
const notifyPaymentConfirmed = (email: string, orderNumber: string) =>
  sendPaymentConfirmationEmail(email, orderNumber).catch(() => {});
