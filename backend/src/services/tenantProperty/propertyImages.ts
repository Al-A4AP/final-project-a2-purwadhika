import type { Prisma } from "@prisma/client";
import prisma from "../../config/prisma";
import { AppError } from "../../middlewares/errorHandler";
import {
  deleteFromCloudinary,
  uploadBuffer,
} from "../../utils/cloudinaryUpload";
import { findTenantProperty } from "./tenantPropertyQueries";

export const createPropertyImage = async (
  propertyId: string,
  tenantId: string,
  file: Express.Multer.File,
) => {
  await ensurePropertyExists(propertyId, tenantId);
  const result = await uploadBuffer(file.buffer);
  const order = await getNextImageOrder(propertyId);
  return prisma.propertyImage.create({
    data: {
      propertyId,
      image_url: result.url,
      cloudinary_public_id: result.public_id,
      order,
    },
  });
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

const ensurePropertyExists = async (propertyId: string, tenantId: string) => {
  const property = await findTenantProperty(propertyId, tenantId);
  if (!property) throw new AppError("Properti tidak ditemukan", 404);
};
const getNextImageOrder = async (propertyId: string) => {
  const last = await prisma.propertyImage.findFirst({
    where: { propertyId },
    orderBy: { order: "desc" },
  });
  return (last?.order ?? -1) + 1;
};
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
  try {
    await deleteFromCloudinary(publicId);
  } catch {
    return;
  }
};
