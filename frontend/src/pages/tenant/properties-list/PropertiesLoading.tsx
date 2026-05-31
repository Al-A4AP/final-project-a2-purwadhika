import type { FC } from "react";

export const PropertiesLoading: FC = () => (
  <div className="space-y-4 p-8">
    {[...Array(3)].map((_, index) => <div key={index} className="h-24 animate-pulse rounded-xl bg-gray-200 dark:bg-slate-700" />)}
  </div>
);
