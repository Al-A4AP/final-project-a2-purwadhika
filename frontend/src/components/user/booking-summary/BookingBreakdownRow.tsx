import type { FC, ReactNode } from "react";

export const BookingBreakdownRow: FC<{ children?: ReactNode; label: ReactNode; value: ReactNode }> = ({ children, label, value }) => (
  <div className="flex justify-between pl-2 text-gray-600 dark:text-gray-400">
    <span className="flex items-center gap-1">{label}{children}</span>
    <span className="text-gray-905 font-mono font-medium dark:text-white">{value}</span>
  </div>
);
