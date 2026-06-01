import { api } from "./api";
import type { ApiResponse, Order } from "@/types";

export const userOrderActionService = {
  async cancelManualOrder(orderId: string): Promise<Order> {
    const response = await api.patch<ApiResponse<Order>>(`/orders/${orderId}/cancel`);
    return response.data.data;
  },
};
