import type { FC } from "react";
import { TrustGrid } from "./TrustGrid";
import { TrustIntro } from "./TrustIntro";

export const TrustSection: FC = () => (
  <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-b border-slate-200 dark:border-slate-800">
    <TrustIntro />
    <TrustGrid />
  </section>
);
