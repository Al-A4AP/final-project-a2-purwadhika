import type { FC } from "react";

export interface SelectOption {
  label: string;
  value: string;
}

const CONTROL_CLASS = "w-full text-sm border dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg p-2 text-gray-900 dark:text-white";

export const FilterSelect: FC<{ label: string; onChange: (value: string) => void; options: SelectOption[]; value: string }> = ({ label, onChange, options, value }) => (
  <div className="flex-1 min-w-40"><FilterLabel label={label} /><select value={value} onChange={(e) => onChange(e.target.value)} className={CONTROL_CLASS}>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>
);

export const FilterDate: FC<{ label: string; onChange: (value: string) => void; value: string }> = ({ label, onChange, value }) => (
  <div className="w-40"><FilterLabel label={label} /><input type="date" value={value} onChange={(e) => onChange(e.target.value)} className={CONTROL_CLASS} /></div>
);

export const FilterLabel: FC<{ label: string }> = ({ label }) => (
  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">{label}</label>
);

export const TextFilter: FC<{ label: string; onChange: (value: string) => void; placeholder: string; value: string }> = ({ label, onChange, placeholder, value }) => (
  <div className="flex-1 min-w-40"><FilterLabel label={label} /><input type="text" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className={`${CONTROL_CLASS} outline-none focus:ring-2 focus:ring-red-500`} /></div>
);
