import type { FC } from "react";

export const LoginDivider: FC = () => (
  <div className="relative flex py-2 items-center">
    <div className="grow border-t border-gray-300 dark:border-slate-600" />
    <span className="shrink mx-4 text-gray-500 text-xs">atau</span>
    <div className="grow border-t border-gray-300 dark:border-slate-600" />
  </div>
);
