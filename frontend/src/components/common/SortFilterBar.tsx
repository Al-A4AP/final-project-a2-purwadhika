import type { FC } from 'react';
import { useState } from 'react';
import { ArrowUpDown, TrendingUp, Star, DollarSign, Clock, BedDouble, ChevronDown } from 'lucide-react';

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

  const handleGroupClick = (group: SortGroup) => {
    if (openGroup === group.key) {
      // Tutup jika sudah terbuka
      setOpenGroup(null);
    } else {
      setOpenGroup(group.key);
      // Jika grup belum aktif, pilih sub-opsi default (desc)
      if (currentSort !== group.key) {
        onChange(group.key, group.options[0].order);
      }
    }
  };

  const handleSubOption = (group: SortGroup, sub: SortSubOption) => {
    onChange(group.key, sub.order);
    setOpenGroup(null);
  };

  return (
    <div className="mb-6">
      {/* Header: jumlah hasil + label */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b dark:border-slate-700 mb-4">
        {resultCount !== undefined && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-white">{resultCount}</span> {resultLabel}
          </p>
        )}

        {/* Sort Group Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 font-medium shrink-0">
            <ArrowUpDown size={13} /> Urutkan:
          </span>

          {sortGroups.map((group) => {
            const isActive = currentSort === group.key;
            const isOpen = openGroup === group.key;
            const activeSubLabel = isActive
              ? group.options.find(o => o.order === currentOrder)?.label
              : null;

            return (
              <div key={group.key} className="relative flex items-center gap-1">
                {/* Grup Button */}
                <button
                  onClick={() => handleGroupClick(group)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition border ${
                    isActive
                      ? 'bg-red-600 text-white border-red-600 shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-slate-600 hover:border-red-400 hover:text-red-600 dark:hover:text-red-400'
                  }`}
                >
                  {group.icon && iconMap[group.icon]}
                  {isActive && activeSubLabel ? activeSubLabel : group.label}
                  <ChevronDown
                    size={11}
                    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Sub-opsi: muncul inline di sebelah tombol grup saat terbuka */}
                {isOpen && (
                  <div className="flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-150">
                    {group.options.map((sub) => {
                      const isSubActive = isActive && currentOrder === sub.order;
                      return (
                        <button
                          key={sub.order}
                          onClick={() => handleSubOption(group, sub)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition border ${
                            isSubActive
                              ? 'bg-red-600 text-white border-red-600'
                              : 'bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/20'
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
