import { uploadBuffer } from "../utils/cloudinaryUpload";
import { AppError } from "../middlewares/errorHandler";
import prisma from "../config/prisma";
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
  softDeleteTenantProperty,
  updateTenantProperty,
} from "./tenantProperty/tenantPropertyQueries";
import type {
  GetDashboardStatsOptions,
  GetTenantPropertiesOptions,
  PropertyFormData,
} from "./tenantProperty/tenantPropertyTypes";

export type { GetTenantPropertiesOptions } from "./tenantProperty/tenantPropertyTypes";

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
  tenantId: string,
) => {
  const category = await prisma.propertyCategory.findFirst({
    where: {
      id: categoryId,
      OR: [{ tenantId: null }, { tenantId }],
    },
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
  await ensureCategoryAccessible(data.categoryId, tenantId);
  const featuredImageUrl = await uploadFeaturedImage(file);
  return createTenantProperty(
    buildPropertyCreateData(tenantId, data, featuredImageUrl),
  );
};

export const updateProperty = async (
  id: string,
  tenantId: string,
  data: PropertyFormData & { featured_image_url?: string },
  file?: Express.Multer.File,
) => {
  const existing = await findTenantPropertyOrThrow(id, tenantId);
  if (data.categoryId)
    await ensureCategoryAccessible(data.categoryId, tenantId);
  const featuredImageUrl = file
    ? await uploadFeaturedImage(file)
    : data.featured_image_url || existing.featured_image_url;
  return updateTenantProperty(
    id,
    buildPropertyUpdateData(data, existing, featuredImageUrl),
  );
};

export const deleteProperty = async (id: string, tenantId: string) => {
  await findTenantPropertyOrThrow(id, tenantId);
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
const findTenantPropertyOrThrow = async (id: string, tenantId: string) => {
  const property = await findTenantProperty(id, tenantId);
  if (!property) throw new AppError("Properti tidak ditemukan", 404);
  return property;
};
