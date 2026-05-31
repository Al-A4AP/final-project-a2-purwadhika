import type { LucideIcon } from "lucide-react";

export type ImpactStat = {
  value: string;
  label: string;
};

export type CommunityStory = {
  name: string;
  location: string;
  quote: string;
  image: string;
};

export type TrustFeature = {
  icon: LucideIcon;
  title: string;
  description: string;
};
