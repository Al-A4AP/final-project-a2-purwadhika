import type { FC } from "react";
import { ChevronDown } from "lucide-react";
import type { SortGroup, SortSubOption } from "./SortFilterBar";

interface SortDropdownProps {
  group: SortGroup;
  isActive: boolean;
  isOpen: boolean;
  currentOrder: "asc" | "desc";
  icon: React.ReactNode;
  onGroupClick: (group: SortGroup) => void;
  onSubOptionClick: (group: SortGroup, sub: SortSubOption) => void;
  setRef?: (el: HTMLDivElement | null) => void;
}

export const SortDropdown: FC<SortDropdownProps> = ({
  group,
  isActive,
  isOpen,
  currentOrder,
  icon,
  onGroupClick,
  onSubOptionClick,
  setRef,
}) => {
  const activeSubLabel = isActive
    ? group.options.find((o) => o.order === currentOrder)?.label
    : null;

  return (
    <div className="relative inline-block text-left" ref={setRef}>
      {/* Grup Button */}
      <button
        onClick={() => onGroupClick(group)}
        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition border ${
          isActive
            ? "bg-rose-600 text-white border-rose-600 shadow-sm"
            : isOpen
              ? "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-850 hover:border-rose-450 hover:text-rose-600"
        }`}
      >
        {icon}
        {isActive && activeSubLabel ? activeSubLabel : group.label}
        <ChevronDown
          size={11}
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
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
                onClick={() => onSubOptionClick(group, sub)}
                className={`w-full text-left px-5 py-2.5 text-xs font-semibold transition ${
                  isSubActive
                    ? "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
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
};
