import type { OrderStatus } from '@prisma/client';
import type { MidtransStatusResponse } from './midtransTypes';

export const resolveOrderStatus = (currentStatus: OrderStatus, response: MidtransStatusResponse): OrderStatus => {
  if (response.transaction_status === 'capture') return getCaptureStatus(response);
  if (response.transaction_status === 'settlement') return 'PROCESSED';
  if (isCancelledTransaction(response.transaction_status)) return 'CANCELLED';
  if (response.transaction_status === 'pending') return 'WAITING_PAYMENT';
  return currentStatus;
};

const getCaptureStatus = (response: MidtransStatusResponse): OrderStatus =>
  response.fraud_status === 'accept' ? 'PROCESSED' : 'WAITING_CONFIRMATION';
const isCancelledTransaction = (status?: string) => ['cancel', 'deny', 'expire'].includes(status || '');
