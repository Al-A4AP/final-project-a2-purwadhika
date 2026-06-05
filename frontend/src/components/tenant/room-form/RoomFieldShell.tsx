import type { FC, ReactNode } from "react";

export const RoomFieldShell: FC<{ children: ReactNode; className?: string; label: string }> = ({ children, className = "", label }) => (
  <div className={className}>
    <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
      {label} <span className="text-red-500">*</span>
    </label>
    {children}
  </div>
);
