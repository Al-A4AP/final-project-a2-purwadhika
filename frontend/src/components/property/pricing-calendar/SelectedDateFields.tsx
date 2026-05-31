import type { FC } from "react";
import { SelectedDateField } from "./SelectedDateField";

type SelectedDateFieldsProps = {
  checkIn: string;
  checkOut: string;
};

export const SelectedDateFields: FC<SelectedDateFieldsProps> = ({ checkIn, checkOut }) => (
  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
    <SelectedDateField label="Check-in" value={checkIn} />
    <SelectedDateField label="Check-out" value={checkOut} />
  </div>
);
