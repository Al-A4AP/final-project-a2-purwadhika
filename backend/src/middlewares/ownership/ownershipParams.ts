import { Request, Response } from 'express';
import { sendError } from '../../utils/response';

export const getTenantIdOrSend = (req: Request, res: Response) => {
  const tenantId = req.user?.id;
  if (!tenantId) sendError(res, 'Akses ditolak', 401);
  return tenantId;
};

export const getPropertyIdOrSend = (req: Request, res: Response) => {
  const propertyId = (req.params.id || req.params.propertyId) as string;
  if (!propertyId) sendError(res, 'ID Properti tidak ditemukan', 400);
  return propertyId;
};

export const getRoomIdOrSend = (req: Request, res: Response) => {
  const roomId = req.params.roomId as string;
  if (!roomId) sendError(res, 'ID Kamar tidak ditemukan', 400);
  return roomId;
};

export const getRateIdOrSend = (req: Request, res: Response) => {
  const rateId = req.params.rateId as string;
  if (!rateId) sendError(res, 'ID Peak Rate tidak ditemukan', 400);
  return rateId;
};
