import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { sendError } from '../utils/response';

export const verifyPropertyOwnership = async (req: Request, res: Response, next: NextFunction) => {
  const propertyId = (req.params.id || req.params.propertyId) as string;
  const tenantId = req.user?.id;

  if (!tenantId) {
    return sendError(res, 'Akses ditolak', 401);
  }

  if (!propertyId) {
    return sendError(res, 'ID Properti tidak ditemukan', 400);
  }

  try {
    const property = await prisma.property.findFirst({
      where: {
        id: propertyId,
        tenantId: tenantId,
        deleted_at: null
      }
    });

    if (!property) {
      return sendError(res, 'Properti tidak ditemukan atau Anda tidak memiliki akses', 404);
    }

    req.property = property;
    next();
  } catch (error: any) {
    return sendError(res, error.message || 'Terjadi kesalahan pada server', 500);
  }
};

export const verifyRoomOwnership = async (req: Request, res: Response, next: NextFunction) => {
  const roomId = req.params.roomId as string;
  const tenantId = req.user?.id;

  if (!tenantId) {
    return sendError(res, 'Akses ditolak', 401);
  }

  if (!roomId) {
    return sendError(res, 'ID Kamar tidak ditemukan', 400);
  }

  try {
    const room = await prisma.room.findFirst({
      where: {
        id: roomId,
        deleted_at: null
      }
    });

    if (!room) {
      return sendError(res, 'Kamar tidak ditemukan', 404);
    }

    const property = await prisma.property.findFirst({
      where: {
        id: room.propertyId,
        tenantId: tenantId,
        deleted_at: null
      }
    });

    if (!property) {
      return sendError(res, 'Kamar tidak ditemukan atau Anda tidak memiliki akses', 404);
    }

    req.room = room;
    next();
  } catch (error: any) {
    return sendError(res, error.message || 'Terjadi kesalahan pada server', 500);
  }
};

export const verifyPeakRateOwnership = async (req: Request, res: Response, next: NextFunction) => {
  const rateId = req.params.rateId as string;
  const tenantId = req.user?.id;

  if (!tenantId) {
    return sendError(res, 'Akses ditolak', 401);
  }

  if (!rateId) {
    return sendError(res, 'ID Peak Rate tidak ditemukan', 400);
  }

  try {
    const rate = await prisma.peakSeasonRate.findFirst({
      where: {
        id: rateId,
        deleted_at: null
      }
    });

    if (!rate) {
      return sendError(res, 'Aturan harga peak season tidak ditemukan', 404);
    }

    const room = await prisma.room.findFirst({
      where: {
        id: rate.roomId,
        deleted_at: null
      }
    });

    if (!room) {
      return sendError(res, 'Kamar terkait tidak ditemukan', 404);
    }

    const property = await prisma.property.findFirst({
      where: {
        id: room.propertyId,
        tenantId: tenantId,
        deleted_at: null
      }
    });

    if (!property) {
      return sendError(res, 'Aturan harga peak season tidak ditemukan atau Anda tidak memiliki akses', 404);
    }

    req.peakRate = rate;
    next();
  } catch (error: any) {
    return sendError(res, error.message || 'Terjadi kesalahan pada server', 500);
  }
};
