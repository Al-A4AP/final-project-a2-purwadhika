import type { Dispatch, FC, SetStateAction } from 'react';
import { PANEL_CLASS } from './constants';
import { AmenitiesGrid } from './AmenitiesGrid';
import { FilterActions } from './FilterActions';
import { PriceRangeFields } from './PriceRangeFields';
import { SearchCategoryFields } from './SearchCategoryFields';
import type { PriceDraft } from './types';
import type { PropertyCategory } from '@/types';

interface FilterPanelProps {
  search: string;
  category: string;
  categories: PropertyCategory[];
  minPrice: PriceDraft;
  maxPrice: PriceDraft;
  selectedAmenities: string[];
  setSearch: Dispatch<SetStateAction<string>>;
  setCategory: Dispatch<SetStateAction<string>>;
  setMinPrice: Dispatch<SetStateAction<PriceDraft>>;
  setMaxPrice: Dispatch<SetStateAction<PriceDraft>>;
  toggleAmenity: (id: string) => void;
  onClear: () => void;
  onApply: () => void;
}

export const FilterPanel: FC<FilterPanelProps> = (props) => (
  <div className={PANEL_CLASS}><div className="space-y-5">
    <SearchCategoryFields search={props.search} category={props.category} categories={props.categories} setSearch={props.setSearch} setCategory={props.setCategory} />
    <PriceRangeFields minPrice={props.minPrice} maxPrice={props.maxPrice} setMinPrice={props.setMinPrice} setMaxPrice={props.setMaxPrice} />
    <AmenitiesGrid selectedAmenities={props.selectedAmenities} onToggle={props.toggleAmenity} />
    <FilterActions onClear={props.onClear} onApply={props.onApply} />
  </div></div>
);
