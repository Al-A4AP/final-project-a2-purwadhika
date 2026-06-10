import type { Prisma } from "@prisma/client";
import prisma from "../config/prisma";
import { AppError } from "../middlewares/errorHandler";
import type {
  CategoryInput,
  CategoryQuery,
} from "../validations/categoryValidation";
import { isDefaultCategoryName } from "./category/defaultCategories";

const normalizePagination = (page?: number, limit?: number) => ({
  page: Math.max(1, Number(page || 1)),
  limit: Math.min(50, Math.max(1, Number(limit || 10))),
});

const buildSearchWhere = (search?: string): Prisma.PropertyCategoryWhereInput =>
  search?.trim()
    ? { name: { contains: search.trim(), mode: "insensitive" as const } }
    : {};

const buildOrderBy = (
  sortBy = "name",
  sortOrder = "asc",
): Prisma.PropertyCategoryOrderByWithRelationInput => ({
  [sortBy === "updated_at" ? "updated_at" : "name"]:
    sortOrder === "desc" ? "desc" : "asc",
});

const ensureNameAvailable = async (
  name: string,
  tenantId: string, // Kept for signature compatibility
  exceptId?: string,
) => {
  const existing = await prisma.propertyCategory.findFirst({
    where: {
      name: { equals: name.trim(), mode: "insensitive" as const },
      ...(exceptId ? { id: { not: exceptId } } : {}),
    },
  });
  if (existing) throw new AppError("Kategori dengan nama serupa telah tersedia di sistem, silakan gunakan dari daftar yang ada.", 409);
};

const findTenantCategory = async (id: string, tenantId: string) => {
  const category = await prisma.propertyCategory.findUnique({
    where: { id },
  });
  if (!category) throw new AppError("Kategori tidak ditemukan", 404);
  if (category.tenantId !== tenantId) throw new AppError("Anda tidak memiliki akses untuk mengubah kategori ini.", 403);
  return category;
};

const ensureCustomCategory = (name: string, action: "diubah" | "dihapus") => {
  if (isDefaultCategoryName(name))
    throw new AppError(`Kategori default sistem tidak bisa ${action}`, 400);
};

const ensureNotUsed = async (categoryId: string) => {
  const used = await prisma.property.count({
    where: { categoryId, deleted_at: null },
  });
  if (used > 0)
    throw new AppError("Kategori tidak dapat diubah atau dihapus karena sudah digunakan oleh properti.", 409);
};

export const listCategories = async (
  tenantId: string,
  query: CategoryQuery,
) => {
  const { page, limit } = normalizePagination(query.page, query.limit);
  const where = buildSearchWhere(query.search);
  const orderBy = buildOrderBy(query.sortBy, query.sortOrder);
  const [categories, total] = await Promise.all([
    prisma.propertyCategory.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.propertyCategory.count({ where }),
  ]);
  return {
    categories,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

export const createCategory = async (tenantId: string, data: CategoryInput) => {
  await ensureNameAvailable(data.name, tenantId);
  return prisma.propertyCategory.create({
    data: { 
      name: data.name.trim(), 
      description: data.description,
      default_rental_type: data.default_rental_type,
      tenantId 
    },
  });
};

export const updateCategory = async (
  id: string,
  tenantId: string,
  data: CategoryInput,
) => {
  const category = await findTenantCategory(id, tenantId);
  ensureCustomCategory(category.name, "diubah");
  await ensureNotUsed(id);
  await ensureNameAvailable(data.name, tenantId, id);
  return prisma.propertyCategory.update({
    where: { id },
    data: { 
      name: data.name.trim(),
      description: data.description,
      default_rental_type: data.default_rental_type
    },
  });
};

export const deleteCategory = async (id: string, tenantId: string) => {
  const category = await findTenantCategory(id, tenantId);
  ensureCustomCategory(category.name, "dihapus");
  await ensureNotUsed(id);
  await prisma.propertyCategory.delete({ where: { id } });
};
