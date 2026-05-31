import type { FC } from "react";
import type { SelectOption } from "./types";

interface OrdersFilterSelectProps {
  onChange: (value: string) => void;
  options: SelectOption[];
  value: string;
}

export const OrdersFilterSelect: FC<OrdersFilterSelectProps> = ({ onChange, options, value }) => (
  <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-lg border bg-white p-2 text-sm text-gray-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
    {options.map((option) => <option key={option.value || "all"} value={option.value}>{option.label}</option>)}
  </select>
);
