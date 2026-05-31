import type { FC } from "react";

export const PropertyDetailSkeleton: FC = () => (
  <div className="mx-auto max-w-7xl space-y-6 px-4 py-12 animate-pulse">
    <div className="h-64 rounded-xl bg-gray-200 dark:bg-slate-800" />
    <div className="h-10 w-1/3 rounded bg-gray-200 dark:bg-slate-800" />
    <div className="h-40 rounded-xl bg-gray-200 dark:bg-slate-800" />
  </div>
);
