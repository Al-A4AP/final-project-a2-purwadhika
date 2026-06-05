import type { FC } from "react";
import type { OccupancyProperty } from "@/services/tenantReportService";
import { OccupancyTableBody } from "./OccupancyTableBody";
import { OccupancyTableHead } from "./OccupancyTableHead";

export const OccupancyTable: FC<{ data: OccupancyProperty[]; dayNumbers: number[]; month: number; year: number }> = (props) => (
  <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
    <table className="w-full border-collapse text-sm">
      <OccupancyTableHead dayNumbers={props.dayNumbers} />
      <OccupancyTableBody {...props} />
    </table>
  </div>
);
