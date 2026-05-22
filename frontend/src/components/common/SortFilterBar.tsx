import type { FC } from 'react';
import { useState, useRef, useEffect } from 'react';
import { ArrowUpDown, TrendingUp, Star, DollarSign, Clock, BedDouble, ChevronDown } from 'lucide-react';
import { PropertyFilterDropdown } from '../user/PropertyFilterDropdown';

export interface SortSubOption {
  order: 'asc' | 'desc';
  label: string;
}

export interface SortGroup {
  key: string;
  label: string;
  icon?: 'trending' | 'star' | 'price' | 'clock' | 'bed' | 'alpha';
  options: [SortSubOption, SortSubOption]; // always exactly 2: desc first, asc second
}

interface Props {
  sortGroups: SortGroup[];
  currentSort: string;
  currentOrder: 'asc' | 'desc';
  onChange: (sort: string, order: 'asc' | 'desc') => void;
  resultCount?: number;
  resultLabel?: string;
}

const iconMap: Record<string, React.ReactNode> = {
  trending: <TrendingUp size={13} />,
  star:     <Star size={13} />,
  price:    <DollarSign size={13} />,
  clock:    <Clock size={13} />,
  bed:      <BedDouble size={13} />,
  alpha:    <span className="text-xs font-bold leading-none">Az</span>,
};

const SortFilterBar: FC<Props> = ({
  sortGroups,
  currentSort,
  currentOrder,
  onChange,
  resultCount,
  resultLabel = 'hasil',
}) => {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleGroupClick = (group: SortGroup) => {
    if (openGroup === group.key) {
      setOpenGroup(null);
    } else {
      setOpenGroup(group.key);
      if (currentSort !== group.key) {
        onChange(group.key, group.options[0].order);
      }
    }
  };

  const handleSubOption = (group: SortGroup, sub: SortSubOption) => {
    onChange(group.key, sub.order);
    setOpenGroup(null);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openGroup) {
        const ref = dropdownRefs.current[openGroup];
        if (ref && !ref.contains(event.target as Node)) {
          setOpenGroup(null);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openGroup]);

  return (
    <div className="mb-6">
      {/* Header: jumlah hasil + label */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b dark:border-slate-800 mb-4">
        {resultCount !== undefined && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-900 dark:text-white">{resultCount}</span> {resultLabel}
          </p>
        )}

        {/* Sort & Filter Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Integrated Filter Dropdown */}
          <PropertyFilterDropdown />

          <div className="hidden sm:block w-px h-5 bg-slate-200 dark:bg-slate-800 mx-1" />

          <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider shrink-0">
            <ArrowUpDown size={13} /> Urutkan:
          </span>

          {sortGroups.map((group) => {
            const isActive = currentSort === group.key;
            const isOpen = openGroup === group.key;
            const activeSubLabel = isActive
              ? group.options.find(o => o.order === currentOrder)?.label
              : null;

            return (
              <div 
                key={group.key} 
                className="relative inline-block text-left"
                ref={el => { dropdownRefs.current[group.key] = el; }}
              >
                {/* Grup Button */}
                <button
                  onClick={() => handleGroupClick(group)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition border ${
                    isActive
                      ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                      : isOpen
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-850 hover:border-rose-450 hover:text-rose-600'
                  }`}
                >
                  {group.icon && iconMap[group.icon]}
                  {isActive && activeSubLabel ? activeSubLabel : group.label}
                  <ChevronDown
                    size={11}
                    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Sub-opsi: Dropdown Menu */}
                {isOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-40 origin-top-left animate-fade-in">
                    {group.options.map((sub) => {
                      const isSubActive = isActive && currentOrder === sub.order;
                      return (
                        <button
                          key={sub.order}
                          onClick={() => handleSubOption(group, sub)}
                          className={`w-full text-left px-5 py-2.5 text-xs font-semibold transition ${
                            isSubActive
                              ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          {sub.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SortFilterBar;
