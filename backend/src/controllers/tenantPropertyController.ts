import { Request, Response } from 'express';
import * as svc from '../services/tenantPropertyService';
import { sendSuccess, sendError } from '../utils/response';

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user!.id as string;
    const data = await svc.getDashboardStats(tenantId);
    return sendSuccess(res, data, 'Dashboard berhasil diambil');
  } catch (err: any) { return sendError(res, err.message, err.statusCode || 500); }
};

export const getPropertiesCtrl = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user!.id as string;
    const data = await svc.getTenantProperties(tenantId);
    return sendSuccess(res, data, 'Properti berhasil diambil');
  } catch (err: any) { return sendError(res, err.message, err.statusCode || 500); }
};

export const getPropertyCtrl = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const tenantId = req.user!.id as string;
    const data = await svc.getTenantPropertyById(id, tenantId);
    return sendSuccess(res, data, 'Detail properti berhasil diambil');
  } catch (err: any) { return sendError(res, err.message, err.statusCode || 500); }
};

export const createPropertyCtrl = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user!.id as string;
    const data = await svc.createProperty(tenantId, req.body, req.file);
    return sendSuccess(res, data, 'Properti berhasil dibuat', 201);
  } catch (err: any) { return sendError(res, err.message, err.statusCode || 500); }
};

export const updatePropertyCtrl = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const tenantId = req.user!.id as string;
    const data = await svc.updateProperty(id, tenantId, req.body, req.file);
    return sendSuccess(res, data, 'Properti berhasil diperbarui');
  } catch (err: any) { return sendError(res, err.message, err.statusCode || 500); }
};

export const deletePropertyCtrl = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const tenantId = req.user!.id as string;
    await svc.deleteProperty(id, tenantId);
    return sendSuccess(res, null, 'Properti berhasil dihapus');
  } catch (err: any) { return sendError(res, err.message, err.statusCode || 500); }
};

export const addImageCtrl = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const tenantId = req.user!.id as string;
    if (!req.file) return sendError(res, 'File gambar wajib diupload', 400);
    const data = await svc.addPropertyImage(id, tenantId, req.file);
    return sendSuccess(res, data, 'Gambar berhasil diupload', 201);
  } catch (err: any) { return sendError(res, err.message, err.statusCode || 500); }
};

export const deleteImageCtrl = async (req: Request, res: Response) => {
  try {
    const { id, imageId } = req.params as { id: string; imageId: string };
    const tenantId = req.user!.id as string;
    await svc.deletePropertyImage(id, imageId, tenantId);
    return sendSuccess(res, null, 'Gambar berhasil dihapus');
  } catch (err: any) { return sendError(res, err.message, err.statusCode || 500); }
};
