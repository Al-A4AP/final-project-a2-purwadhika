import type { FC } from "react";
import { LEGAL_SECTIONS } from "./legalData";

export const LegalNav: FC = () => (
  <nav className="flex flex-wrap gap-3 border-b border-slate-200 pb-5 dark:border-slate-800">
    {LEGAL_SECTIONS.map((section) => (
      <a key={section.id} href={`#${section.id}`} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:text-red-600 dark:border-slate-700 dark:text-slate-200 dark:hover:border-red-800 dark:hover:text-red-300">
        {section.label}
      </a>
    ))}
  </nav>
);
