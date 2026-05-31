import type { FC } from "react";
import { FilterChips, type FilterChipItem } from "@/components/common/FilterChips";
import { AMENITIES_LIST } from "@/lib/amenities";
import { formatDate, formatPrice } from "@/lib/formatters";
import { useFilterStore, type FilterValues } from "@/stores/filterStore";

type ApplyFilters = (values: FilterValues) => void;

export const HomeFilterChips: FC<{ activeFilters: FilterValues }> = ({ activeFilters }) => {
  const filters = useFilterStore();
  const apply = (values: FilterValues) => filters.applyFilterValues({ ...values, page: 1 });
  return <FilterChips chips={buildFilterChips(activeFilters, apply)} onClearAll={filters.resetFilters} />;
};

const buildFilterChips = (values: FilterValues, apply: ApplyFilters): FilterChipItem[] => [
  ...searchChip(values, apply),
  ...cityChip(values, apply),
  ...dateChip(values, apply),
  ...priceChip(values, apply),
  ...categoryChip(values, apply),
  ...amenityChips(values, apply),
];

const createChip = (id: string, label: string, values: FilterValues, patch: Partial<FilterValues>, apply: ApplyFilters) => ({
  id,
  label,
  onRemove: () => apply({ ...values, ...patch, page: 1 }),
});

const searchChip = (values: FilterValues, apply: ApplyFilters) =>
  values.search.trim() ? [createChip("search", `Nama: ${values.search.trim()}`, values, { search: "" }, apply)] : [];

const cityChip = (values: FilterValues, apply: ApplyFilters) =>
  values.city ? [createChip("city", `Kota: ${values.city}`, values, { city: "" }, apply)] : [];

const dateChip = (values: FilterValues, apply: ApplyFilters) => {
  const label = getDateLabel(values);
  return label ? [createChip("date", label, values, { check_in_date: "", check_out_date: "" }, apply)] : [];
};

const priceChip = (values: FilterValues, apply: ApplyFilters) => {
  const label = getPriceLabel(values.min_price, values.max_price);
  return label ? [createChip("price", label, values, { max_price: undefined, min_price: undefined }, apply)] : [];
};

const categoryChip = (values: FilterValues, apply: ApplyFilters) =>
  values.category ? [createChip("category", `Kategori: ${values.category}`, values, { category: "" }, apply)] : [];

const amenityChips = (values: FilterValues, apply: ApplyFilters) =>
  values.amenities.map((id) => createChip(`amenity-${id}`, `Fasilitas: ${amenityLabel(id)}`, values, { amenities: values.amenities.filter((item) => item !== id) }, apply));

const getDateLabel = (values: FilterValues) => {
  if (values.check_in_date && values.check_out_date) return `Tanggal: ${formatDate(values.check_in_date)} - ${formatDate(values.check_out_date)}`;
  if (values.check_in_date) return `Mulai: ${formatDate(values.check_in_date)}`;
  if (values.check_out_date) return `Sampai: ${formatDate(values.check_out_date)}`;
  return "";
};

const getPriceLabel = (min?: number, max?: number) => {
  if (min !== undefined && max !== undefined) return `Harga: ${formatPrice(min)} - ${formatPrice(max)}`;
  if (min !== undefined) return `Harga min: ${formatPrice(min)}`;
  if (max !== undefined) return `Harga maks: ${formatPrice(max)}`;
  return "";
};

const amenityLabel = (id: string) =>
  AMENITIES_LIST.find((amenity) => amenity.id === id)?.label || id;
