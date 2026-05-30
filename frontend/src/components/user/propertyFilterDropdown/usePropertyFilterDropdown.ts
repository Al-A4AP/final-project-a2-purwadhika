import { useCallback, useRef, useState } from 'react';
import { useFilterStore } from '@/stores/filterStore';
import type { PriceDraft } from './types';
import { useOutsideClick } from './useOutsideClick';

type FilterState = ReturnType<typeof useFilterStore.getState>;

const toggleItem = (items: string[], id: string) =>
  items.includes(id) ? items.filter((item) => item !== id) : [...items, id];

const hasActiveFilters = (filters: FilterState) =>
  filters.min_price !== undefined || filters.max_price !== undefined || !!filters.amenities?.length;

const useFilterDraft = (filters: FilterState) => {
  const [minPrice, setMinPrice] = useState<PriceDraft>(filters.min_price ?? '');
  const [maxPrice, setMaxPrice] = useState<PriceDraft>(filters.max_price ?? '');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(filters.amenities || []);
  const sync = () => { setMinPrice(filters.min_price ?? ''); setMaxPrice(filters.max_price ?? ''); setSelectedAmenities(filters.amenities || []); };
  const apply = () => { filters.setMinPrice(minPrice === '' ? undefined : Number(minPrice)); filters.setMaxPrice(maxPrice === '' ? undefined : Number(maxPrice)); filters.setAmenities(selectedAmenities); filters.applyFilters(); };
  const clear = () => { setMinPrice(''); setMaxPrice(''); setSelectedAmenities([]); filters.setMinPrice(undefined); filters.setMaxPrice(undefined); filters.setAmenities([]); filters.applyFilters(); };
  const toggleAmenity = (id: string) => setSelectedAmenities((items) => toggleItem(items, id));
  return { minPrice, maxPrice, selectedAmenities, setMinPrice, setMaxPrice, sync, apply, clear, toggleAmenity };
};

export const usePropertyFilterDropdown = () => {
  const filters = useFilterStore();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const draft = useFilterDraft(filters);
  const close = useCallback(() => setIsOpen(false), []);
  useOutsideClick(dropdownRef, close);
  const toggleDropdown = () => { if (!isOpen) draft.sync(); setIsOpen((open) => !open); };
  const apply = () => { draft.apply(); setIsOpen(false); };
  return { ...draft, isOpen, dropdownRef, toggleDropdown, apply, hasActiveFilters: hasActiveFilters(filters) };
};
