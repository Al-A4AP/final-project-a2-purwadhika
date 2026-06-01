import { useCallback, useEffect, useRef, useState } from 'react';
import { useFilterStore } from '@/stores/filterStore';
import { propertyService } from '@/services/propertyService';
import type { PropertyCategory } from '@/types';
import type { PriceDraft } from './types';
import { useOutsideClick } from '@/hooks/useOutsideClick';

type FilterState = ReturnType<typeof useFilterStore.getState>;

const toggleItem = (items: string[], id: string) =>
  items.includes(id) ? items.filter((item) => item !== id) : [...items, id];

const hasActiveFilters = (filters: FilterState) =>
  !!filters.search || !!filters.category || filters.min_price !== undefined || filters.max_price !== undefined || !!filters.amenities?.length;

const useCategoryOptions = () => {
  const [categories, setCategories] = useState<PropertyCategory[]>([]);
  useEffect(() => {
    const load = async () => setCategories(await propertyService.getCategories());
    load().catch(() => setCategories([]));
  }, []);
  return categories;
};

const useFilterDraft = (filters: FilterState) => {
  const [search, setSearch] = useState(filters.search || '');
  const [category, setCategory] = useState(filters.category || '');
  const [minPrice, setMinPrice] = useState<PriceDraft>(filters.min_price ?? '');
  const [maxPrice, setMaxPrice] = useState<PriceDraft>(filters.max_price ?? '');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(filters.amenities || []);
  const sync = () => { setSearch(filters.search || ''); setCategory(filters.category || ''); setMinPrice(filters.min_price ?? ''); setMaxPrice(filters.max_price ?? ''); setSelectedAmenities(filters.amenities || []); };
  const apply = () => { filters.setSearch(search.trim()); filters.setCategory(category); filters.setMinPrice(minPrice === '' ? undefined : Number(minPrice)); filters.setMaxPrice(maxPrice === '' ? undefined : Number(maxPrice)); filters.setAmenities(selectedAmenities); filters.applyFilters(); };
  const clear = () => { setSearch(''); setCategory(''); setMinPrice(''); setMaxPrice(''); setSelectedAmenities([]); filters.setSearch(''); filters.setCategory(''); filters.setMinPrice(undefined); filters.setMaxPrice(undefined); filters.setAmenities([]); filters.applyFilters(); };
  const toggleAmenity = (id: string) => setSelectedAmenities((items) => toggleItem(items, id));
  return { search, category, minPrice, maxPrice, selectedAmenities, setSearch, setCategory, setMinPrice, setMaxPrice, sync, apply, clear, toggleAmenity };
};

export const usePropertyFilterDropdown = () => {
  const filters = useFilterStore();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const draft = useFilterDraft(filters);
  const categories = useCategoryOptions();
  const close = useCallback(() => setIsOpen(false), []);
  useOutsideClick(dropdownRef, close);
  const toggleDropdown = () => { if (!isOpen) draft.sync(); setIsOpen((open) => !open); };
  const apply = () => { draft.apply(); setIsOpen(false); };
  return { ...draft, categories, isOpen, dropdownRef, toggleDropdown, apply, hasActiveFilters: hasActiveFilters(filters) };
};
