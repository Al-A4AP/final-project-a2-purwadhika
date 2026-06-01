import { useId, type FC } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { MapPin } from "lucide-react";
import { CITIES } from "@/lib/constants";
import type { SearchFormInput } from "@/validations/search";
import { SEARCH_INPUT_CLASS } from "./searchFormStyles";

interface CityFieldProps {
  register: UseFormRegister<SearchFormInput>;
  errors: FieldErrors<SearchFormInput>;
}

export const CityField: FC<CityFieldProps> = ({ register, errors }) => {
  const listId = useId();
  return (
    <div>
      <CityLabel />
      <input {...register("city")} list={listId} autoComplete="address-level2" placeholder="Ketik kota" className={SEARCH_INPUT_CLASS} />
      <CityOptions listId={listId} />
      {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>}
    </div>
  );
};

const CityLabel: FC = () => (
  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
    <MapPin className="mr-1 inline" size={16} /> Kota
  </label>
);

const CityOptions: FC<{ listId: string }> = ({ listId }) => (
  <datalist id={listId}>
    {CITIES.map((city) => <option key={city} value={city} />)}
  </datalist>
);
