import type { FC } from "react";
import type { TrustFeature } from "./aboutTypes";

export const TrustFeatureCard: FC<{ feature: TrustFeature }> = ({ feature }) => {
  const Icon = feature.icon;
  return <div className="space-y-4"><Icon size={32} className="text-slate-900 dark:text-white" /><h3 className="text-xl font-bold text-slate-900 dark:text-white">{feature.title}</h3><p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p></div>;
};
