import type { FC } from "react";
import type { FieldError, UseFormRegister } from "react-hook-form";
import { Calendar } from "lucide-react";
import type { SearchFormInput } from "@/validations/search";
import { SEARCH_INPUT_CLASS } from "./searchFormStyles";

interface DateFieldProps {
  error?: FieldError;
  label: string;
  min: string;
  name: "check_in_date" | "check_out_date";
  register: UseFormRegister<SearchFormInput>;
}

export const DateField: FC<DateFieldProps> = ({ error, label, min, name, register }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      <Calendar className="inline mr-1" size={16} /> {label}
    </label>
    <input type="date" {...register(name)} min={min} className={SEARCH_INPUT_CLASS} />
    {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
  </div>
);
