import type { FC } from "react";

export const ReviewsSkeleton: FC = () => (
  <div className="p-8 space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-40 rounded-xl bg-gray-200 dark:bg-slate-700 animate-pulse" />)}</div>
);
