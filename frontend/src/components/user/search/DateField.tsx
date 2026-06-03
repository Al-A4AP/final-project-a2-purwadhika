import type { FC } from "react";
import { Controller, type Control, type FieldError } from "react-hook-form";
import { Calendar } from "lucide-react";
import type { SearchFormInput } from "@/validations/search";
import { CustomDatePickerPopup } from "@/components/common/CustomDatePickerPopup";
import { SEARCH_INPUT_CLASS } from "./searchFormStyles";

interface DateFieldProps {
  control: Control<SearchFormInput>;
  error?: FieldError;
  label: string;
  min: string;
  name: "check_in_date" | "check_out_date";
}

export const DateField: FC<DateFieldProps> = ({ control, error, label, min, name }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      <Calendar className="inline mr-1" size={16} /> {label}
    </label>
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <CustomDatePickerPopup min={min} value={field.value} onChange={field.onChange} className={SEARCH_INPUT_CLASS} />
      )}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
  </div>
);
