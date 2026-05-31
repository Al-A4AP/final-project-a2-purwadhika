import type { FC } from "react";
import { HeroCaption } from "./HeroCaption";
import type { HeroSlideData } from "./heroTypes";

type HeroSlideProps = {
  slide: HeroSlideData;
  active: boolean;
};

const getSlideClass = (active: boolean) =>
  active ? "opacity-100" : "opacity-0 pointer-events-none";

export const HeroSlide: FC<HeroSlideProps> = ({ slide, active }) => (
  <div className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${getSlideClass(active)}`}>
    <div className="absolute inset-0 bg-black/45 z-10" />
    <img src={slide.image} alt="" className="absolute inset-0 w-full h-full object-cover transform scale-105 transition-transform duration-6000" />
    <HeroCaption slide={slide} />
  </div>
);
