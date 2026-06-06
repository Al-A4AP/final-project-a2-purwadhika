import { useState, useRef, useEffect, type FC } from "react";
import type { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { MapPin } from "lucide-react";
import { CITIES } from "@/lib/constants";
import type { SearchFormInput } from "@/validations/search";
import { SEARCH_INPUT_CLASS } from "./searchFormStyles";

interface CityFieldProps {
  errors: FieldErrors<SearchFormInput>;
  register: UseFormRegister<SearchFormInput>;
  setValue: UseFormSetValue<SearchFormInput>;
  watch: UseFormWatch<SearchFormInput>;
}

export const CityField: FC<CityFieldProps> = ({ errors, register, setValue, watch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchVal = watch("city") || "";
  const filtered = CITIES.filter((c) => c.toLowerCase().includes(searchVal.toLowerCase()));

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <CityLabel />
      <input {...register("city")} autoComplete="off" placeholder="Ketik kota" className={SEARCH_INPUT_CLASS} onFocus={() => setIsOpen(true)} />
      {isOpen && filtered.length > 0 && <CitySuggestions filtered={filtered} onSelect={(c) => { setValue("city", c); setIsOpen(false); }} />}
      {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>}
    </div>
  );
};

const CityLabel: FC = () => (
  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
    <MapPin className="mr-1 inline" size={16} /> Kota
  </label>
);

const CitySuggestions: FC<{ filtered: string[]; onSelect: (c: string) => void }> = ({ filtered, onSelect }) => (
  <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
    {filtered.map((city) => (
      <li key={city} onClick={() => onSelect(city)} className="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">
        {city}
      </li>
    ))}
  </ul>
);
