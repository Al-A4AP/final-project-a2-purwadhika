import type { FC } from "react";

const GuestExtraRow: FC<{ count: number; label: string }> = ({ count, label }) => (
  <div className="flex justify-between border-t border-gray-100 pt-2 text-gray-600 dark:border-slate-700/50 dark:text-gray-400">
    <span>{label} ({count}x):</span>
    <span className="font-medium text-green-600 dark:text-green-400">Gratis</span>
  </div>
);

export const GuestExtraRows: FC<{ babies: number; children: number }> = ({ babies, children }) => (
  <>
    {children > 0 && <GuestExtraRow count={children} label="Tambahan Anak" />}
    {babies > 0 && <GuestExtraRow count={babies} label="Tambahan Bayi" />}
  </>
);
