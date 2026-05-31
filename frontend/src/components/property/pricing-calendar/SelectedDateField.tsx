import type { FC } from "react";
import { READONLY_DATE_INPUT_CLASS } from "./calendarStyles";

type SelectedDateFieldProps = {
  label: string;
  value: string;
};

export const SelectedDateField: FC<SelectedDateFieldProps> = ({ label, value }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
    <input type="date" value={value} readOnly className={READONLY_DATE_INPUT_CLASS} />
  </div>
);
