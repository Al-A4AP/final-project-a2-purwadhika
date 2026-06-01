import type { FC } from "react";
import { HERO_SLIDES } from "@/lib/heroData";
import { HeroCarousel } from "./HeroCarousel";
import { TrendingDestinations } from "./TrendingDestinations";
import { useDestinationSearch } from "./useDestinationSearch";
import { useHeroCarousel } from "./useHeroCarousel";

export const HeroSectionContent: FC = () => {
  const carousel = useHeroCarousel(HERO_SLIDES.length);
  const handleSelectCity = useDestinationSearch();

  return (
    <div className="relative w-full">
      <HeroCarousel carousel={carousel} />
      <TrendingDestinations onSelectCity={handleSelectCity} />
    </div>
  );
};
