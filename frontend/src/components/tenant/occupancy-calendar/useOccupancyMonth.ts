import { useState } from "react";

export const useOccupancyMonth = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const goPrevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((year) => year - 1); }
    else setCurrentMonth((month) => month - 1);
  };
  const goNextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((year) => year + 1); }
    else setCurrentMonth((month) => month + 1);
  };
  return { currentMonth, currentYear, goNextMonth, goPrevMonth };
};
