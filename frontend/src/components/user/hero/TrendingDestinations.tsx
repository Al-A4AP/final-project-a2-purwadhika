import type { FC } from "react";
import { TrendingDestinationsGrid } from "./TrendingDestinationsGrid";
import { TrendingDestinationsHeader } from "./TrendingDestinationsHeader";

type TrendingDestinationsProps = {
  onSelectCity: (city: string) => void;
};

export const TrendingDestinations: FC<TrendingDestinationsProps> = ({ onSelectCity }) => (
  <section className="max-w-7xl mx-auto px-4 pt-16 pb-4">
    <TrendingDestinationsHeader />
    <TrendingDestinationsGrid onSelectCity={onSelectCity} />
  </section>
);
