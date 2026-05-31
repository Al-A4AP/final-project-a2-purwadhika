import type { FC } from "react";

export const OrdersFilterResetButton: FC<{ onReset: () => void }> = ({ onReset }) => (
  <button onClick={onReset} className="h-10 rounded-lg border px-4 text-sm text-gray-600 hover:bg-gray-50 dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-700">
    Reset
  </button>
);
