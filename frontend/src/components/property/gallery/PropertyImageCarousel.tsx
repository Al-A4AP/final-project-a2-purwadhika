import type { FC } from "react";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PropertyImage } from "@/types";
import { buildCarouselImages, type CarouselImage } from "./carouselImages";

interface PropertyImageCarouselProps {
  featuredImageUrl: string;
  images: PropertyImage[];
  name: string;
}

export const PropertyImageCarousel: FC<PropertyImageCarouselProps> = (props) => {
  const slides = useMemo(() => buildCarouselImages(props.featuredImageUrl, props.name, props.images), [props.featuredImageUrl, props.images, props.name]);
  const [activeIndex, setActiveIndex] = useState(0);
  if (!slides.length) return <ImageFallback name={props.name} />;
  const active = slides[activeIndex] || slides[0];
  return (
    <div className="relative mb-8 overflow-hidden rounded-xl border bg-gray-100 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <CarouselImage image={active} />
      {slides.length > 1 && <CarouselControls activeIndex={activeIndex} count={slides.length} setActiveIndex={setActiveIndex} />}
    </div>
  );
};

const CarouselImage: FC<{ image: CarouselImage }> = ({ image }) => (
  <img src={image.src} alt={image.alt} className="h-80 w-full object-cover md:h-[28rem]" />
);

const CarouselControls: FC<{ activeIndex: number; count: number; setActiveIndex: (value: number) => void }> = (props) => (
  <>
    <ArrowButton direction="prev" onClick={() => props.setActiveIndex(previousIndex(props.activeIndex, props.count))} />
    <ArrowButton direction="next" onClick={() => props.setActiveIndex(nextIndex(props.activeIndex, props.count))} />
    <SlideCounter activeIndex={props.activeIndex} count={props.count} />
  </>
);

const ArrowButton: FC<{ direction: "next" | "prev"; onClick: () => void }> = ({ direction, onClick }) => (
  <button onClick={onClick} className={`absolute top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70 ${direction === "prev" ? "left-4" : "right-4"}`} aria-label={direction === "prev" ? "Gambar sebelumnya" : "Gambar berikutnya"}>
    {direction === "prev" ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
  </button>
);

const SlideCounter: FC<{ activeIndex: number; count: number }> = ({ activeIndex, count }) => (
  <div className="absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">{activeIndex + 1} / {count}</div>
);

const ImageFallback: FC<{ name: string }> = ({ name }) => (
  <div className="mb-8 flex h-80 items-center justify-center rounded-xl border bg-gray-100 text-sm text-gray-500 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-400">{name}</div>
);

const nextIndex = (activeIndex: number, count: number) => (activeIndex + 1) % count;
const previousIndex = (activeIndex: number, count: number) => (activeIndex - 1 + count) % count;
