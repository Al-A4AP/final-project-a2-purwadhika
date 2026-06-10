import { api } from './api';
import type { ApiResponse, Order, PaginationMeta } from '@/types';

type OrderListResponse = { orders: Order[]; pagination: PaginationMeta };
type CreateOrderResponse = { order: Order; snapToken?: string; snapRedirectUrl?: string };
type QueryValue = number | string | undefined;

export interface CreateOrderPayload {
  propertyId: string;
  roomId: string;
  check_in_date: string;
  check_out_date: string;
  payment_method: 'MANUAL' | 'MIDTRANS';
  booking_for_self: boolean;
  guest_name?: string;
  guest_legal_name: string;
  guest_phone: string;
  guest_email?: string;
  guest_ktp_address: string;
  guest_domicile_address?: string;
  referral_code?: string;
  voucher_code?: string;
  adults: number;
  children: number;
  babies: number;
}

export interface UserOrderParams {
  check_in_date?: string;
  check_out_date?: string;
  orderNumber?: string;
  limit?: number;
  page?: number;
  status?: string;
}

export interface TenantOrderParams {
  propertyId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

const appendQueryValue = (query: URLSearchParams, key: string, value: QueryValue, omitEmpty: boolean) => {
  if (value === undefined || (omitEmpty && value === '')) return;
  query.append(key, String(value));
};

const buildQueryString = <T extends object>(params: T | undefined, omitEmpty = false) => {
  const query = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => appendQueryValue(query, key, value as QueryValue, omitEmpty));
  return query.toString();
};

const fetchOrderList = async (path: string, query: string) => {
  const res = await api.get<ApiResponse<OrderListResponse>>(`${path}?${query}`);
  return res.data.data;
};

export const orderService = {
  async createOrder(payload: CreateOrderPayload): Promise<CreateOrderResponse> {
    const res = await api.post<ApiResponse<CreateOrderResponse>>('/orders', payload);
    return res.data.data;
  },

  async getUserOrders(params?: UserOrderParams): Promise<OrderListResponse> {
    const query = buildQueryString(params, true);
    return fetchOrderList('/users/me/orders', query);
  },

  async getTenantOrders(params?: TenantOrderParams): Promise<OrderListResponse> {
    const query = buildQueryString(params);
    return fetchOrderList('/tenants/me/orders', query);
  },

  async updateOrderStatus(orderId: string, status: string, payment_rejection_reason?: string): Promise<Order> {
    const res = await api.post<ApiResponse<Order>>(`/orders/${orderId}/status-transitions`, { status, payment_rejection_reason });
    return res.data.data;
  },

  async uploadPaymentProof(orderId: string, file: File): Promise<Order> {
    const formData = new FormData();
    formData.append('payment_proof', file);
    const res = await api.post<ApiResponse<Order>>(`/orders/${orderId}/payment-proof`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data.data;
  },

  async markRefundComplete(orderId: string): Promise<Order> {
    const res = await api.post<ApiResponse<Order>>(`/orders/${orderId}/refund-completions`);
    return res.data.data;
  }
};
