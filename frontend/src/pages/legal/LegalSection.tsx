import type { FC } from "react";
import { LegalPointItem } from "./LegalPointItem";
import type { LegalSectionData } from "./legalTypes";

export const LegalSection: FC<{ section: LegalSectionData }> = ({ section }) => (
  <section id={section.id} className="scroll-mt-28">
    <div className="mb-5">
      <p className="text-sm font-semibold uppercase text-red-600 dark:text-red-300">{section.label}</p>
      <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">{section.title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">{section.summary}</p>
    </div>
    <ul className="grid gap-4 md:grid-cols-2">{section.points.map((point) => <LegalPointItem key={point.title} point={point} />)}</ul>
  </section>
);
