import type { FC } from "react";

type HeroIndicatorProps = {
  index: number;
  active: boolean;
  onSelect: (index: number) => void;
};

const getIndicatorClass = (active: boolean) =>
  active ? "w-8 bg-red-600" : "w-2 bg-white/50 hover:bg-white/80";

export const HeroIndicator: FC<HeroIndicatorProps> = ({ index, active, onSelect }) => (
  <button
    onClick={() => onSelect(index)}
    className={`h-2 rounded-full transition-all duration-300 ${getIndicatorClass(active)}`}
    aria-label={`Pilih slide ${index + 1}`}
  />
);
