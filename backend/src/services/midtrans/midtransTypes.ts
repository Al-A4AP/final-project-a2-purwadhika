import type { OrderStatus } from '@prisma/client';

export interface SnapTransactionInput {
  orderId: string;
  totalPrice: number;
  nights: number;
  userName: string;
  userEmail: string;
  userPhone: string;
  propertyName: string;
  roomType: string;
  roomId: string;
}

export interface MidtransStatusResponse {
  order_id: string;
  transaction_id?: string;
  transaction_status?: string;
  fraud_status?: string;
}

export type NotificationData = Record<string, unknown>;
export type PaymentStatus = OrderStatus;
