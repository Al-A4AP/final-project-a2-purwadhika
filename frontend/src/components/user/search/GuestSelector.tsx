import type { FC } from "react";
import { useRef } from "react";
import { ChevronDown, Users } from "lucide-react";
import { GuestCounter } from "@/components/common/GuestCounter";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { SEARCH_INPUT_CLASS } from "./searchFormStyles";

interface GuestSelectorProps {
  adults: number;
  babies: number;
  children: number;
  guestSummary: string;
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
  setAdults: (value: number) => void;
  setBabies: (value: number) => void;
  setChildren: (value: number) => void;
}

export const GuestSelector: FC<GuestSelectorProps> = (props) => {
  const selectorRef = useRef<HTMLDivElement>(null);
  useOutsideClick(selectorRef, props.onClose, props.isOpen);
  return (
    <div className="relative" ref={selectorRef}>
      <GuestSelectorLabel />
      <GuestSelectorButton {...props} />
      {props.isOpen && <GuestSelectorPanel {...props} />}
    </div>
  );
};

const GuestSelectorLabel: FC = () => (
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
    <Users className="inline mr-1" size={16} /> Tamu
  </label>
);

const GuestSelectorButton: FC<GuestSelectorProps> = (props) => (
  <button type="button" onClick={props.onToggle} className={`${SEARCH_INPUT_CLASS} flex items-center justify-between text-left`}>
    <span className="text-sm truncate">{props.guestSummary || "1 Dewasa"}</span>
    <ChevronDown size={16} className={`shrink-0 ml-1 transition-transform ${props.isOpen ? "rotate-180" : ""}`} />
  </button>
);

const GuestSelectorPanel: FC<GuestSelectorProps> = (props) => (
  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border dark:border-slate-600 rounded-xl shadow-xl z-50 p-4 min-w-65">
    <GuestCounter label="Dewasa" description="Usia 13 tahun ke atas" value={props.adults} onChange={props.setAdults} min={1} />
    <GuestCounter label="Anak-anak" description="Usia 2 - 12 tahun" value={props.children} onChange={props.setChildren} max={props.adults} />
    <GuestCounter label="Bayi" description="Di bawah 2 tahun" value={props.babies} onChange={props.setBabies} max={props.adults} />
    <button type="button" onClick={props.onClose} className="mt-3 w-full text-center text-sm text-red-600 font-medium hover:underline">
      Selesai
    </button>
  </div>
);
