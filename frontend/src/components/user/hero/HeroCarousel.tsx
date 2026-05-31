import type { FC } from "react";
import { HeroArrowButton } from "./HeroArrowButton";
import { HeroIndicators } from "./HeroIndicators";
import { HeroSlides } from "./HeroSlides";
import type { useHeroCarousel } from "./useHeroCarousel";

type HeroCarouselProps = {
  carousel: ReturnType<typeof useHeroCarousel>;
};

export const HeroCarousel: FC<HeroCarouselProps> = ({ carousel }) => (
  <div className="relative h-137.5 md:h-150 w-full overflow-hidden bg-slate-900">
    <HeroSlides currentSlide={carousel.currentSlide} />
    <HeroArrowButton direction="previous" onClick={carousel.goPrevious} />
    <HeroArrowButton direction="next" onClick={carousel.goNext} />
    <HeroIndicators
      currentSlide={carousel.currentSlide}
      onSelectSlide={carousel.setCurrentSlide}
    />
  </div>
);
