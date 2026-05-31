import type { FC } from "react";
import { HERO_SLIDES } from "@/lib/heroData";
import { HeroIndicator } from "./HeroIndicator";

type HeroIndicatorsProps = {
  currentSlide: number;
  onSelectSlide: (index: number) => void;
};

export const HeroIndicators: FC<HeroIndicatorsProps> = ({ currentSlide, onSelectSlide }) => (
  <div className="absolute bottom-32 md:bottom-28 left-1/2 -translate-x-1/2 z-30 flex gap-2">
    {HERO_SLIDES.map((slide, index) => (
      <HeroIndicator key={slide.title} index={index} active={index === currentSlide} onSelect={onSelectSlide} />
    ))}
  </div>
);
