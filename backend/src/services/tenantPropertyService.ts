import prisma from '../config/prisma';
import { uploadBuffer, deleteFromCloudinary } from '../utils/cloudinaryUpload';
import { AppError } from '../middlewares/errorHandler';

export interface GetTenantPropertiesOptions {
  search?: string;
  categoryId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export const getTenantProperties = async (tenantId: string, options: GetTenantPropertiesOptions = {}) => {
  const {
    search,
    categoryId,
    sortBy = 'created_at',
    sortOrder = 'desc',
    page = 1,
    limit = 10,
  } = options;

  const skip = (page - 1) * limit;

  const where: any = {
    tenantId,
    deleted_at: null,
  };

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { address: { contains: search, mode: 'insensitive' } },
      { city: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Handle client-side sorting names to match database names
  let dbSortBy = sortBy;
  if (sortBy === 'price') {
    // For simplicity, sort by rooms min price logic requires raw queries or sorting on main field. We'll default to created_at
    dbSortBy = 'created_at';
  } else if (sortBy === 'rooms' || sortBy === 'reviews') {
    dbSortBy = 'created_at';
  }

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      include: {
        category: true,
        rooms: { where: { deleted_at: null }, select: { base_price: true } },
        _count: { select: { rooms: true, orders: true, reviews: true } },
      },
      orderBy: { [dbSortBy]: sortOrder },
      skip,
      take: limit,
    }),
    prisma.property.count({ where }),
  ]);

  return {
    properties,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getTenantPropertyById = async (id: string, tenantId: string) => {
  const p = await prisma.property.findFirst({
    where: { id, tenantId, deleted_at: null },
    include: {
      category: true,
      images: { orderBy: { order: 'asc' } },
      rooms: {
        where: { deleted_at: null },
        include: { images: { orderBy: { order: 'asc' } }, peakRates: { where: { deleted_at: null } } },
      },
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
      province: data.province || undefined,
      amenities: parseAmenities(data.amenities),
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
      province: data.province ?? existing.province,
      amenities: data.amenities !== undefined ? parseAmenities(data.amenities) : existing.amenities,
      latitude: data.latitude ? Number(data.latitude) : existing.latitude,
      longitude: data.longitude ? Number(data.longitude) : existing.longitude,
      featured_image_url,
    },
  });
};

const parseAmenities = (value?: string | string[]) => {
  if (!value) return [];
  const values = Array.isArray(value) ? value : value.split(',');
  return values.map((item) => item.trim()).filter(Boolean);
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

const verifyAndDeleteImageRecord = async (tx: any, propertyId: string, imageId: string, tenantId: string) => {
  const p = await tx.property.findFirst({ where: { id: propertyId, tenantId } });
  if (!p) throw new AppError('Properti tidak ditemukan', 404);
  const img = await tx.propertyImage.findFirst({ where: { id: imageId, propertyId } });
  if (!img) throw new AppError('Gambar tidak ditemukan', 404);
  return tx.propertyImage.delete({ where: { id: imageId } });
};

export const deletePropertyImage = async (propertyId: string, imageId: string, tenantId: string) => {
  const deleted = await prisma.$transaction((tx) =>
    verifyAndDeleteImageRecord(tx, propertyId, imageId, tenantId)
  );
  if (deleted.cloudinary_public_id) {
    try { await deleteFromCloudinary(deleted.cloudinary_public_id); }
    catch { /* Log manual cleanup needed, don't fail operation */ }
  }
  return deleted;
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
