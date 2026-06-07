import type { FC } from "react";
import type { Property } from "@/types";
import { Heart } from "lucide-react";
import { useSavedProperties } from "@/hooks/useSavedProperties";

interface SavePropertyButtonProps {
  property: Property;
  className?: string;
  variant?: 'overlay' | 'outline';
}

export const SavePropertyButton: FC<SavePropertyButtonProps> = ({ property, className = "", variant = "overlay" }) => {
  const { isSaved, toggleSave } = useSavedProperties();
  const saved = isSaved(property.id);
  return (
    <button
      type="button"
      onClick={(e) => toggleSave(property, e)}
      className={getButtonClass(saved, className, variant)}
      aria-label={saved ? "Hapus dari tersimpan" : "Simpan properti"}
    >
      <Heart size={variant === 'outline' ? 20 : 18} className={getHeartClass(saved, variant)} />
    </button>
  );
};

const getButtonClass = (saved: boolean, className: string, variant: 'overlay' | 'outline') => {
  const base = "flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 active:scale-95";
  
  const variants = {
    overlay: `h-9 w-9 shadow-md backdrop-blur-sm border ${saved ? 'bg-white border-transparent' : 'bg-slate-900/50 border-slate-200/50 hover:bg-slate-900/70'}`,
    outline: `h-12 w-12 shadow-sm border ${saved ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' : 'bg-white border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700'}`,
  };
  
  return `${base} ${variants[variant]} ${className}`;
};

const getHeartClass = (saved: boolean, variant: 'overlay' | 'outline') => {
  const base = "transition-colors duration-300";
  if (variant === 'overlay') {
    return `${base} ${saved ? "fill-red-600 text-red-600" : "text-white drop-shadow-md"}`;
  }
  return `${base} ${saved ? "fill-red-600 text-red-600" : "text-slate-700 dark:text-slate-300"}`;
};
