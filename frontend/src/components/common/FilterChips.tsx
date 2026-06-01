import type { FC } from "react";
import { X } from "lucide-react";

export interface FilterChipItem {
  id: string;
  label: string;
  onRemove: () => void;
}

interface FilterChipsProps {
  chips: FilterChipItem[];
  onClearAll?: () => void;
  variant?: "card" | "inline";
}

const WRAPPER_CLASS = {
  card: "mb-6 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/40",
  inline: "flex flex-col gap-3 border-t border-slate-100 pt-4 dark:border-slate-800",
};

export const FilterChips: FC<FilterChipsProps> = ({ chips, onClearAll, variant = "card" }) => {
  if (!chips.length) return null;
  return (
    <div className={WRAPPER_CLASS[variant]}>
      <p className="text-xs font-semibold uppercase text-slate-400">Filter aktif</p>
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => <FilterChip key={chip.id} chip={chip} />)}
        {onClearAll && <ClearAllButton onClear={onClearAll} />}
      </div>
    </div>
  );
};

const FilterChip: FC<{ chip: FilterChipItem }> = ({ chip }) => (
  <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 dark:bg-rose-900/20 dark:text-rose-200">
    <span className="truncate">{chip.label}</span>
    <button onClick={chip.onRemove} className="rounded-full p-0.5 hover:bg-rose-100 dark:hover:bg-rose-900/40" aria-label={`Hapus ${chip.label}`}><X size={13} /></button>
  </span>
);

const ClearAllButton: FC<{ onClear: () => void }> = ({ onClear }) => (
  <button onClick={onClear} className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">Reset Semua</button>
);
