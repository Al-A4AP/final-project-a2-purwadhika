import type { FC, ReactNode } from "react";

export const RoomFieldShell: FC<{ children: ReactNode; className?: string; label: string }> = ({ children, className = "", label }) => (
  <div className={className}>
    <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{label}</label>
    {children}
  </div>
);
