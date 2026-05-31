import type { FC } from "react";
import { AboutCtaSection } from "./AboutCtaSection";
import { AboutHero } from "./AboutHero";
import { CommunitySection } from "./CommunitySection";
import { ImpactSection } from "./ImpactSection";
import { MissionSection } from "./MissionSection";
import { TrustSection } from "./TrustSection";

export const AboutContent: FC = () => (
  <div className="min-h-screen bg-white dark:bg-slate-950 font-sans">
    <AboutHero />
    <div className="w-full h-px bg-slate-200 dark:bg-slate-800 my-8"></div>
    <ImpactSection />
    <MissionSection />
    <TrustSection />
    <CommunitySection />
    <AboutCtaSection />
  </div>
);
