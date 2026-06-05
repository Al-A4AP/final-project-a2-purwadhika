import type { FC } from "react";
import type { Property } from "@/types";
import { Heart } from "lucide-react";
import { useSavedProperties } from "@/hooks/useSavedProperties";

interface SavePropertyButtonProps {
  property: Property;
  className?: string;
}

export const SavePropertyButton: FC<SavePropertyButtonProps> = ({ property, className = "" }) => {
  const { isSaved, toggleSave } = useSavedProperties();
  const saved = isSaved(property.id);
  return (
    <button
      type="button"
      onClick={(e) => toggleSave(property, e)}
      className={getButtonClass(saved, className)}
      aria-label={saved ? "Hapus dari tersimpan" : "Simpan properti"}
    >
      <Heart size={18} className={getHeartClass(saved)} />
    </button>
  );
};

const getButtonClass = (saved: boolean, className: string) =>
  `flex h-9 w-9 items-center justify-center rounded-full border border-white/30 shadow-sm backdrop-blur-sm transition hover:scale-110 ${getButtonTone(saved)} ${className}`;

const getButtonTone = (saved: boolean) =>
  saved ? "bg-rose-600 text-white hover:bg-rose-700" : "bg-slate-900/70 text-white hover:bg-slate-900";

const getHeartClass = (saved: boolean) =>
  `transition-colors ${saved ? "fill-white text-white" : "text-white"}`;
