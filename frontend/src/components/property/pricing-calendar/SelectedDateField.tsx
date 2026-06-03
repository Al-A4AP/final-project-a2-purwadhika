import type { FC } from "react";
import { CustomDatePickerPopup } from "@/components/common/CustomDatePickerPopup";
import { DATE_INPUT_CLASS } from "./calendarStyles";

type SelectedDateFieldProps = {
  label: string;
  min: string;
  onChange: (value: string) => void;
  value: string;
};

export const SelectedDateField: FC<SelectedDateFieldProps> = ({ label, min, onChange, value }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
    <CustomDatePickerPopup min={min} value={value} onChange={onChange} className={DATE_INPUT_CLASS} />
  </div>
);
