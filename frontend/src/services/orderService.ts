import { api } from './api';
import type { ApiResponse, Order, PaginationMeta } from '@/types';

export interface CreateOrderPayload {
  propertyId: string;
  roomId: string;
  check_in_date: string;
  check_out_date: string;
  payment_method: 'MANUAL' | 'MIDTRANS';
  adults: number;
  children: number;
  babies: number;
}

export const orderService = {
  async createOrder(payload: CreateOrderPayload): Promise<{ order: Order; snapToken?: string; snapRedirectUrl?: string }> {
    const res = await api.post<ApiResponse<{ order: Order; snapToken?: string; snapRedirectUrl?: string }>>('/orders', payload);
    return res.data.data;
  },

  async getUserOrders(params?: {
    orderNumber?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ orders: Order[]; pagination: PaginationMeta }> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== '') query.append(key, String(val));
      });
    }
    const res = await api.get<ApiResponse<{ orders: Order[]; pagination: PaginationMeta }>>(`/orders/user?${query.toString()}`);
    return res.data.data;
  },

  async getTenantOrders(params?: {
    propertyId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }): Promise<{ orders: Order[]; pagination: PaginationMeta }> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined) query.append(key, String(val));
      });
    }
    const res = await api.get<ApiResponse<{ orders: Order[]; pagination: PaginationMeta }>>(`/orders/tenant?${query.toString()}`);
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
