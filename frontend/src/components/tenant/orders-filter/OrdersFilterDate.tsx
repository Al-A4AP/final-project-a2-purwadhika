import type { FC } from "react";
import { OrdersFilterField } from "./OrdersFilterField";

interface OrdersFilterDateProps {
  label: string;
  onChange: (value: string) => void;
  value: string;
}

export const OrdersFilterDate: FC<OrdersFilterDateProps> = ({ label, onChange, value }) => (
  <OrdersFilterField label={label}>
    <input type="date" value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-lg border bg-white p-2 text-sm text-gray-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white" />
  </OrdersFilterField>
);
