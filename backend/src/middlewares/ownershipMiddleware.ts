import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';
import { sendServerOwnershipError } from './ownership/ownershipErrors';
import { getPropertyIdOrSend, getRateIdOrSend, getRoomIdOrSend, getTenantIdOrSend } from './ownership/ownershipParams';
import { findOwnedPeakRate, findOwnedProperty, findOwnedRoom } from './ownership/ownershipQueries';

type OwnershipTask = () => Promise<boolean>;

export const verifyPropertyOwnership = async (req: Request, res: Response, next: NextFunction) => {
  const tenantId = getTenantIdOrSend(req, res);
  if (!tenantId) return;
  const propertyId = getPropertyIdOrSend(req, res);
  if (!propertyId) return;
  return runOwnershipCheck(res, next, async () => assignOwnedProperty(req, res, propertyId, tenantId));
};

export const verifyRoomOwnership = async (req: Request, res: Response, next: NextFunction) => {
  const tenantId = getTenantIdOrSend(req, res);
  if (!tenantId) return;
  const roomId = getRoomIdOrSend(req, res);
  if (!roomId) return;
  return runOwnershipCheck(res, next, async () => assignOwnedRoom(req, res, roomId, tenantId));
};

export const verifyPeakRateOwnership = async (req: Request, res: Response, next: NextFunction) => {
  const tenantId = getTenantIdOrSend(req, res);
  if (!tenantId) return;
  const rateId = getRateIdOrSend(req, res);
  if (!rateId) return;
  return runOwnershipCheck(res, next, async () => assignOwnedPeakRate(req, res, rateId, tenantId));
};

const runOwnershipCheck = async (res: Response, next: NextFunction, task: OwnershipTask) => {
  try {
    if (await task()) next();
  } catch (error) {
    return sendServerOwnershipError(res, error);
  }
};

const assignOwnedProperty = async (req: Request, res: Response, propertyId: string, tenantId: string) => {
  const property = await findOwnedProperty(propertyId, tenantId);
  if (!property) return sendNotFound(res, 'Properti tidak ditemukan atau Anda tidak memiliki akses');
  req.property = property;
  return true;
};

const assignOwnedRoom = async (req: Request, res: Response, roomId: string, tenantId: string) => {
  const room = await findOwnedRoom(roomId, tenantId);
  if (!room) return sendNotFound(res, 'Kamar tidak ditemukan atau Anda tidak memiliki akses');
  req.room = room;
  return true;
};

const assignOwnedPeakRate = async (req: Request, res: Response, rateId: string, tenantId: string) => {
  const rate = await findOwnedPeakRate(rateId, tenantId);
  if (!rate) return sendNotFound(res, 'Aturan harga peak season tidak ditemukan atau Anda tidak memiliki akses');
  req.peakRate = rate;
  return true;
};

const sendNotFound = (res: Response, message: string) => {
  sendError(res, message, 404);
  return false;
};
