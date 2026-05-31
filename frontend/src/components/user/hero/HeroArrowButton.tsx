import type { FC } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type HeroArrowButtonProps = {
  direction: "previous" | "next";
  onClick: () => void;
};

const baseClass =
  "absolute top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-white/15 dark:bg-slate-900/20 backdrop-blur-md text-white border border-white/10 hover:bg-white/30 transition";

export const HeroArrowButton: FC<HeroArrowButtonProps> = ({ direction, onClick }) => {
  const Icon = direction === "previous" ? ChevronLeft : ChevronRight;
  const label = direction === "previous" ? "Slide Sebelumnya" : "Slide Selanjutnya";
  const sideClass = direction === "previous" ? "left-4" : "right-4";

  return (
    <button onClick={onClick} className={`${baseClass} ${sideClass}`} aria-label={label}>
      <Icon size={20} />
    </button>
  );
};
