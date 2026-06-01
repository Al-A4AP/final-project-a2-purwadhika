import type { FC } from "react";
import type { LegalPoint } from "./legalTypes";

export const LegalPointItem: FC<{ point: LegalPoint }> = ({ point }) => (
  <li className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
    <h3 className="text-base font-semibold text-slate-900 dark:text-white">{point.title}</h3>
    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{point.body}</p>
  </li>
);
