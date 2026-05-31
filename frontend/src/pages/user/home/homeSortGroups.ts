import type { SortGroup } from "@/components/common/SortFilterBar";

export const HOME_SORT_GROUPS: SortGroup[] = [
  {
    key: "popularity",
    label: "Popularitas",
    icon: "trending",
    options: [{ order: "desc", label: "Terpopuler" }, { order: "asc", label: "Kurang Populer" }],
  },
  {
    key: "price",
    label: "Harga",
    icon: "price",
    options: [{ order: "desc", label: "Termahal" }, { order: "asc", label: "Termurah" }],
  },
  {
    key: "rating",
    label: "Rating",
    icon: "star",
    options: [{ order: "desc", label: "Rating Tertinggi" }, { order: "asc", label: "Rating Terendah" }],
  },
  {
    key: "name",
    label: "Nama",
    icon: "alpha",
    options: [{ order: "asc", label: "A-Z" }, { order: "desc", label: "Z-A" }],
  },
  {
    key: "created_at",
    label: "Tanggal",
    icon: "clock",
    options: [{ order: "desc", label: "Terbaru" }, { order: "asc", label: "Terlama" }],
  },
];
