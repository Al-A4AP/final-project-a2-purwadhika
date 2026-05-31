import type { FC } from "react";
import { HeroPremiumBadge } from "./HeroPremiumBadge";
import type { HeroSlideData } from "./heroTypes";

type HeroCaptionProps = {
  slide: HeroSlideData;
};

export const HeroCaption: FC<HeroCaptionProps> = ({ slide }) => (
  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 mb-20 md:mb-12">
    <HeroPremiumBadge />
    <h1 className="text-3xl md:text-6xl font-bold text-white max-w-4xl leading-tight drop-shadow-lg">
      {slide.title}
    </h1>
    <p className="text-sm md:text-xl text-gray-250 text-white/90 max-w-2xl mt-4 drop-shadow-md">
      {slide.subtitle}
    </p>
  </div>
);
