import type { Dispatch, FC, SetStateAction } from 'react';
import { PANEL_CLASS } from './constants';
import { AmenitiesGrid } from './AmenitiesGrid';
import { FilterActions } from './FilterActions';
import { PriceRangeFields } from './PriceRangeFields';
import type { PriceDraft } from './types';

interface FilterPanelProps {
  minPrice: PriceDraft;
  maxPrice: PriceDraft;
  selectedAmenities: string[];
  setMinPrice: Dispatch<SetStateAction<PriceDraft>>;
  setMaxPrice: Dispatch<SetStateAction<PriceDraft>>;
  toggleAmenity: (id: string) => void;
  onClear: () => void;
  onApply: () => void;
}

export const FilterPanel: FC<FilterPanelProps> = (props) => (
  <div className={PANEL_CLASS}><div className="space-y-5">
    <PriceRangeFields minPrice={props.minPrice} maxPrice={props.maxPrice} setMinPrice={props.setMinPrice} setMaxPrice={props.setMaxPrice} />
    <AmenitiesGrid selectedAmenities={props.selectedAmenities} onToggle={props.toggleAmenity} />
    <FilterActions onClear={props.onClear} onApply={props.onApply} />
  </div></div>
);
