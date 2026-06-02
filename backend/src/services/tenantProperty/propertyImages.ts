import type { Prisma } from "@prisma/client";
import prisma from "../../config/prisma";
import { AppError } from "../../middlewares/errorHandler";
import {
  deleteFromCloudinary,
  uploadBuffer,
} from "../../utils/cloudinaryUpload";

type UploadedImage = Awaited<ReturnType<typeof uploadBuffer>>;

export const createPropertyImage = async (
  propertyId: string,
  tenantId: string,
  file: Express.Multer.File,
) => {
  const result = await uploadBuffer(file.buffer);
  try {
    return await createImageRecordInTransaction(propertyId, tenantId, result);
  } catch (error) {
    await cleanupUploadedImage(result.public_id);
    throw error;
  }
};

export const removePropertyImage = async (
  propertyId: string,
  imageId: string,
  tenantId: string,
) => {
  const deleted = await prisma.$transaction(async (tx) => {
    const deleted = await deleteImageRecord(tx, propertyId, imageId, tenantId);
    await deleteCloudinaryImage(deleted.cloudinary_public_id);
    return deleted;
  });

  return deleted;
};

const createImageRecordInTransaction = (
  propertyId: string,
  tenantId: string,
  result: UploadedImage,
) =>
  prisma.$transaction(async (tx) => {
    await ensureTransactionProperty(tx, propertyId, tenantId);
    const order = await getNextImageOrder(tx, propertyId);
    return createImageRecord(tx, propertyId, result, order);
  });

const getNextImageOrder = async (tx: Prisma.TransactionClient, propertyId: string) => {
  const last = await tx.propertyImage.findFirst({
    where: { propertyId },
    orderBy: { order: "desc" },
  });
  return (last?.order ?? -1) + 1;
};

const createImageRecord = (
  tx: Prisma.TransactionClient,
  propertyId: string,
  result: UploadedImage,
  order: number,
) =>
  tx.propertyImage.create({
    data: {
      propertyId,
      image_url: result.url,
      cloudinary_public_id: result.public_id,
      order,
    },
  });

const deleteImageRecord = async (
  tx: Prisma.TransactionClient,
  propertyId: string,
  imageId: string,
  tenantId: string,
) => {
  await ensureTransactionProperty(tx, propertyId, tenantId);
  await ensureTransactionImage(tx, propertyId, imageId);
  return tx.propertyImage.delete({ where: { id: imageId } });
};
const ensureTransactionProperty = async (
  tx: Prisma.TransactionClient,
  propertyId: string,
  tenantId: string,
) => {
  const property = await tx.property.findFirst({
    where: { id: propertyId, tenantId },
  });
  if (!property) throw new AppError("Properti tidak ditemukan", 404);
};
const ensureTransactionImage = async (
  tx: Prisma.TransactionClient,
  propertyId: string,
  imageId: string,
) => {
  const image = await tx.propertyImage.findFirst({
    where: { id: imageId, propertyId },
  });
  if (!image) throw new AppError("Gambar tidak ditemukan", 404);
};
const deleteCloudinaryImage = async (publicId?: string | null) => {
  if (!publicId) return;
  await deleteFromCloudinary(publicId);
};

const cleanupUploadedImage = async (publicId: string) => {
  try {
    await deleteFromCloudinary(publicId);
  } catch {
    return;
  }
};
