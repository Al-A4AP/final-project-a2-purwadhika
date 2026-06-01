const DEFAULT_CATEGORY_NAMES = ["Apartemen", "Hotel", "Kost", "Rumah", "Villa"];

const normalizeCategoryName = (name: string) => name.trim().toLocaleLowerCase("id-ID");

const defaultCategorySet = new Set(DEFAULT_CATEGORY_NAMES.map(normalizeCategoryName));

export const isDefaultCategoryName = (name: string) => defaultCategorySet.has(normalizeCategoryName(name));
