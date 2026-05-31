import type { FC, ReactNode } from "react";

interface OrdersFilterFieldProps {
  children: ReactNode;
  className?: string;
  label: string;
}

export const OrdersFilterField: FC<OrdersFilterFieldProps> = ({ children, className = "", label }) => (
  <div className={`min-w-0 ${className}`}>
    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
      {label}
    </label>
    {children}
  </div>
);
