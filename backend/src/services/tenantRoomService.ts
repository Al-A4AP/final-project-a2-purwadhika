import prisma from "../config/prisma";
import { AppError } from "../middlewares/errorHandler";
import { uploadBuffer } from "../utils/cloudinaryUpload";

const verifyRoomOwner = async (roomId: string, tenantId: string) => {
  const room = await prisma.room.findFirst({
    where: { id: roomId, deleted_at: null },
    include: { property: true },
  });
  if (!room || room.property.tenantId !== tenantId)
    throw new AppError("Kamar tidak ditemukan", 404);
  return room;
};

export const getRooms = async (propertyId: string, tenantId: string) => {
  const p = await prisma.property.findFirst({
    where: { id: propertyId, tenantId, deleted_at: null },
  });
  if (!p) throw new AppError("Properti tidak ditemukan", 404);
  return prisma.room.findMany({
    where: { propertyId, deleted_at: null },
    include: { images: { orderBy: { order: "asc" } }, peakRates: { where: { deleted_at: null } } },
    orderBy: { created_at: "asc" },
  });
};

export const createRoom = async (
  propertyId: string,
  tenantId: string,
  data: any,
  file?: Express.Multer.File,
) => {
  const p = await prisma.property.findFirst({
    where: { id: propertyId, tenantId, deleted_at: null },
  });
  if (!p) throw new AppError("Properti tidak ditemukan", 404);
  if (!file) throw new AppError("Foto kamar wajib diupload", 400);
  const image = await uploadBuffer(file.buffer, "proprrent/rooms");
  return prisma.room.create({
    data: {
      propertyId,
      room_type: data.room_type,
      base_price: Number(data.base_price),
      child_price: data.child_price ? Number(data.child_price) : null,
      capacity: Number(data.capacity),
      quantity: data.quantity ? Number(data.quantity) : 1,
      description: data.description || null,
      images: { create: { image_url: image.url, cloudinary_public_id: image.public_id, order: 0 } },
    },
    include: { images: { orderBy: { order: "asc" } }, peakRates: { where: { deleted_at: null } } },
  });
};

export const updateRoom = async (
  roomId: string,
  tenantId: string,
  data: any,
  file?: Express.Multer.File,
) => {
  const room = await verifyRoomOwner(roomId, tenantId);
  const updated = await prisma.room.update({
    where: { id: roomId },
    data: {
      room_type: data.room_type ?? room.room_type,
      base_price: data.base_price ? Number(data.base_price) : room.base_price,
      child_price: data.child_price === "" ? null : data.child_price ? Number(data.child_price) : room.child_price,
      capacity: data.capacity ? Number(data.capacity) : room.capacity,
      quantity: data.quantity ? Number(data.quantity) : room.quantity,
      description: data.description ?? room.description,
    },
    include: { images: { orderBy: { order: "asc" } }, peakRates: { where: { deleted_at: null } } },
  });
  if (file) await addRoomImage(roomId, file);
  return file ? getRoomById(roomId) : updated;
};

const addRoomImage = async (roomId: string, file: Express.Multer.File) => {
  const image = await uploadBuffer(file.buffer, "proprrent/rooms");
  const last = await prisma.roomImage.findFirst({ where: { roomId }, orderBy: { order: "desc" } });
  return prisma.roomImage.create({
    data: { roomId, image_url: image.url, cloudinary_public_id: image.public_id, order: (last?.order ?? -1) + 1 },
  });
};

const getRoomById = (roomId: string) =>
  prisma.room.findUnique({
    where: { id: roomId },
    include: { images: { orderBy: { order: "asc" } }, peakRates: { where: { deleted_at: null } } },
  });

export const deleteRoom = async (roomId: string, tenantId: string) => {
  await verifyRoomOwner(roomId, tenantId);
  return prisma.room.update({
    where: { id: roomId },
    data: { deleted_at: new Date() },
  });
};

export const getPeakRates = async (roomId: string, tenantId: string) => {
  await verifyRoomOwner(roomId, tenantId);
  return prisma.peakSeasonRate.findMany({
    where: { roomId, deleted_at: null },
    orderBy: { start_date: "asc" },
  });
};

export const createPeakRate = async (
  roomId: string,
  tenantId: string,
  data: any,
) => {
  await verifyRoomOwner(roomId, tenantId);
  const start = new Date(data.start_date);
  const end = new Date(data.end_date);
  if (start >= end)
    throw new AppError("Tanggal selesai harus setelah tanggal mulai", 400);

  const existing = await prisma.peakSeasonRate.findFirst({
    where: {
      roomId,
      deleted_at: null,
      start_date: { lte: end },
      end_date: { gte: start },
    },
  });

  if (existing) {
    throw new AppError(
      "Terdapat jadwal Peak Season yang bentrok pada rentang tanggal tersebut",
      400,
    );
  }

  return prisma.peakSeasonRate.create({
    data: {
      roomId,
      rate_type: data.rate_type,
      start_date: start,
      end_date: end,
      rate_value: Number(data.rate_value),
      description: data.description || null,
    },
  });
};

export const deletePeakRate = async (id: string, tenantId: string) => {
  const rate = await prisma.peakSeasonRate.findFirst({
    where: { id, deleted_at: null },
    include: { room: { include: { property: true } } },
  });
  if (!rate || rate.room.property.tenantId !== tenantId)
    throw new AppError("Rate tidak ditemukan", 404);
  return prisma.peakSeasonRate.update({
    where: { id },
    data: { deleted_at: new Date() },
  });
};

export const getRoomAvailabilities = async (
  roomId: string,
  tenantId: string,
) => {
  await verifyRoomOwner(roomId, tenantId);
  return prisma.roomAvailability.findMany({
    where: { roomId },
    orderBy: { date: "asc" },
  });
};

export const setRoomAvailability = async (
  roomId: string,
  tenantId: string,
  date: Date,
  is_available: boolean,
) => {
  await verifyRoomOwner(roomId, tenantId);
  const startOfDay = new Date(date);
  startOfDay.setUTCHours(0, 0, 0, 0);

  return prisma.roomAvailability.upsert({
    where: { roomId_date: { roomId, date: startOfDay } },
    update: { is_available },
    create: { roomId, date: startOfDay, is_available },
  });
};
