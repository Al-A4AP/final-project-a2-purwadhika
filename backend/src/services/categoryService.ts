import type { Prisma } from "@prisma/client";
import prisma from "../config/prisma";
import { MAX_CATEGORIES_PER_TENANT } from "../constants/validation";
import { AppError } from "../middlewares/errorHandler";
import type {
  CategoryInput,
  CategoryQuery,
} from "../validations/categoryValidation";
import { isDefaultCategoryName } from "./category/defaultCategories";

type CategoryTransaction = Prisma.TransactionClient;

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
  database: Pick<CategoryTransaction, "propertyCategory"> = prisma,
  exceptId?: string,
) => {
  const existing = await database.propertyCategory.findFirst({
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

const findCategoryPage = (
  where: Prisma.PropertyCategoryWhereInput,
  orderBy: Prisma.PropertyCategoryOrderByWithRelationInput,
  page: number,
  limit: number,
  tenantId: string,
) => Promise.all([
  prisma.propertyCategory.findMany({
    where,
    orderBy,
    skip: (page - 1) * limit,
    take: limit,
  }),
  prisma.propertyCategory.count({ where }),
  prisma.propertyCategory.count({ where: { tenantId } }),
]);

export const listCategories = async (
  tenantId: string,
  query: CategoryQuery,
) => {
  const { page, limit } = normalizePagination(query.page, query.limit);
  const where = buildSearchWhere(query.search);
  const orderBy = buildOrderBy(query.sortBy, query.sortOrder);
  const [categories, total, owned] = await findCategoryPage(where, orderBy, page, limit, tenantId);
  return {
    categories,
    categoryQuota: buildCategoryQuota(owned),
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

export const createCategory = async (tenantId: string, data: CategoryInput) => {
  return prisma.$transaction(async (tx) => {
    await lockTenantCategoryCreate(tx, tenantId);
    await ensureCategoryLimit(tx, tenantId);
    await ensureNameAvailable(data.name, tx);
    return tx.propertyCategory.create({
      data: {
        name: data.name.trim(),
        description: data.description,
        default_rental_type: data.default_rental_type,
        tenantId,
      },
    });
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
  await ensureNameAvailable(data.name, prisma, id);
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

const buildCategoryQuota = (owned: number) => ({
  limit: MAX_CATEGORIES_PER_TENANT,
  owned,
  remaining: Math.max(0, MAX_CATEGORIES_PER_TENANT - owned),
});

const lockTenantCategoryCreate = (
  tx: CategoryTransaction,
  tenantId: string,
) => tx.$executeRaw`
  SELECT pg_advisory_xact_lock(hashtextextended(${"tenant-category:" + tenantId}, 0))
`;

const ensureCategoryLimit = async (
  tx: CategoryTransaction,
  tenantId: string,
) => {
  const owned = await tx.propertyCategory.count({ where: { tenantId } });
  if (owned >= MAX_CATEGORIES_PER_TENANT) {
    throw new AppError(`Maksimal ${MAX_CATEGORIES_PER_TENANT} kategori milik sendiri per tenant.`, 400);
  }
};
