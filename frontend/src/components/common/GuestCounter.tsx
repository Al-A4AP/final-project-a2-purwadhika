import type { FC } from "react";

interface GuestCounterProps {
  label: string;
  description: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}

export const GuestCounter: FC<GuestCounterProps> = ({ label, description, value, onChange, min = 0, max = 99 }) => (
  <div className="flex items-center justify-between py-3 border-b dark:border-slate-600 last:border-0">
    <div>
      <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-8 h-8 rounded-full border dark:border-slate-500 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-40 font-bold text-lg transition"
      >
        −
      </button>
      <span className="w-5 text-center font-semibold text-gray-900 dark:text-white text-sm">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-8 h-8 rounded-full border dark:border-slate-500 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-40 font-bold text-lg transition"
      >
        +
      </button>
    </div>
  </div>
);
