import type { RoomImage } from '@prisma/client';
import prisma from '../../config/prisma';
import { uploadBuffer, deleteFromCloudinary } from '../../utils/cloudinaryUpload';
import { AppError } from '../../middlewares/errorHandler';

export const uploadRoomImage = (file: Express.Multer.File) => uploadBuffer(file.buffer, 'proprrent/rooms');

export const addRoomImage = async (roomId: string, file: Express.Multer.File) => {
  const image = await uploadRoomImage(file);
  const order = await getNextRoomImageOrder(roomId);
  return prisma.roomImage.create({
    data: { roomId, image_url: image.url, cloudinary_public_id: image.public_id, order },
  });
};

export const deleteRoomImage = async (roomId: string, imageId: string) => {
  const count = await prisma.roomImage.count({ where: { roomId } });
  if (count <= 1) {
    throw new AppError('Gagal menghapus. Kamar harus memiliki minimal 1 gambar.', 400);
  }
  const image = await prisma.roomImage.findFirst({ where: { id: imageId, roomId } });
  if (!image) throw new AppError('Gambar tidak ditemukan', 404);

  await prisma.roomImage.delete({ where: { id: imageId } });
  if (image.cloudinary_public_id) {
    await deleteFromCloudinary(image.cloudinary_public_id);
  }
  return image;
};

export const setRoomImageAsMain = async (roomId: string, imageId: string) => {
  const images = await prisma.roomImage.findMany({ where: { roomId }, orderBy: { order: 'asc' } });
  const targetImage = findRoomImage(images, imageId);
  if (!targetImage) throw new AppError('Gambar tidak ditemukan', 404);
  await prisma.$transaction(buildMainImageUpdates(images, imageId));
  return targetImage;
};

export const updateRoomImageRecord = async (roomId: string, imageId: string, data: UpdateRoomImageData) => {
  if (data.is_main) return setRoomImageAsMain(roomId, imageId);
  const image = await findRoomImageOrThrow(roomId, imageId);
  if (data.order === undefined) return image;
  return prisma.roomImage.update({ where: { id: imageId }, data: { order: data.order } });
};

const findRoomImageOrThrow = async (roomId: string, imageId: string) => {
  const image = await prisma.roomImage.findFirst({ where: { id: imageId, roomId } });
  if (!image) throw new AppError('Gambar tidak ditemukan', 404);
  return image;
};

const findRoomImage = (images: RoomImageRecord[], imageId: string) =>
  images.find((image) => image.id === imageId);

const buildMainImageUpdates = (images: RoomImageRecord[], imageId: string) => {
  let currentOrder = 1;
  return images.map((image) => {
    const order = image.id === imageId ? 0 : currentOrder++;
    return buildImageOrderUpdate(image, order);
  });
};

const buildImageOrderUpdate = (image: RoomImageRecord, order: number) =>
  prisma.roomImage.update({ where: { id: image.id }, data: { order } });

const getNextRoomImageOrder = async (roomId: string) => {
  const last = await prisma.roomImage.findFirst({ where: { roomId }, orderBy: { order: 'desc' } });
  return (last?.order ?? -1) + 1;
};

type RoomImageRecord = RoomImage;

interface UpdateRoomImageData {
  is_main?: boolean;
  order?: number;
}
