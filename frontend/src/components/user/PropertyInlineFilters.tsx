import type { FC } from 'react';
import { FilterPanel } from './propertyFilterDropdown/FilterPanel';
import { usePropertyFilterDropdown } from './propertyFilterDropdown/usePropertyFilterDropdown';

export const PropertyInlineFilters: FC<{ onApplied?: () => void }> = ({ onApplied }) => {
  const { apply, categories, clear, ...panel } = usePropertyFilterDropdown();
  return <FilterPanel {...panel} categories={categories} onApply={() => runAction(apply, onApplied)} onClear={() => runAction(clear, onApplied)} variant="inline" />;
};

const runAction = (action: () => void, onApplied?: () => void) => {
  action();
  onApplied?.();
};
