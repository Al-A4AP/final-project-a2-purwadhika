import { Request, Response } from 'express';
import * as orderService from '../services/orderService';
import { sendSuccess, sendError } from '../utils/response';
import { uploadBuffer } from '../utils/cloudinaryUpload';

export const createOrderCtrl = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id as string;
    const data = await orderService.createOrder({ ...req.body, userId });
    return sendSuccess(res, data, 'Pesanan berhasil dibuat', 201);
  } catch (err: any) { return sendError(res, err.message, err.statusCode || 500); }
};

export const getUserOrdersCtrl = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id as string;
    const data = await orderService.getUserOrders(userId);
    return sendSuccess(res, data, 'Daftar pesanan pengguna');
  } catch (err: any) { return sendError(res, err.message, err.statusCode || 500); }
};

export const getTenantOrdersCtrl = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user!.id as string;
    const data = await orderService.getTenantOrders(tenantId);
    return sendSuccess(res, data, 'Daftar pesanan tenant');
  } catch (err: any) { return sendError(res, err.message, err.statusCode || 500); }
};

export const updateOrderStatusCtrl = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user!.id as string;
    const { id } = req.params as { id: string };
    const { status } = req.body;
    const data = await orderService.updateOrderStatus(id, tenantId, status);
    return sendSuccess(res, data, 'Status pesanan diperbarui');
  } catch (err: any) { return sendError(res, err.message, err.statusCode || 500); }
};

export const uploadPaymentProofCtrl = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id as string;
    const { id } = req.params as { id: string };
    if (!req.file) return sendError(res, 'File bukti pembayaran wajib diupload', 400);

    const { url } = await uploadBuffer(req.file.buffer, 'proprent/payments');
    const data = await orderService.uploadPaymentProof(id, userId, url);

    return sendSuccess(res, data, 'Bukti pembayaran berhasil diupload');
  } catch (err: any) { return sendError(res, err.message, err.statusCode || 500); }
};

export const midtransNotificationCtrl = async (req: Request, res: Response) => {
  try {
    const notificationData = req.body;
    await orderService.handleMidtransNotification(notificationData);
    res.status(200).json({ status: 'ok' }); // Midtrans expects 200 OK
  } catch { 
    res.status(500).json({ error: 'Server error' }); 
  }
};
