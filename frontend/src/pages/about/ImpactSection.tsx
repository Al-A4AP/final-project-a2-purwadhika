import type { FC } from "react";
import { IMPACT_STATS } from "./aboutData";
import { ImpactStatCard } from "./ImpactStatCard";

export const ImpactSection: FC = () => (
  <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
    <h2 className="text-sm font-bold tracking-widest text-slate-500 uppercase mb-8">Dampak Kami</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
      {IMPACT_STATS.map((stat) => <ImpactStatCard key={stat.label} stat={stat} />)}
    </div>
  </section>
);
