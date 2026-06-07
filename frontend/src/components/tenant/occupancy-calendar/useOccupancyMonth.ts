import { useState } from "react";

export const useOccupancyMonth = () => {
  const [visibleDate, setVisibleDate] = useState(() => startOfMonth(new Date()));
  const canGoPrev = visibleDate > startOfMonth(new Date());
  const goPrevMonth = () => canGoPrev && setVisibleDate(addMonths(visibleDate, -1));
  const goNextMonth = () => setVisibleDate(addMonths(visibleDate, 1));
  return { canGoPrev, currentMonth: visibleDate.getMonth(), currentYear: visibleDate.getFullYear(), goNextMonth, goPrevMonth };
};

const startOfMonth = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), 1);

const addMonths = (date: Date, amount: number) =>
  new Date(date.getFullYear(), date.getMonth() + amount, 1);
