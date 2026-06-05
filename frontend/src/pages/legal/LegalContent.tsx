import type { FC } from "react";
import { LEGAL_SECTIONS } from "./legalData";
import { LegalHero } from "./LegalHero";
import { LegalNav } from "./LegalNav";
import { LegalSection } from "./LegalSection";
import { useLegalHashScroll } from "../../hooks/legal/useLegalHashScroll";

export const LegalContent: FC = () => {
  useLegalHashScroll();
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <LegalHero />
      <div className="mx-auto max-w-5xl px-4 py-12">
        <LegalNav />
        <div className="mt-10 space-y-14">{LEGAL_SECTIONS.map((section) => <LegalSection key={section.id} section={section} />)}</div>
      </div>
    </div>
  );
};
