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
      onClick={(e) => toggleSave(property, e)}
      className={`flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-sm transition hover:bg-white hover:scale-110 dark:bg-slate-900/80 dark:hover:bg-slate-900 ${className}`}
      aria-label={saved ? "Hapus dari tersimpan" : "Simpan properti"}
    >
      <Heart
        size={18}
        className={`transition-colors ${saved ? "fill-rose-500 text-rose-500" : "text-slate-600 dark:text-slate-300"}`}
      />
    </button>
  );
};
