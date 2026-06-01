const RETRY_SEPARATOR = '--retry-';

export const buildRetryPaymentOrderId = (orderId: string) =>
  `${orderId}${RETRY_SEPARATOR}${Date.now()}`;

export const normalizePaymentOrderId = (paymentOrderId: string) =>
  paymentOrderId.split(RETRY_SEPARATOR)[0];
