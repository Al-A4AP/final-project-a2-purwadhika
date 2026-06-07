import type { Request, Response } from 'express';
import * as voucherService from '../services/voucherService';
import { sendSuccess } from '../utils/response';
import { handleControllerError } from './controllerErrors';

export const getTenantVouchersCtrl = async (req: Request, res: Response) => {
  try {
    const data = await voucherService.listTenantVouchers(req.user!.id);
    return sendSuccess(res, data, 'Daftar voucher tenant');
  } catch (err) { return handleControllerError(res, err); }
};

export const createTenantVoucherCtrl = async (req: Request, res: Response) => {
  try {
    const data = await voucherService.createTenantVoucher(req.user!.id, req.body);
    return sendSuccess(res, data, 'Voucher berhasil dibuat', 201);
  } catch (err) { return handleControllerError(res, err); }
};

export const updateTenantVoucherCtrl = async (req: Request, res: Response) => {
  try {
    const data = await voucherService.updateTenantVoucher(req.params.id as string, req.user!.id, req.body);
    return sendSuccess(res, data, 'Voucher berhasil diperbarui');
  } catch (err) { return handleControllerError(res, err); }
};

export const deleteTenantVoucherCtrl = async (req: Request, res: Response) => {
  try {
    await voucherService.deleteTenantVoucher(req.params.id as string, req.user!.id);
    return sendSuccess(res, null, 'Voucher berhasil dihapus');
  } catch (err) { return handleControllerError(res, err); }
};

export const getUserVouchersCtrl = async (req: Request, res: Response) => {
  try {
    const data = await voucherService.getUserVoucherSummary(req.user!.id);
    return sendSuccess(res, data, 'Voucher pengguna');
  } catch (err) { return handleControllerError(res, err); }
};

export const previewUserVoucherCtrl = async (req: Request, res: Response) => {
  try {
    const data = await voucherService.previewUserVoucher(req.user!.id, req.body);
    return sendSuccess(res, data, 'Preview voucher');
  } catch (err) { return handleControllerError(res, err); }
};
