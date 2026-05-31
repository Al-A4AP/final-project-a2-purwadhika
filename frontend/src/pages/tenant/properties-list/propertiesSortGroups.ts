import type { SortGroup } from "@/components/common/SortFilterBar";

export const tenantSortGroups: SortGroup[] = [
  { key: "created_at", label: "Tanggal", icon: "clock", options: [{ order: "desc", label: "Terbaru" }, { order: "asc", label: "Terlama" }] },
  { key: "name", label: "Nama", icon: "alpha", options: [{ order: "asc", label: "A - Z" }, { order: "desc", label: "Z - A" }] },
];
