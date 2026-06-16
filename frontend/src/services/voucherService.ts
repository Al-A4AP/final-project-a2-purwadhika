import { api } from './api';
import type { ApiResponse, UserVoucherSummary, Voucher, VoucherFormInput, VoucherPreview } from '@/types';

interface VoucherPreviewRequest {
  check_in_date?: string;
  check_out_date?: string;
  propertyId: string;
  roomId?: string;
  subtotal: number;
  total_nights?: number;
  voucher_code: string;
}

export const voucherService = {
  async assignVoucher(id: string, email: string): Promise<void> {
    await api.post(`/tenants/me/vouchers/${id}/assign`, { email });
  },
  async createTenantVoucher(data: VoucherFormInput): Promise<Voucher> {
    const res = await api.post<ApiResponse<Voucher>>('/tenants/me/vouchers', data);
    return res.data.data;
  },
  async deleteTenantVoucher(id: string): Promise<void> {
    await api.delete(`/tenants/me/vouchers/${id}`);
  },
  async getTenantVouchers(page = 1, limit = 10): Promise<{ data: Voucher[]; meta: { page: number; limit: number; total: number; totalPages: number; } }> {
    const res = await api.get<ApiResponse<{ data: Voucher[]; meta: { page: number; limit: number; total: number; totalPages: number; } }>>(`/tenants/me/vouchers?page=${page}&limit=${limit}`);
    return res.data.data;
  },
  async getUserVouchers(): Promise<UserVoucherSummary> {
    const res = await api.get<ApiResponse<UserVoucherSummary>>('/users/me/vouchers');
    return res.data.data;
  },
  async previewVoucher(data: VoucherPreviewRequest): Promise<VoucherPreview> {
    const res = await api.post<ApiResponse<VoucherPreview>>('/users/me/voucher-previews', data);
    return res.data.data;
  },
  async updateTenantVoucher(id: string, data: VoucherFormInput): Promise<Voucher> {
    const res = await api.patch<ApiResponse<Voucher>>(`/tenants/me/vouchers/${id}`, data);
    return res.data.data;
  },
};
