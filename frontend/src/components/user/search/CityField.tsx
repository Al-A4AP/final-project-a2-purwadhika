import type { FC } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { MapPin } from "lucide-react";
import { CITIES } from "@/lib/constants";
import type { SearchFormInput } from "@/validations/search";
import { SEARCH_INPUT_CLASS } from "./searchFormStyles";

interface CityFieldProps {
  register: UseFormRegister<SearchFormInput>;
  errors: FieldErrors<SearchFormInput>;
}

export const CityField: FC<CityFieldProps> = ({ register, errors }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      <MapPin className="inline mr-1" size={16} /> Kota
    </label>
    <select {...register("city")} className={SEARCH_INPUT_CLASS}>
      <option value="">Pilih kota</option>
      {CITIES.map((city) => <option key={city} value={city}>{city}</option>)}
    </select>
    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
  </div>
);
