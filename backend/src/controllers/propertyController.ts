import { Request, Response } from 'express';
import * as propertyService from '../services/propertyService';
import { getPublicRoomAvailability } from '../services/publicAvailabilityService';
import { geocodeAddress } from '../services/locationIqService';
import { sendSuccess, sendError } from '../utils/response';
import type { PropertyFilters } from '../services/propertyQueryService';

interface ApiError {
  message?: string;
  statusCode?: number;
  issues?: Array<{ message?: string }>;
}

interface PropertyDetailQuery {
  check_in_date?: string;
  check_out_date?: string;
}

interface PublicAvailabilityQuery {
  start_date?: unknown;
  end_date?: unknown;
}

const getErrorMessage = (err: ApiError) => err?.issues?.[0]?.message || err.message || 'Terjadi kesalahan internal';
const getStatusCode = (err: ApiError, defaultCode: number) => err?.statusCode || defaultCode;

export const listPropertiesController = async (req: Request, res: Response) => {
  try {
    const result = await propertyService.getProperties(req.query as PropertyFilters);
    return sendSuccess(res, result, 'Data properti berhasil diambil');
  } catch (err: unknown) {
    const error = err as ApiError;
    return sendError(res, getErrorMessage(error), getStatusCode(error, 500));
  }
};

export const getPropertyDetailController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const property = await propertyService.getPropertyDetail(id, req.query as PropertyDetailQuery);
    return sendSuccess(res, property, 'Detail properti berhasil diambil');
  } catch (err: unknown) {
    const error = err as ApiError;
    return sendError(res, getErrorMessage(error), getStatusCode(error, 404));
  }
};

export const getCategoriesController = async (_req: Request, res: Response) => {
  try {
    const categories = await propertyService.getCategories();
    return sendSuccess(res, categories, 'Kategori berhasil diambil');
  } catch (err: unknown) {
    const error = err as ApiError;
    return sendError(res, getErrorMessage(error), getStatusCode(error, 500));
  }
};

export const getPublicRoomAvailabilityController = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params as { roomId: string };
    const data = await getPublicRoomAvailability(roomId, req.query as PublicAvailabilityQuery);
    return sendSuccess(res, data, 'Ketersediaan kamar berhasil diambil');
  } catch (err: unknown) {
    const error = err as ApiError;
    return sendError(res, getErrorMessage(error), getStatusCode(error, 500));
  }
};

export const geocodePropertyLocationController = async (req: Request, res: Response) => {
  try {
    const data = await geocodeAddress(String(req.query.address || ''));
    return sendSuccess(res, data, 'Lokasi berhasil ditemukan');
  } catch (err: unknown) {
    const error = err as ApiError;
    return sendError(res, getErrorMessage(error), getStatusCode(error, 500));
  }
};
