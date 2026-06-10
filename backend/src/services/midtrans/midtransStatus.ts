import { OrderStatus } from '@prisma/client';
import type { MidtransStatusResponse } from './midtransTypes';

export const resolveOrderStatus = (currentStatus: OrderStatus, response: MidtransStatusResponse): OrderStatus => {
  if (!isPendingStatus(currentStatus)) return currentStatus;

  if (response.transaction_status === 'capture') return getCaptureStatus(response);
  if (response.transaction_status === 'settlement') return OrderStatus.PROCESSED;
  if (isCancelledTransaction(response.transaction_status)) return OrderStatus.CANCELLED;
  if (response.transaction_status === 'pending') return OrderStatus.WAITING_PAYMENT;
  
  return currentStatus;
};

const isPendingStatus = (status: OrderStatus) =>
  status === OrderStatus.WAITING_PAYMENT || status === OrderStatus.WAITING_CONFIRMATION;

const getCaptureStatus = (response: MidtransStatusResponse): OrderStatus =>
  response.fraud_status === 'accept' ? OrderStatus.PROCESSED : OrderStatus.WAITING_CONFIRMATION;

const isCancelledTransaction = (status?: string) => 
  ['cancel', 'deny', 'expire'].includes(status || '');
