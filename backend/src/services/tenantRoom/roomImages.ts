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
  const targetImage = images.find(img => img.id === imageId);
  if (!targetImage) throw new AppError('Gambar tidak ditemukan', 404);

  let currentOrder = 1;
  const updates = images.map(img => {
    if (img.id === imageId) {
      return prisma.roomImage.update({ where: { id: img.id }, data: { order: 0 } });
    } else {
      return prisma.roomImage.update({ where: { id: img.id }, data: { order: currentOrder++ } });
    }
  });
  await prisma.$transaction(updates);
  return targetImage;
};

const getNextRoomImageOrder = async (roomId: string) => {
  const last = await prisma.roomImage.findFirst({ where: { roomId }, orderBy: { order: 'desc' } });
  return (last?.order ?? -1) + 1;
};
