import type { FC } from 'react';
import { FilterPanel } from './propertyFilterDropdown/FilterPanel';
import { FilterTrigger } from './propertyFilterDropdown/FilterTrigger';
import { usePropertyFilterDropdown } from './propertyFilterDropdown/usePropertyFilterDropdown';

export const PropertyFilterDropdown: FC = () => {
  const { apply, clear, dropdownRef, hasActiveFilters, isOpen, toggleDropdown, ...panel } =
    usePropertyFilterDropdown();

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <FilterTrigger isOpen={isOpen} hasActiveFilters={hasActiveFilters} onClick={toggleDropdown} />
      {isOpen && <FilterPanel {...panel} onApply={apply} onClear={clear} />}
    </div>
  );
};
