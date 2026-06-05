import { Request, Response } from 'express';
import * as propertyService from '../services/propertyService';
import { getPublicRoomAvailability } from '../services/publicAvailabilityService';
import { geocodeAddress, reverseGeocodeCoordinates } from '../services/locationIqService';
import { sendSuccess } from '../utils/response';
import { handleControllerError } from './controllerErrors';
import {
  geocodeQuerySchema, propertyDetailQuerySchema, propertyListQuerySchema,
  publicAvailabilityQuerySchema, reverseGeocodeQuerySchema,
} from '../validations/queryValidation';

export const listPropertiesController = async (req: Request, res: Response) => {
  try {
    const result = await propertyService.getProperties(propertyListQuerySchema.parse(req.query));
    return sendSuccess(res, result, 'Data properti berhasil diambil');
  } catch (err: unknown) {
    return handleControllerError(res, err);
  }
};

export const getPropertyDetailController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const property = await propertyService.getPropertyDetail(id, propertyDetailQuerySchema.parse(req.query));
    return sendSuccess(res, property, 'Detail properti berhasil diambil');
  } catch (err: unknown) {
    return handleControllerError(res, err, 404);
  }
};

export const getCategoriesController = async (_req: Request, res: Response) => {
  try {
    const categories = await propertyService.getCategories();
    return sendSuccess(res, categories, 'Kategori berhasil diambil');
  } catch (err: unknown) {
    return handleControllerError(res, err);
  }
};

export const getPublicRoomAvailabilityController = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params as { roomId: string };
    const data = await getPublicRoomAvailability(roomId, publicAvailabilityQuerySchema.parse(req.query));
    return sendSuccess(res, data, 'Ketersediaan kamar berhasil diambil');
  } catch (err: unknown) {
    return handleControllerError(res, err);
  }
};

export const geocodePropertyLocationController = async (req: Request, res: Response) => {
  try {
    const { address } = geocodeQuerySchema.parse(req.query);
    const data = await geocodeAddress(address);
    return sendSuccess(res, data, 'Lokasi berhasil ditemukan');
  } catch (err: unknown) {
    return handleControllerError(res, err);
  }
};

export const reverseGeocodeLocationController = async (req: Request, res: Response) => {
  try {
    const { lat, lon } = reverseGeocodeQuerySchema.parse(req.query);
    const data = await reverseGeocodeCoordinates(lat, lon);
    return sendSuccess(res, data, 'Kota berhasil ditemukan');
  } catch (err: unknown) {
    return handleControllerError(res, err);
  }
};
