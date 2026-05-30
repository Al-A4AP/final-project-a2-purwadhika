import type { FC } from 'react';

interface FilterActionsProps {
  onClear: () => void;
  onApply: () => void;
}

export const FilterActions: FC<FilterActionsProps> = ({ onClear, onApply }) => (
  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
    <button onClick={onClear} className="text-xs font-bold text-slate-400 hover:text-slate-900 dark:hover:text-white underline transition">
      Hapus Semua
    </button>
    <button onClick={onApply} className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-full hover:opacity-90 transition shadow-sm">
      Terapkan
    </button>
  </div>
);
