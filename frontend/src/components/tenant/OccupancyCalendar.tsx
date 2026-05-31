import type { FC } from "react";
import type { OccupancyProperty } from "@/services/tenantReportService";
import { buildDayNumbers } from "./occupancy-calendar/calendarDays";
import { OccupancyHeader } from "./occupancy-calendar/OccupancyHeader";
import { OccupancyLegend } from "./occupancy-calendar/OccupancyLegend";
import { OccupancyTable } from "./occupancy-calendar/OccupancyTable";
import { useOccupancyMonth } from "./occupancy-calendar/useOccupancyMonth";

interface Props {
  data: OccupancyProperty[];
}

export const OccupancyCalendar: FC<Props> = ({ data }) => {
  const monthState = useOccupancyMonth();
  const dayNumbers = buildDayNumbers(monthState.currentYear, monthState.currentMonth);
  return (
    <div className="space-y-5 rounded-xl border bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 md:space-y-6 md:p-6">
      <OccupancyHeader month={monthState.currentMonth} year={monthState.currentYear} onPrev={monthState.goPrevMonth} onNext={monthState.goNextMonth} />
      <OccupancyLegend />
      <OccupancyTable data={data} dayNumbers={dayNumbers} year={monthState.currentYear} month={monthState.currentMonth} />
    </div>
  );
};
