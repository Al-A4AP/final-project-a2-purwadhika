import { snap } from '../config/midtrans';
import prisma from '../config/prisma';
import { sendPaymentConfirmationEmail } from '../utils/emailService';

export const createSnapTransaction = async (
  orderId: string,
  totalPrice: number,
  nights: number,
  userName: string,
  userEmail: string,
  userPhone: string,
  propertyName: string,
  roomType: string,
  roomId: string,
) => {
  const parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount: totalPrice,
    },
    customer_details: {
      first_name: userName,
      email: userEmail,
      phone: userPhone || '',
    },
    item_details: [{
      id: roomId,
      price: Math.round(totalPrice / nights),
      quantity: nights,
      name: `${propertyName} - ${roomType} (${nights} Malam)`,
    }],
  };

  const transaction = await snap.createTransaction(parameter);
  return {
    token: transaction.token,
    redirectUrl: transaction.redirect_url,
  };
};

export const handleNotification = async (notificationData: any) => {
  const statusResponse = await snap.transaction.notification(notificationData);
  const orderId = statusResponse.order_id;
  const txStatus = statusResponse.transaction_status;
  const fraudStatus = statusResponse.fraud_status;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: true },
  });
  if (!order) return;

  let newStatus = order.status;

  if (txStatus === 'capture') {
    newStatus = fraudStatus === 'accept' ? 'PROCESSED' : 'WAITING_CONFIRMATION';
  } else if (txStatus === 'settlement') {
    newStatus = 'PROCESSED';
  } else if (['cancel', 'deny', 'expire'].includes(txStatus)) {
    newStatus = 'CANCELLED';
  } else if (txStatus === 'pending') {
    newStatus = 'WAITING_PAYMENT';
  }

  if (newStatus !== order.status) {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: newStatus as any,
        midtrans_transaction_id: statusResponse.transaction_id,
        payment_verified_at: newStatus === 'PROCESSED' ? new Date() : null,
      },
    });

    if (newStatus === 'PROCESSED') {
      await sendPaymentConfirmationEmail(order.user.email, order.order_number).catch(() => {});
    }
  }
};
