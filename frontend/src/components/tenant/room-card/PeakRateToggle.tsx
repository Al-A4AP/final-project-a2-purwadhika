import type { FC } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export const PeakRateToggle: FC<{ count: number; isOpen: boolean; onToggle: () => void }> = ({ count, isOpen, onToggle }) => (
  <button onClick={onToggle} className="flex min-h-10 items-center gap-1 text-xs text-gray-500 hover:text-gray-700" aria-expanded={isOpen}>
    {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
    {count} Peak Rate
  </button>
);
