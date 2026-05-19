import { api } from './api';
import type { ApiResponse, Order } from '@/types';

export interface CreateOrderPayload {
  propertyId: string;
  roomId: string;
  check_in_date: string;
  check_out_date: string;
  payment_method: 'MANUAL' | 'MIDTRANS';
}

export const orderService = {
  async createOrder(payload: CreateOrderPayload): Promise<{ order: Order; snapToken?: string; snapRedirectUrl?: string }> {
    const res = await api.post<ApiResponse<{ order: Order; snapToken?: string; snapRedirectUrl?: string }>>('/orders', payload);
    return res.data.data;
  },

  async getUserOrders(): Promise<Order[]> {
    const res = await api.get<ApiResponse<Order[]>>('/orders/user');
    return res.data.data;
  },

  async getTenantOrders(): Promise<Order[]> {
    const res = await api.get<ApiResponse<Order[]>>('/orders/tenant');
    return res.data.data;
  },

  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    const res = await api.patch<ApiResponse<Order>>(`/orders/${orderId}/status`, { status });
    return res.data.data;
  },

  async uploadPaymentProof(orderId: string, file: File): Promise<Order> {
    const formData = new FormData();
    formData.append('payment_proof', file);
    const res = await api.post<ApiResponse<Order>>(`/orders/${orderId}/payment-proof`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data.data;
  }
};
