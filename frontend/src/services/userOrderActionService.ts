import { api } from "./api";
import type { ApiResponse, Order } from "@/types";

export interface RetryMidtransResult {
  order: Order;
  snapToken?: string;
  snapRedirectUrl?: string;
}

export const userOrderActionService = {
  async cancelManualOrder(orderId: string): Promise<Order> {
    const response = await api.post<ApiResponse<Order>>(`/orders/${orderId}/cancellations`);
    return response.data.data;
  },
  async retryMidtransPayment(orderId: string): Promise<RetryMidtransResult> {
    const response = await api.post<ApiResponse<RetryMidtransResult>>(`/orders/${orderId}/payment-attempts`);
    return response.data.data;
  },
  async switchToManualPayment(orderId: string): Promise<Order> {
    const response = await api.patch<ApiResponse<Order>>(`/orders/${orderId}/payment-method`, { payment_method: "MANUAL" });
    return response.data.data;
  },
};
