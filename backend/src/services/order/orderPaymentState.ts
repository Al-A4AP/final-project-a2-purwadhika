import { OrderStatus } from '@prisma/client';
import { createPaymentDeadline } from '../../constants/orderConstants';

export const buildPaymentState = (totalPrice: number) =>
  totalPrice <= 0
    ? {
        status: OrderStatus.PROCESSED,
        payment_verified_at: new Date(),
        expires_at: null,
      }
    : {
        status: OrderStatus.WAITING_PAYMENT,
        expires_at: createPaymentDeadline(),
      };

export const emptySnapData = () => ({
  snapRedirectUrl: null,
  snapToken: null,
});
