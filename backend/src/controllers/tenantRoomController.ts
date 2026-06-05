import { Request, Response } from 'express';
import * as svc from '../services/tenantRoomService';
import { sendSuccess, sendError } from '../utils/response';
import { handleControllerError } from './controllerErrors';

export const getRoomsCtrl = async (req: Request, res: Response) => {
  try {
    const { propertyId } = req.params as { propertyId: string };
    const data = await svc.getRooms(propertyId, req.user!.id as string);
    return sendSuccess(res, data, 'Kamar berhasil diambil');
  } catch (err) { return handleControllerError(res, err); }
};

export const createRoomCtrl = async (req: Request, res: Response) => {
  try {
    const { propertyId } = req.params as { propertyId: string };
    const data = await svc.createRoom(propertyId, req.user!.id as string, req.body, req.file);
    return sendSuccess(res, data, 'Kamar berhasil dibuat', 201);
  } catch (err) { return handleControllerError(res, err); }
};

export const updateRoomCtrl = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params as { roomId: string };
    const data = await svc.updateRoom(roomId, req.user!.id as string, req.body, req.file);
    return sendSuccess(res, data, 'Kamar berhasil diperbarui');
  } catch (err) { return handleControllerError(res, err); }
};

export const deleteRoomCtrl = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params as { roomId: string };
    await svc.deleteRoom(roomId, req.user!.id as string);
    return sendSuccess(res, null, 'Kamar berhasil dihapus');
  } catch (err) { return handleControllerError(res, err); }
};

export const getPeakRatesCtrl = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params as { roomId: string };
    const data = await svc.getPeakRates(roomId, req.user!.id as string);
    return sendSuccess(res, data, 'Peak rates berhasil diambil');
  } catch (err) { return handleControllerError(res, err); }
};

export const createPeakRateCtrl = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params as { roomId: string };
    const data = await svc.createPeakRate(roomId, req.user!.id as string, req.body);
    return sendSuccess(res, data, 'Peak rate berhasil dibuat', 201);
  } catch (err) { return handleControllerError(res, err); }
};

export const updatePeakRateCtrl = async (req: Request, res: Response) => {
  try {
    const { rateId } = req.params as { rateId: string };
    const data = await svc.updatePeakRate(rateId, req.user!.id as string, req.body);
    return sendSuccess(res, data, 'Peak rate berhasil diperbarui');
  } catch (err) { return handleControllerError(res, err); }
};

export const deletePeakRateCtrl = async (req: Request, res: Response) => {
  try {
    const { rateId } = req.params as { rateId: string };
    await svc.deletePeakRate(rateId, req.user!.id as string);
    return sendSuccess(res, null, 'Peak rate berhasil dihapus');
  } catch (err) { return handleControllerError(res, err); }
};

export const getRoomAvailabilitiesCtrl = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params as { roomId: string };
    const data = await svc.getRoomAvailabilities(roomId, req.user!.id as string);
    return sendSuccess(res, data, 'Ketersediaan kamar berhasil diambil');
  } catch (err) { return handleControllerError(res, err); }
};

export const setRoomAvailabilityRangeCtrl = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params as { roomId: string };
    const data = await setRoomAvailabilityRange(roomId, req);
    return sendSuccess(res, data, 'Ketersediaan kamar berhasil diperbarui');
  } catch (err) { return handleControllerError(res, err); }
};

export const setRoomAvailabilityCtrl = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params as { roomId: string };
    const { date, is_available } = req.body;
    const data = await svc.setRoomAvailability(roomId, req.user!.id as string, new Date(date), is_available);
    return sendSuccess(res, data, 'Ketersediaan kamar berhasil diperbarui');
  } catch (err) { return handleControllerError(res, err); }
};

const setRoomAvailabilityRange = (roomId: string, req: Request) => {
  const { start_date, end_date, is_available } = req.body;
  return svc.setRoomAvailabilityRange(roomId, req.user!.id as string, new Date(start_date), new Date(end_date), is_available);
};

export const addRoomImageCtrl = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params as { roomId: string };
    if (!req.file) return sendError(res, 'File gambar wajib diupload', 400);
    const data = await svc.addRoomImageService(roomId, req.user!.id as string, req.file);
    return sendSuccess(res, data, 'Gambar berhasil ditambahkan', 201);
  } catch (err) { return handleControllerError(res, err); }
};

export const deleteRoomImageCtrl = async (req: Request, res: Response) => {
  try {
    const { roomId, imageId } = req.params as { roomId: string; imageId: string };
    const data = await svc.removeRoomImage(roomId, req.user!.id as string, imageId);
    return sendSuccess(res, data, 'Gambar berhasil dihapus');
  } catch (err) { return handleControllerError(res, err); }
};

export const updateRoomImageCtrl = async (req: Request, res: Response) => {
  try {
    const { roomId, imageId } = req.params as { roomId: string; imageId: string };
    const data = await svc.updateRoomImage(roomId, req.user!.id as string, imageId, req.body);
    return sendSuccess(res, data, 'Gambar berhasil diperbarui');
  } catch (err) { return handleControllerError(res, err); }
};

export const setRoomMainImageCtrl = async (req: Request, res: Response) => {
  try {
    const { roomId, imageId } = req.params as { roomId: string; imageId: string };
    const data = await svc.setRoomMainImage(roomId, imageId, req.user!.id as string);
    return sendSuccess(res, data, 'Gambar utama berhasil diubah');
  } catch (err) { return handleControllerError(res, err); }
};
