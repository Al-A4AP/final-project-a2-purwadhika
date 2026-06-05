import type { FC } from "react";
import { CustomDatePickerPopup } from "@/components/common/CustomDatePickerPopup";
import { DATE_INPUT_CLASS } from "./calendarStyles";

type SelectedDateFieldProps = {
  label: string;
  min: string;
  onChange: (value: string) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  value: string;
};

export const SelectedDateField: FC<SelectedDateFieldProps> = ({ label, min, onChange, onOpenChange, open, value }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
    <CustomDatePickerPopup
      display="inline"
      isOpen={open}
      min={min}
      onChange={onChange}
      onOpenChange={onOpenChange}
      value={value}
      className={DATE_INPUT_CLASS}
    />
  </div>
);
