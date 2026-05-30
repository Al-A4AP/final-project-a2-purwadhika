import type { PrismaClient, PropertyCategory } from '@prisma/client';
import { CATEGORY_NAMES, type CategoryName } from './data';

export type CategoryMap = Record<CategoryName, PropertyCategory>;

export const createCategories = async (prisma: PrismaClient): Promise<CategoryMap> => {
  const categories = await Promise.all(
    CATEGORY_NAMES.map((name) => prisma.propertyCategory.create({ data: { name } })),
  );

  return Object.fromEntries(categories.map((category) => [category.name, category])) as CategoryMap;
};
