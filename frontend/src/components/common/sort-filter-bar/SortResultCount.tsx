import type { FC } from "react";

type SortResultCountProps = {
  count?: number;
  label: string;
};

export const SortResultCount: FC<SortResultCountProps> = ({ count, label }) =>
  count !== undefined ? (
    <p className="text-sm text-slate-500 dark:text-slate-400">
      <span className="font-semibold text-slate-900 dark:text-white">{count}</span> {label}
    </p>
  ) : null;
