import { api } from './api';
import type { ApiResponse, UserVoucherSummary, Voucher, VoucherFormInput, VoucherPreview } from '@/types';

export const voucherService = {
  async createTenantVoucher(data: VoucherFormInput): Promise<Voucher> {
    const res = await api.post<ApiResponse<Voucher>>('/tenants/me/vouchers', data);
    return res.data.data;
  },
  async deleteTenantVoucher(id: string): Promise<void> {
    await api.delete(`/tenants/me/vouchers/${id}`);
  },
  async getTenantVouchers(): Promise<Voucher[]> {
    const res = await api.get<ApiResponse<Voucher[]>>('/tenants/me/vouchers');
    return res.data.data;
  },
  async getUserVouchers(): Promise<UserVoucherSummary> {
    const res = await api.get<ApiResponse<UserVoucherSummary>>('/users/me/vouchers');
    return res.data.data;
  },
  async previewVoucher(data: { propertyId: string; subtotal: number; voucher_code: string; total_nights?: number }): Promise<VoucherPreview> {
    const res = await api.post<ApiResponse<VoucherPreview>>('/users/me/voucher-previews', data);
    return res.data.data;
  },
  async updateTenantVoucher(id: string, data: VoucherFormInput): Promise<Voucher> {
    const res = await api.patch<ApiResponse<Voucher>>(`/tenants/me/vouchers/${id}`, data);
    return res.data.data;
  },
};
