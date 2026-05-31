import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";

const getNextIndex = (current: number, total: number) => (current + 1) % total;

const getPreviousIndex = (current: number, total: number) =>
  (current - 1 + total) % total;

type SlideSetter = Dispatch<SetStateAction<number>>;

const startAutoSlide = (setCurrentSlide: SlideSetter, totalSlides: number) => {
  const timer = window.setInterval(() => {
    setCurrentSlide((current) => getNextIndex(current, totalSlides));
  }, 6000);
  return () => window.clearInterval(timer);
};

const createSlideActions = (setCurrentSlide: SlideSetter, totalSlides: number) => ({
    goNext: () => setCurrentSlide((current) => getNextIndex(current, totalSlides)),
    goPrevious: () =>
      setCurrentSlide((current) => getPreviousIndex(current, totalSlides)),
    setCurrentSlide,
});

export const useHeroCarousel = (totalSlides: number) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => startAutoSlide(setCurrentSlide, totalSlides), [totalSlides]);

  return { currentSlide, ...createSlideActions(setCurrentSlide, totalSlides) };
};
