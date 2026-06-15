import { AppError } from '../middlewares/errorHandler';
import { addRoomImage, uploadRoomImage, deleteRoomImage, setRoomImageAsMain, updateRoomImageRecord } from './tenantRoom/roomImages';
import { buildAvailabilityRangeDates } from './tenantRoom/availabilityRange';
import { buildTenantAvailabilityView } from './tenantRoom/availabilityView';
import { buildRoomCreateData, buildRoomUpdateData, normalizeAvailabilityDate } from './tenantRoom/roomData';
import { createRoomPeakRate, findRoomPeakRates, softDeletePeakRate, updateRoomPeakRate } from './tenantRoom/peakRates';
import { createRoomRecord, findRoomAvailabilities, findRoomBookedOrders, findRoomById, findRoomsByProperty, softDeleteRoomRecord, updateRoomRecord, upsertRoomAvailability, upsertRoomAvailabilityRange, countActiveOrdersForRoom, countActiveRoomsByProperty, countOverlappingOrders } from './tenantRoom/roomQueries';
import { ensureTenantProperty, verifyPeakRateOwner, verifyRoomOwner } from './tenantRoom/roomOwnership';
import type { PeakRateFormData, RoomFormData } from './tenantRoom/tenantRoomTypes';
import { isWholeUnitCategory } from './tenantRoom/wholeUnitCategory';

const MAX_ROOM_TYPES_PER_PROPERTY = 5;

export const getRooms = async (propertyId: string, tenantId: string) => {
  await ensureTenantProperty(propertyId, tenantId);
  return findRoomsByProperty(propertyId);
};

export const createRoom = async (propertyId: string, tenantId: string, data: RoomFormData, file?: Express.Multer.File) => {
  const property = await ensureTenantProperty(propertyId, tenantId);
  await assertRoomTypeLimit(propertyId);
  if (!file) throw new AppError('Foto kamar wajib diupload', 400);
  const image = await uploadRoomImage(file);
  return createRoomRecord(buildRoomCreateData(propertyId, data, image, isWholeUnitCategory(property.category?.name)));
};

const assertRoomTypeLimit = async (propertyId: string) => {
  const count = await countActiveRoomsByProperty(propertyId);
  if (count >= MAX_ROOM_TYPES_PER_PROPERTY) {
    throw new AppError('Maksimal 5 jenis kamar untuk satu properti.', 400);
  }
};

export const updateRoom = async (roomId: string, tenantId: string, data: RoomFormData, file?: Express.Multer.File) => {
  const room = await verifyRoomOwner(roomId, tenantId);
  const isWholeUnit = isWholeUnitCategory(room.property.category?.name);
  const updated = await updateRoomRecord(roomId, buildRoomUpdateData(data, room, isWholeUnit));
  if (file) await addRoomImage(roomId, file);
  return file ? findRoomById(roomId) : updated;
};

export const deleteRoom = async (roomId: string, tenantId: string) => {
  await verifyRoomOwner(roomId, tenantId);
  const activeOrders = await countActiveOrdersForRoom(roomId);
  if (activeOrders > 0) throw new AppError('Kamar tidak dapat dihapus karena sudah memiliki riwayat pemesanan aktif.', 400);
  return softDeleteRoomRecord(roomId);
};

export const getPeakRates = async (roomId: string, tenantId: string) => {
  await verifyRoomOwner(roomId, tenantId);
  return findRoomPeakRates(roomId);
};

export const createPeakRate = async (roomId: string, tenantId: string, data: PeakRateFormData) => {
  await verifyRoomOwner(roomId, tenantId);
  return createRoomPeakRate(roomId, data);
};

export const updatePeakRate = async (id: string, tenantId: string, data: PeakRateFormData) => {
  const rate = await verifyPeakRateOwner(id, tenantId);
  return updateRoomPeakRate(id, rate.roomId, data);
};

export const deletePeakRate = async (id: string, tenantId: string) => {
  await verifyPeakRateOwner(id, tenantId);
  return softDeletePeakRate(id);
};

export const getRoomAvailabilities = async (roomId: string, tenantId: string) => {
  await verifyRoomOwner(roomId, tenantId);
  const [manual, orders] = await Promise.all([
    findRoomAvailabilities(roomId),
    findRoomBookedOrders(roomId),
  ]);
  return buildTenantAvailabilityView(manual, orders);
};

export const setRoomAvailability = async (roomId: string, tenantId: string, date: Date, is_available: boolean) => {
  await verifyRoomOwner(roomId, tenantId);
  return upsertRoomAvailability(roomId, normalizeAvailabilityDate(date), is_available);
};

export const setRoomAvailabilityRange = async (roomId: string, tenantId: string, start: Date, end: Date, isAvailable: boolean) => {
  await verifyRoomOwner(roomId, tenantId);
  if (!isAvailable) {
    const overlappingOrders = await countOverlappingOrders(roomId, start, end);
    if (overlappingOrders > 0) throw new AppError('Ketersediaan tidak dapat diubah karena tanggal tersebut sudah memiliki pemesanan aktif.', 400);
  }
  return upsertRoomAvailabilityRange(roomId, buildAvailabilityRangeDates(start, end), isAvailable);
};

export const addRoomImageService = async (roomId: string, tenantId: string, file: Express.Multer.File) => {
  await verifyRoomOwner(roomId, tenantId);
  return addRoomImage(roomId, file);
};

export const removeRoomImage = async (roomId: string, tenantId: string, imageId: string) => {
  await verifyRoomOwner(roomId, tenantId);  
  return deleteRoomImage(roomId, imageId);
};

export const updateRoomImage = async (roomId: string, tenantId: string, imageId: string, data: { is_main?: boolean; order?: number }) => {
  await verifyRoomOwner(roomId, tenantId);  
  return updateRoomImageRecord(roomId, imageId, data);
};

export const setRoomMainImage = async (roomId: string, imageId: string, tenantId: string) => {
  await verifyRoomOwner(roomId, tenantId);
  return setRoomImageAsMain(roomId, imageId);
};
