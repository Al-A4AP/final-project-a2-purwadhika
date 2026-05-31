import type { SelectOption, SortOrder } from "./types";

export const ORDER_SORT_OPTIONS: SelectOption[] = [
  { value: "created_at-desc", label: "Tanggal: Terbaru" },
  { value: "created_at-asc", label: "Tanggal: Terlama" },
  { value: "total_price-desc", label: "Total: Termahal" },
  { value: "total_price-asc", label: "Total: Termurah" },
];

export const parseSortValue = (value: string): { sortBy: string; sortOrder: SortOrder } => {
  const [sortBy, sortOrder] = value.split("-");
  return { sortBy, sortOrder: sortOrder === "asc" ? "asc" : "desc" };
};
