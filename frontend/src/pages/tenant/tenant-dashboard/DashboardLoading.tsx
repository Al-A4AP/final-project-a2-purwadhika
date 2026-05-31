import type { FC } from "react";

export const DashboardLoading: FC = () => (
  <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:p-8 lg:grid-cols-4 md:gap-6">
    {[...Array(4)].map((_, index) => <div key={index} className="h-28 animate-pulse rounded-xl bg-gray-200 dark:bg-slate-700" />)}
  </div>
);
