import type { FC } from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';

interface FilterTriggerProps {
  isOpen: boolean;
  hasActiveFilters: boolean;
  onClick: () => void;
}

const getStateClass = (isOpen: boolean, hasActiveFilters: boolean) => {
  if (hasActiveFilters) return 'bg-rose-600 text-white border-rose-600 shadow-sm';
  if (isOpen) return 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600';
  return 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-rose-400 hover:text-rose-600';
};

export const FilterTrigger: FC<FilterTriggerProps> = ({ isOpen, hasActiveFilters, onClick }) => (
  <button onClick={onClick} className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition border ${getStateClass(isOpen, hasActiveFilters)}`}>
    <SlidersHorizontal size={13} />
    Filter
    {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
    <ChevronDown size={11} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
  </button>
);
