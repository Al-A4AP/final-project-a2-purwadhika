import prisma from '../config/prisma';
import { AppError } from '../middlewares/errorHandler';
import type { CategoryInput, CategoryQuery } from '../validations/categoryValidation';
import { isDefaultCategoryName } from './category/defaultCategories';

const normalizePagination = (page?: number, limit?: number) => ({
  page: Math.max(1, Number(page || 1)),
  limit: Math.min(50, Math.max(1, Number(limit || 10))),
});

const buildWhere = (search?: string) => (
  search?.trim() ? { name: { contains: search.trim(), mode: 'insensitive' as const } } : {}
);

const buildOrderBy = (sortBy = 'name', sortOrder = 'asc') => ({
  [sortBy === 'updated_at' ? 'updated_at' : 'name']: sortOrder === 'desc' ? 'desc' : 'asc',
});

const ensureNameAvailable = async (name: string, exceptId?: string) => {
  const existing = await prisma.propertyCategory.findFirst({ where: { name, id: exceptId ? { not: exceptId } : undefined } });
  if (existing) throw new AppError('Nama kategori sudah digunakan', 400);
};

const findCategory = async (id: string) => {
  const category = await prisma.propertyCategory.findUnique({ where: { id } });
  if (!category) throw new AppError('Kategori tidak ditemukan', 404);
  return category;
};

const ensureCustomCategory = (name: string, action: 'diubah' | 'dihapus') => {
  if (isDefaultCategoryName(name)) throw new AppError(`Kategori default sistem tidak bisa ${action}`, 400);
};

export const listCategories = async (query: CategoryQuery) => {
  const { page, limit } = normalizePagination(query.page, query.limit);
  const where = buildWhere(query.search);
  const orderBy = buildOrderBy(query.sortBy, query.sortOrder);
  const [categories, total] = await Promise.all([
    prisma.propertyCategory.findMany({ where, orderBy, skip: (page - 1) * limit, take: limit }),
    prisma.propertyCategory.count({ where }),
  ]);
  return { categories, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } };
};

export const createCategory = async (data: CategoryInput) => {
  await ensureNameAvailable(data.name);
  return prisma.propertyCategory.create({ data: { name: data.name } });
};

export const updateCategory = async (id: string, data: CategoryInput) => {
  const category = await findCategory(id);
  ensureCustomCategory(category.name, 'diubah');
  await ensureNameAvailable(data.name, id);
  return prisma.propertyCategory.update({ where: { id }, data: { name: data.name } });
};

export const deleteCategory = async (id: string) => {
  const category = await findCategory(id);
  ensureCustomCategory(category.name, 'dihapus');
  const used = await prisma.property.count({ where: { categoryId: id, deleted_at: null } });
  if (used > 0) throw new AppError('Kategori sedang digunakan oleh properti', 400);
  await prisma.propertyCategory.delete({ where: { id } });
};
