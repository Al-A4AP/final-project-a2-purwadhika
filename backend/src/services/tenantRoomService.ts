import { AppError } from '../middlewares/errorHandler';
import { addRoomImage, uploadRoomImage } from './tenantRoom/roomImages';
import { buildAvailabilityRangeDates } from './tenantRoom/availabilityRange';
import { buildTenantAvailabilityView } from './tenantRoom/availabilityView';
import { buildRoomCreateData, buildRoomUpdateData, normalizeAvailabilityDate } from './tenantRoom/roomData';
import { createRoomPeakRate, findRoomPeakRates, softDeletePeakRate, updateRoomPeakRate } from './tenantRoom/peakRates';
import { createRoomRecord, findRoomAvailabilities, findRoomBookedOrders, findRoomById, findRoomsByProperty, softDeleteRoomRecord, updateRoomRecord, upsertRoomAvailability, upsertRoomAvailabilityRange } from './tenantRoom/roomQueries';
import { ensureTenantProperty, verifyPeakRateOwner, verifyRoomOwner } from './tenantRoom/roomOwnership';
import type { PeakRateFormData, RoomFormData } from './tenantRoom/tenantRoomTypes';
import { isWholeUnitCategory } from './tenantRoom/wholeUnitCategory';

export const getRooms = async (propertyId: string, tenantId: string) => {
  await ensureTenantProperty(propertyId, tenantId);
  return findRoomsByProperty(propertyId);
};

export const createRoom = async (propertyId: string, tenantId: string, data: RoomFormData, file?: Express.Multer.File) => {
  const property = await ensureTenantProperty(propertyId, tenantId);
  if (!file) throw new AppError('Foto kamar wajib diupload', 400);
  const image = await uploadRoomImage(file);
  return createRoomRecord(buildRoomCreateData(propertyId, data, image, isWholeUnitCategory(property.category?.name)));
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
  return upsertRoomAvailabilityRange(roomId, buildAvailabilityRangeDates(start, end), isAvailable);
};
