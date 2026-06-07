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
    <div className="space-y-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <OccupancyHeader canGoPrev={monthState.canGoPrev} month={monthState.currentMonth} year={monthState.currentYear} onPrev={monthState.goPrevMonth} onNext={monthState.goNextMonth} />
        <OccupancyLegend />
      </div>
      <OccupancyTable data={data} dayNumbers={dayNumbers} year={monthState.currentYear} month={monthState.currentMonth} />
    </div>
  );
};
