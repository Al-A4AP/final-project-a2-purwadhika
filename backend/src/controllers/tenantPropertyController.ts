import { Request, Response } from 'express';
import * as svc from '../services/tenantPropertyService';
import { sendSuccess, sendError } from '../utils/response';
import { handleControllerError } from './controllerErrors';

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user!.id as string;
    const data = await svc.getDashboardStats(tenantId, { revenuePeriod: req.query.revenuePeriod as string });
    return sendSuccess(res, data, 'Dashboard berhasil diambil');
  } catch (err) { return handleControllerError(res, err); }
};

export const getPropertiesCtrl = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user!.id as string;
    const { search, categoryId, sortBy, sortOrder, page, limit } = req.query;
    const data = await svc.getTenantProperties(tenantId, {
      search: search as string,
      categoryId: categoryId as string,
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc',
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
    return sendSuccess(res, data, 'Properti berhasil diambil');
  } catch (err) { return handleControllerError(res, err); }
};

export const getPropertyCtrl = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const tenantId = req.user!.id as string;
    const data = await svc.getTenantPropertyById(id, tenantId);
    return sendSuccess(res, data, 'Detail properti berhasil diambil');
  } catch (err) { return handleControllerError(res, err); }
};

export const createPropertyCtrl = async (req: Request, res: Response) => {
  try {
    const tenantId = req.user!.id as string;
    const data = await svc.createProperty(tenantId, req.body, req.file);
    return sendSuccess(res, data, 'Properti berhasil dibuat', 201);
  } catch (err) { return handleControllerError(res, err); }
};

export const updatePropertyCtrl = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const tenantId = req.user!.id as string;
    const data = await svc.updateProperty(id, tenantId, req.body, req.file);
    return sendSuccess(res, data, 'Properti berhasil diperbarui');
  } catch (err) { return handleControllerError(res, err); }
};

export const deletePropertyCtrl = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const tenantId = req.user!.id as string;
    await svc.deleteProperty(id, tenantId);
    return sendSuccess(res, null, 'Properti berhasil dihapus');
  } catch (err) { return handleControllerError(res, err); }
};

export const addImageCtrl = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const tenantId = req.user!.id as string;
    if (!req.file) return sendError(res, 'File gambar wajib diupload', 400);
    const data = await svc.addPropertyImage(id, tenantId, req.file);
    return sendSuccess(res, data, 'Gambar berhasil diupload', 201);
  } catch (err) { return handleControllerError(res, err); }
};

export const deleteImageCtrl = async (req: Request, res: Response) => {
  try {
    const { id, imageId } = req.params as { id: string; imageId: string };
    const tenantId = req.user!.id as string;
    await svc.deletePropertyImage(id, imageId, tenantId);
    return sendSuccess(res, null, 'Gambar berhasil dihapus');
  } catch (err) { return handleControllerError(res, err); }
};
