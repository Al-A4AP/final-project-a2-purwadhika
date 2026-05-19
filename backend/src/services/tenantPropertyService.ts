import prisma from '../config/prisma';
import { uploadBuffer, deleteFromCloudinary } from '../utils/cloudinaryUpload';
import { AppError } from '../middlewares/errorHandler';

export const getTenantProperties = async (tenantId: string) =>
  prisma.property.findMany({
    where: { tenantId, deleted_at: null },
    include: {
      category: true,
      rooms: { where: { deleted_at: null }, select: { base_price: true } },
      _count: { select: { rooms: true, orders: true, reviews: true } },
    },
    orderBy: { created_at: 'desc' },
  });

export const getTenantPropertyById = async (id: string, tenantId: string) => {
  const p = await prisma.property.findFirst({
    where: { id, tenantId, deleted_at: null },
    include: {
      category: true,
      images: { orderBy: { order: 'asc' } },
      rooms: { where: { deleted_at: null }, include: { peakRates: { where: { deleted_at: null } } } },
    },
  });
  if (!p) throw new AppError('Properti tidak ditemukan', 404);
  return p;
};

export const createProperty = async (tenantId: string, data: any, file?: Express.Multer.File) => {
  const featured_image_url = file ? (await uploadBuffer(file.buffer)).url : undefined;
  return prisma.property.create({
    data: {
      tenantId, categoryId: data.categoryId, name: data.name,
      description: data.description, address: data.address, city: data.city,
      latitude: data.latitude ? Number(data.latitude) : undefined,
      longitude: data.longitude ? Number(data.longitude) : undefined,
      featured_image_url,
    },
  });
};

export const updateProperty = async (id: string, tenantId: string, data: any, file?: Express.Multer.File) => {
  const existing = await prisma.property.findFirst({ where: { id, tenantId, deleted_at: null } });
  if (!existing) throw new AppError('Properti tidak ditemukan', 404);
  const featured_image_url = file
    ? (await uploadBuffer(file.buffer)).url
    : existing.featured_image_url;
  return prisma.property.update({
    where: { id },
    data: {
      categoryId: data.categoryId || existing.categoryId,
      name: data.name || existing.name,
      description: data.description || existing.description,
      address: data.address || existing.address,
      city: data.city || existing.city,
      latitude: data.latitude ? Number(data.latitude) : existing.latitude,
      longitude: data.longitude ? Number(data.longitude) : existing.longitude,
      featured_image_url,
    },
  });
};

export const deleteProperty = async (id: string, tenantId: string) => {
  const existing = await prisma.property.findFirst({ where: { id, tenantId, deleted_at: null } });
  if (!existing) throw new AppError('Properti tidak ditemukan', 404);
  return prisma.property.update({ where: { id }, data: { deleted_at: new Date() } });
};

export const addPropertyImage = async (propertyId: string, tenantId: string, file: Express.Multer.File) => {
  const p = await prisma.property.findFirst({ where: { id: propertyId, tenantId, deleted_at: null } });
  if (!p) throw new AppError('Properti tidak ditemukan', 404);
  const result = await uploadBuffer(file.buffer);
  const last = await prisma.propertyImage.findFirst({ where: { propertyId }, orderBy: { order: 'desc' } });
  return prisma.propertyImage.create({
    data: { propertyId, image_url: result.url, cloudinary_public_id: result.public_id, order: (last?.order ?? -1) + 1 },
  });
};

export const deletePropertyImage = async (propertyId: string, imageId: string, tenantId: string) => {
  const p = await prisma.property.findFirst({ where: { id: propertyId, tenantId } });
  if (!p) throw new AppError('Properti tidak ditemukan', 404);
  const img = await prisma.propertyImage.findFirst({ where: { id: imageId, propertyId } });
  if (!img) throw new AppError('Gambar tidak ditemukan', 404);
  if (img.cloudinary_public_id) await deleteFromCloudinary(img.cloudinary_public_id);
  return prisma.propertyImage.delete({ where: { id: imageId } });
};

export const getDashboardStats = async (tenantId: string) => {
  const [propertyCount, roomCount, pendingOrders, recentOrders, revenue] = await Promise.all([
    prisma.property.count({ where: { tenantId, deleted_at: null } }),
    prisma.room.count({ where: { property: { tenantId }, deleted_at: null } }),
    prisma.order.count({ where: { property: { tenantId }, status: 'WAITING_CONFIRMATION' } }),
    prisma.order.findMany({
      where: { property: { tenantId } },
      include: { user: { select: { name: true } }, property: { select: { name: true } }, room: { select: { room_type: true } } },
      orderBy: { created_at: 'desc' }, take: 5,
    }),
    prisma.order.aggregate({
      where: { property: { tenantId }, status: 'PROCESSED', payment_verified_at: { gte: new Date(new Date().setDate(1)) } },
      _sum: { total_price: true },
    }),
  ]);
  return { propertyCount, roomCount, pendingOrders, monthlyRevenue: revenue._sum.total_price || 0, recentOrders };
};
