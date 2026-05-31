import { toDateInputValue } from "./dateUtils";

export const syncSelectedDate = (
  date: Date | undefined,
  onChange: (value: string) => void,
) => {
  onChange(date ? toDateInputValue(date) : "");
};
