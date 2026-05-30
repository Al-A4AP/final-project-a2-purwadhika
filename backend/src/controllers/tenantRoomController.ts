import { Request, Response } from 'express';
import * as svc from '../services/tenantRoomService';
import { sendSuccess, sendError } from '../utils/response';

export const getRoomsCtrl = async (req: Request, res: Response) => {
  try {
    const { propertyId } = req.params as { propertyId: string };
    const tenantId = req.user!.id as string;
    const data = await svc.getRooms(propertyId, tenantId);
    return sendSuccess(res, data, 'Kamar berhasil diambil');
  } catch (err: any) { return sendError(res, err.message, err.statusCode || 500); }
};

export const createRoomCtrl = async (req: Request, res: Response) => {
  try {
    const { propertyId } = req.params as { propertyId: string };
    const tenantId = req.user!.id as string;
    const data = await svc.createRoom(propertyId, tenantId, req.body, req.file);
    return sendSuccess(res, data, 'Kamar berhasil dibuat', 201);
  } catch (err: any) { return sendError(res, err.message, err.statusCode || 500); }
};

export const updateRoomCtrl = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params as { roomId: string };
    const tenantId = req.user!.id as string;
    const data = await svc.updateRoom(roomId, tenantId, req.body, req.file);
    return sendSuccess(res, data, 'Kamar berhasil diperbarui');
  } catch (err: any) { return sendError(res, err.message, err.statusCode || 500); }
};

export const deleteRoomCtrl = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params as { roomId: string };
    const tenantId = req.user!.id as string;
    await svc.deleteRoom(roomId, tenantId);
    return sendSuccess(res, null, 'Kamar berhasil dihapus');
  } catch (err: any) { return sendError(res, err.message, err.statusCode || 500); }
};

export const getPeakRatesCtrl = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params as { roomId: string };
    const tenantId = req.user!.id as string;
    const data = await svc.getPeakRates(roomId, tenantId);
    return sendSuccess(res, data, 'Peak rates berhasil diambil');
  } catch (err: any) { return sendError(res, err.message, err.statusCode || 500); }
};

export const createPeakRateCtrl = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params as { roomId: string };
    const tenantId = req.user!.id as string;
    const data = await svc.createPeakRate(roomId, tenantId, req.body);
    return sendSuccess(res, data, 'Peak rate berhasil dibuat', 201);
  } catch (err: any) { return sendError(res, err.message, err.statusCode || 500); }
};

export const deletePeakRateCtrl = async (req: Request, res: Response) => {
  try {
    const { rateId } = req.params as { rateId: string };
    const tenantId = req.user!.id as string;
    await svc.deletePeakRate(rateId, tenantId);
    return sendSuccess(res, null, 'Peak rate berhasil dihapus');
  } catch (err: any) { return sendError(res, err.message, err.statusCode || 500); }
};

export const getRoomAvailabilitiesCtrl = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params as { roomId: string };
    const tenantId = req.user!.id as string;
    const data = await svc.getRoomAvailabilities(roomId, tenantId);
    return sendSuccess(res, data, 'Ketersediaan kamar berhasil diambil');
  } catch (err: any) { return sendError(res, err.message, err.statusCode || 500); }
};

export const setRoomAvailabilityCtrl = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params as { roomId: string };
    const tenantId = req.user!.id as string;
    const { date, is_available } = req.body;
    const data = await svc.setRoomAvailability(roomId, tenantId, new Date(date), is_available);
    return sendSuccess(res, data, 'Ketersediaan kamar berhasil diperbarui');
  } catch (err: any) { return sendError(res, err.message, err.statusCode || 500); }
};
