import type { FC } from "react";
import { ContactHero } from "./ContactHero";
import { ContactInfoSection } from "./ContactInfoSection";
import { ContactMainSection } from "./ContactMainSection";
import type { ContactPageState } from "./contactTypes";

export const ContactContent: FC<{ state: ContactPageState }> = ({ state }) => (
  <div className="min-h-screen bg-white dark:bg-slate-950 font-sans">
    <ContactHero />
    <div className="w-full h-px bg-slate-200 dark:bg-slate-800 my-4 max-w-7xl mx-auto"></div>
    <ContactInfoSection />
    <ContactMainSection state={state} />
  </div>
);
