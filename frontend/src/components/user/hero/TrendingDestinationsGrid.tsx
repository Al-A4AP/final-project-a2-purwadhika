import type { FC } from "react";
import { TRENDING_DESTINATIONS } from "@/lib/heroData";
import { TrendingDestinationCard } from "./TrendingDestinationCard";

type TrendingDestinationsGridProps = {
  onSelectCity: (city: string) => void;
};

export const TrendingDestinationsGrid: FC<TrendingDestinationsGridProps> = ({ onSelectCity }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
    {TRENDING_DESTINATIONS.map((destination) => (
      <TrendingDestinationCard key={destination.city} destination={destination} onSelectCity={onSelectCity} />
    ))}
  </div>
);
