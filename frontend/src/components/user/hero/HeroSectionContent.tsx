import type { FC } from "react";
import { HERO_SLIDES } from "@/lib/heroData";
import { HeroCarousel } from "./HeroCarousel";
import { useHeroCarousel } from "./useHeroCarousel";

export const HeroSectionContent: FC = () => {
  const carousel = useHeroCarousel(HERO_SLIDES.length);

  return (
    <div className="relative w-full">
      <HeroCarousel carousel={carousel} />
    </div>
  );
};
