import type { PrismaClient, PropertyCategory } from '@prisma/client';
import { CATEGORIES_DATA, type CategoryName } from './data';

export type CategoryMap = Record<CategoryName, PropertyCategory>;

export const createCategories = async (prisma: PrismaClient): Promise<CategoryMap> => {
  const categories = await Promise.all(
    CATEGORIES_DATA.map((data) => prisma.propertyCategory.create({ data })),
  );

  return Object.fromEntries(categories.map((category) => [category.name, category])) as CategoryMap;
};
