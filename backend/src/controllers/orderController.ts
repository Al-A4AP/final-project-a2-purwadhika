import { Request, Response } from 'express';
import * as orderService from '../services/orderService';
import * as userOrderService from '../services/userOrderService';
import * as userMidtransOrder from '../services/order/userMidtransOrder';
import { sendSuccess, sendError } from '../utils/response';
import { uploadBuffer } from '../utils/cloudinaryUpload';
import { handleControllerError, handleWebhookError } from './controllerErrors';

export const createOrderCtrl = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id as string;
    const data = await orderService.createOrder({ ...req.body, userId });
    return sendSuccess(res, data, 'Pesanan berhasil dibuat', 201);
  } catch (err) { return handleControllerError(res, err); }
};

export const getUserOrdersCtrl = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id as string;
    const data = await userOrderService.getUserOrders(userId, buildUserOrderOptions(req.query));
    return sendSuccess(res, data, 'Daftar pesanan pengguna');
  } catch (err) { return handleControllerError(res, err); }
};

export const getTenantOrdersCtrl = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user!.id as string;
    const data = await orderService.getTenantOrders(tenantId, buildTenantOrderOptions(req.query));
    return sendSuccess(res, data, 'Daftar pesanan tenant');
  } catch (err) { return handleControllerError(res, err); }
};

export const updateOrderStatusCtrl = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user!.id as string;
    const { id } = req.params as { id: string };
    const { status } = req.body;
    const data = await orderService.updateOrderStatus(id, tenantId, status);
    return sendSuccess(res, data, 'Status pesanan diperbarui');
  } catch (err) { return handleControllerError(res, err); }
};

export const uploadPaymentProofCtrl = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id as string;
    const { id } = req.params as { id: string };
    if (!req.file) return sendError(res, 'File bukti pembayaran wajib diupload', 400);

    const { url } = await uploadBuffer(req.file.buffer, 'proprent/payments');
    const data = await orderService.uploadPaymentProof(id, userId, url);

    return sendSuccess(res, data, 'Bukti pembayaran berhasil diupload');
  } catch (err) { return handleControllerError(res, err); }
};

export const retryMidtransPaymentCtrl = async (req: Request, res: Response) => {
  try {
    const data = await userMidtransOrder.retryUserMidtransPayment(req.params.id as string, req.user!.id as string);
    return sendSuccess(res, data, 'Pembayaran Midtrans siap dibuka ulang');
  } catch (err) { return handleControllerError(res, err); }
};

export const switchPaymentToManualCtrl = async (req: Request, res: Response) => {
  try {
    const data = await userMidtransOrder.switchUserMidtransToManual(req.params.id as string, req.user!.id as string);
    return sendSuccess(res, data, 'Metode pembayaran diubah ke manual transfer');
  } catch (err) { return handleControllerError(res, err); }
};

export const midtransNotificationCtrl = async (req: Request, res: Response) => {
  try {
    const notificationData = req.body;
    await orderService.handleMidtransNotification(notificationData);
    res.status(200).json({ status: 'ok' }); // Midtrans expects 200 OK
  } catch {
    return handleWebhookError(res);
  }
};

const buildUserOrderOptions = (query: Request['query']) => {
  const { orderNumber, status, startDate, endDate, sortBy, sortOrder, page, limit } = query;
  return { orderNumber: orderNumber as string, status: status as string, startDate: startDate as string,
    endDate: endDate as string, sortBy: sortBy as string, sortOrder: sortOrder as 'asc' | 'desc',
    page: toOptionalNumber(page), limit: toOptionalNumber(limit) };
};

const buildTenantOrderOptions = (query: Request['query']) => {
  const { propertyId, status, startDate, endDate, sortBy, sortOrder, page, limit } = query;
  return { propertyId: propertyId as string, status: status as string, startDate: startDate as string,
    endDate: endDate as string, sortBy: sortBy as string, sortOrder: sortOrder as 'asc' | 'desc',
    page: toOptionalNumber(page), limit: toOptionalNumber(limit) };
};

const toOptionalNumber = (value: unknown) =>
  value ? Number(value) : undefined;
