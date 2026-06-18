import { uploadBuffer } from "../utils/cloudinaryUpload";
import { AppError } from "../middlewares/errorHandler";
import prisma from "../config/prisma";
import { MAX_PROPERTIES_PER_TENANT } from "../constants/validation";
import { getTenantDashboardStats } from "./tenantProperty/dashboardStats";
import {
  buildPropertyCreateData,
  buildPropertyUpdateData,
  buildTenantPropertyWhere,
  normalizePropertyOptions,
} from "./tenantProperty/tenantPropertyFilters";
import {
  createPropertyImage,
  removePropertyImage,
} from "./tenantProperty/propertyImages";
import {
  countTenantProperties,
  createTenantProperty,
  findTenantProperties,
  findTenantProperty,
  findTenantPropertyDetail,
  findTenantPropertyNameConflict,
  softDeleteTenantProperty,
  updateTenantProperty,
  updateTenantPropertyWithWholeRoom,
} from "./tenantProperty/tenantPropertyQueries";
import type {
  GetDashboardStatsOptions,
  GetTenantPropertiesOptions,
  PropertyFormData,
} from "./tenantProperty/tenantPropertyTypes";
import { buildWholePropertyRoomData } from "./tenantProperty/wholePropertyRoom";

export type { GetTenantPropertiesOptions } from "./tenantProperty/tenantPropertyTypes";
type PropertyUpdateFormData = PropertyFormData & { featured_image_url?: string };

export const getTenantProperties = async (
  tenantId: string,
  options: GetTenantPropertiesOptions = {},
) => {
  const normalized = normalizePropertyOptions(options);
  const where = buildTenantPropertyWhere(tenantId, normalized);
  const [properties, total] = await Promise.all([
    findTenantProperties(where, normalized),
    countTenantProperties(where),
  ]);
  return {
    properties,
    pagination: buildPagination(normalized.page, normalized.limit, total),
  };
};

export const getTenantPropertyById = async (id: string, tenantId: string) => {
  const property = await findTenantPropertyDetail(id, tenantId);
  if (!property) throw new AppError("Properti tidak ditemukan", 404);
  return property;
};

const ensureCategoryAccessible = async (
  categoryId: string,
) => {
  const category = await prisma.propertyCategory.findUnique({
    where: { id: categoryId },
  });
  if (!category)
    throw new AppError("Kategori tidak ditemukan atau tidak tersedia", 404);
  return category;
};

export const createProperty = async (
  tenantId: string,
  data: PropertyFormData,
  file?: Express.Multer.File,
) => {
  if (!file) throw new AppError("Foto utama properti wajib diupload", 400);
  await ensurePropertyLimit(tenantId);
  await ensurePropertyNameAvailable(tenantId, data.name);
  await ensureCategoryAccessible(data.categoryId);
  const featuredImageUrl = await uploadFeaturedImage(file);
  return createTenantProperty(
    buildPropertyCreateData(tenantId, data, featuredImageUrl),
  );
};

export const updateProperty = async (id: string, tenantId: string, data: PropertyUpdateFormData, file?: Express.Multer.File) => {
  const existing = await findTenantPropertyOrThrow(id, tenantId);
  await ensurePropertyNameAvailable(tenantId, data.name, id);
  if (data.categoryId)
    await ensureCategoryAccessible(data.categoryId);
  const featuredImageUrl = await resolveFeaturedImageUrl(file, data.featured_image_url, existing.featured_image_url);
  const updateData = buildPropertyUpdateData(data, existing, featuredImageUrl);
  return persistPropertyUpdate(id, data, updateData);
};

const persistPropertyUpdate = (
  id: string,
  data: PropertyFormData,
  updateData: Parameters<typeof updateTenantProperty>[1],
) => {
  return data.rental_type === "WHOLE_PROPERTY"
    ? updateTenantPropertyWithWholeRoom(
        id,
        updateData,
        buildWholePropertyRoomData(data),
      )
    : updateTenantProperty(id, updateData);
};

export const deleteProperty = async (id: string, tenantId: string) => {
  await findTenantPropertyOrThrow(id, tenantId);
  const orderCount = await prisma.order.count({
    where: { propertyId: id, status: { not: "CANCELLED" } },
  });
  if (orderCount > 0) {
    throw new AppError("Properti tidak dapat dihapus karena sudah memiliki riwayat pemesanan aktif.", 400);
  }
  return softDeleteTenantProperty(id);
};

export const addPropertyImage = (
  propertyId: string,
  tenantId: string,
  file: Express.Multer.File,
) => createPropertyImage(propertyId, tenantId, file);

export const deletePropertyImage = (
  propertyId: string,
  imageId: string,
  tenantId: string,
) => removePropertyImage(propertyId, imageId, tenantId);

export const getDashboardStats = (
  tenantId: string,
  options?: GetDashboardStatsOptions,
) => getTenantDashboardStats(tenantId, options);

const buildPagination = (page: number, limit: number, total: number) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
});
const uploadFeaturedImage = async (file?: Express.Multer.File) =>
  file ? (await uploadBuffer(file.buffer)).url : undefined;
const resolveFeaturedImageUrl = (
  file: Express.Multer.File | undefined,
  submittedUrl: string | undefined,
  existingUrl: string | null,
) => file ? uploadFeaturedImage(file) : submittedUrl || existingUrl || undefined;

const ensurePropertyLimit = async (tenantId: string) => {
  const total = await countTenantProperties({ tenantId, deleted_at: null });
  if (total >= MAX_PROPERTIES_PER_TENANT) {
    throw new AppError(`Maksimal ${MAX_PROPERTIES_PER_TENANT} properti per tenant.`, 400);
  }
};

const ensurePropertyNameAvailable = async (
  tenantId: string,
  name?: string,
  exceptId?: string,
) => {
  if (!name?.trim()) return;
  const duplicate = await findTenantPropertyNameConflict(tenantId, name, exceptId);
  if (duplicate) throw new AppError("Nama properti sudah digunakan oleh tenant ini.", 409);
};

const findTenantPropertyOrThrow = async (id: string, tenantId: string) => {
  const property = await findTenantProperty(id, tenantId);
  if (!property) throw new AppError("Properti tidak ditemukan", 404);
  return property;
};
