import type { FC } from "react";
import { HERO_SLIDES } from "@/lib/heroData";
import { HeroSlide } from "./HeroSlide";

type HeroSlidesProps = {
  currentSlide: number;
};

export const HeroSlides: FC<HeroSlidesProps> = ({ currentSlide }) => (
  <>
    {HERO_SLIDES.map((slide, index) => (
      <HeroSlide key={slide.title} slide={slide} active={index === currentSlide} />
    ))}
  </>
);
