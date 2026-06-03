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
    return deleteImageRecord(tx, propertyId, imageId, tenantId);
  });

  await deleteCloudinaryImage(deleted.cloudinary_public_id);
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

const getPropertyAndImageOrThrow = async (tx: Prisma.TransactionClient, propertyId: string, imageId: string, tenantId: string) => {
  const property = await tx.property.findFirst({ where: { id: propertyId, tenantId } });
  if (!property) throw new AppError("Properti tidak ditemukan", 404);
  const image = await tx.propertyImage.findFirst({ where: { id: imageId, propertyId } });
  if (!image) throw new AppError("Gambar tidak ditemukan", 404);
  return { property, image };
};

const checkMinImagesConstraint = (featuredUrl: string | null, gallery: { image_url: string }[]) => {
  const urls = new Set<string>();
  if (featuredUrl) urls.add(featuredUrl);
  gallery.forEach(img => urls.add(img.image_url));
  if (urls.size <= 1) throw new AppError("Gagal menghapus. Properti harus memiliki minimal 1 gambar.", 400);
};

const promoteNextFeaturedImage = async (tx: Prisma.TransactionClient, propertyId: string, imageId: string, gallery: { id: string; image_url: string }[]) => {
  const nextImage = gallery.find(img => img.id !== imageId);
  await tx.property.update({
    where: { id: propertyId },
    data: { featured_image_url: nextImage ? nextImage.image_url : null }
  });
};

const deleteImageRecord = async (
  tx: Prisma.TransactionClient,
  propertyId: string,
  imageId: string,
  tenantId: string,
) => {
  const { property, image } = await getPropertyAndImageOrThrow(tx, propertyId, imageId, tenantId);
  const gallery = await tx.propertyImage.findMany({ where: { propertyId } });
  checkMinImagesConstraint(property.featured_image_url, gallery);
  if (property.featured_image_url === image.image_url) {
    await promoteNextFeaturedImage(tx, propertyId, imageId, gallery);
  }
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
