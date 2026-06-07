export const PEAK_PROPERTY_LIMIT = 6;

export const PEAK_SORT_OPTIONS = [
  { label: "Nama A-Z", sortBy: "name", sortOrder: "asc", value: "name-asc" },
  { label: "Nama Z-A", sortBy: "name", sortOrder: "desc", value: "name-desc" },
  { label: "Termurah", sortBy: "min_price", sortOrder: "asc", value: "min_price-asc" },
  { label: "Termahal", sortBy: "min_price", sortOrder: "desc", value: "min_price-desc" },
] as const;

export type PeakSortValue = typeof PEAK_SORT_OPTIONS[number]["value"];

export const getSortParams = (value: PeakSortValue) => {
  const option = PEAK_SORT_OPTIONS.find((item) => item.value === value) || PEAK_SORT_OPTIONS[0];
  return { sortBy: option.sortBy, sortOrder: option.sortOrder };
};
