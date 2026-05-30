import type { FC } from "react";
import { useState, useRef, useEffect } from "react";
import {
  ArrowUpDown,
  TrendingUp,
  Star,
  Banknote,
  Clock,
  BedDouble,
} from "lucide-react";
import { PropertyFilterDropdown } from "../user/PropertyFilterDropdown";
import { SortDropdown } from "./SortDropdown";

export interface SortSubOption {
  order: "asc" | "desc";
  label: string;
}

export interface SortGroup {
  key: string;
  label: string;
  icon?: "trending" | "star" | "price" | "clock" | "bed" | "alpha";
  options: [SortSubOption, SortSubOption]; // always exactly 2: desc first, asc second
}

interface Props {
  sortGroups: SortGroup[];
  currentSort: string;
  currentOrder: "asc" | "desc";
  onChange: (sort: string, order: "asc" | "desc") => void;
  resultCount?: number;
  resultLabel?: string;
  hasFilterChanges?: boolean;
  activeCity?: string;
  onApplyFilters?: () => void;
  onResetFilters?: () => void;
  onClearCity?: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  trending: <TrendingUp size={13} />,
  star: <Star size={13} />,
  price: <Banknote size={13} />,
  clock: <Clock size={13} />,
  bed: <BedDouble size={13} />,
  alpha: <span className="text-xs font-bold leading-none">Az</span>,
};

const SortFilterBar: FC<Props> = ({
  sortGroups,
  currentSort,
  currentOrder,
  onChange,
  resultCount,
  resultLabel = "hasil",
  hasFilterChanges,
  activeCity,
  onApplyFilters,
  onResetFilters,
  onClearCity,
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
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openGroup]);

  return (
    <div className="mb-6">
      {hasFilterChanges && (
        <div className="mb-6 flex gap-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            onClick={onApplyFilters}
            className="px-6 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors font-medium text-sm tracking-wide"
          >
            Terapkan Filter
          </button>
          <button
            onClick={onResetFilters}
            className="px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors text-sm"
          >
            Reset
          </button>
        </div>
      )}

      {activeCity && (
        <div className="mb-6 p-4 bg-rose-50 dark:bg-slate-800/40 rounded-lg border border-rose-200 dark:border-slate-700 flex items-center justify-between">
          <span className="text-sm text-rose-700 dark:text-rose-300 font-serif tracking-wide">
            📍 <strong>Lokasi:</strong> {activeCity}
          </span>
          <button
            onClick={onClearCity}
            className="px-4 py-1.5 bg-rose-600 dark:bg-rose-700 text-white text-xs font-semibold rounded-lg hover:bg-rose-700 dark:hover:bg-rose-600 transition-colors tracking-wide"
          >
            ✕ Hapus Lokasi
          </button>
        </div>
      )}
      {/* Header: jumlah hasil + label */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b dark:border-slate-800 mb-4">
        {resultCount !== undefined && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-900 dark:text-white">
              {resultCount}
            </span>{" "}
            {resultLabel}
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

          {sortGroups.map((group) => (
            <SortDropdown
              key={group.key}
              group={group}
              isActive={currentSort === group.key}
              isOpen={openGroup === group.key}
              currentOrder={currentOrder}
              icon={group.icon && iconMap[group.icon]}
              onGroupClick={handleGroupClick}
              onSubOptionClick={handleSubOption}
              setRef={(el) => {
                dropdownRefs.current[group.key] = el;
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SortFilterBar;
