import { Request, Response } from 'express';
import * as propertyService from '../services/propertyService';
import { getPublicRoomAvailability } from '../services/publicAvailabilityService';
import { geocodeAddress } from '../services/locationIqService';
import { sendSuccess, sendError } from '../utils/response';

export const listPropertiesController = async (req: Request, res: Response) => {
  try {
    const result = await propertyService.getProperties(req.query as any);
    return sendSuccess(res, result, 'Data properti berhasil diambil');
  } catch (err: any) {
    return sendError(res, err.message, err.statusCode || 500);
  }
};

export const getPropertyDetailController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const property = await propertyService.getPropertyDetail(id, req.query as any);
    return sendSuccess(res, property, 'Detail properti berhasil diambil');
  } catch (err: any) {
    return sendError(res, err.message, err.statusCode || 404);
  }
};

export const getCategoriesController = async (_req: Request, res: Response) => {
  try {
    const categories = await propertyService.getCategories();
    return sendSuccess(res, categories, 'Kategori berhasil diambil');
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
};

export const getPublicRoomAvailabilityController = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params as { roomId: string };
    const data = await getPublicRoomAvailability(roomId, req.query);
    return sendSuccess(res, data, 'Ketersediaan kamar berhasil diambil');
  } catch (err: any) {
    return sendError(res, err.message, err.statusCode || 500);
  }
};

export const geocodePropertyLocationController = async (req: Request, res: Response) => {
  try {
    const data = await geocodeAddress(String(req.query.address || ''));
    return sendSuccess(res, data, 'Lokasi berhasil ditemukan');
  } catch (err: any) {
    return sendError(res, err.message, err.statusCode || 500);
  }
};
