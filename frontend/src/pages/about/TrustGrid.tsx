import type { FC } from "react";
import { TRUST_FEATURES } from "./aboutData";
import { TrustFeatureCard } from "./TrustFeatureCard";

export const TrustGrid: FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
    {TRUST_FEATURES.map((feature) => <TrustFeatureCard key={feature.title} feature={feature} />)}
  </div>
);
