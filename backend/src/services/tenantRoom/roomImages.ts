import prisma from '../../config/prisma';
import { uploadBuffer } from '../../utils/cloudinaryUpload';

export const uploadRoomImage = (file: Express.Multer.File) => uploadBuffer(file.buffer, 'proprrent/rooms');

export const addRoomImage = async (roomId: string, file: Express.Multer.File) => {
  const image = await uploadRoomImage(file);
  const order = await getNextRoomImageOrder(roomId);
  return prisma.roomImage.create({
    data: { roomId, image_url: image.url, cloudinary_public_id: image.public_id, order },
  });
};

const getNextRoomImageOrder = async (roomId: string) => {
  const last = await prisma.roomImage.findFirst({ where: { roomId }, orderBy: { order: 'desc' } });
  return (last?.order ?? -1) + 1;
};
