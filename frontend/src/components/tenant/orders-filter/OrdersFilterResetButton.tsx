import type { FC } from "react";

export const OrdersFilterResetButton: FC<{ onReset: () => void }> = ({ onReset }) => (
  <div className="flex items-end justify-center">
    <button onClick={onReset} className="h-10 w-full rounded-lg border px-4 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-700">
      Reset
    </button>
  </div>
);
