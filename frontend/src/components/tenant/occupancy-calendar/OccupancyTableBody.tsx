import type { FC } from "react";
import type { OccupancyProperty } from "@/services/tenantReportService";
import { OccupancyEmptyRow } from "./OccupancyEmptyRow";
import { PropertyOccupancyRows } from "./PropertyOccupancyRows";

export const OccupancyTableBody: FC<{ data: OccupancyProperty[]; dayNumbers: number[]; month: number; year: number }> = (props) => (
  <tbody>
    {props.data.length === 0 ? <OccupancyEmptyRow colSpan={props.dayNumbers.length + 1} /> : props.data.map((property) => <PropertyOccupancyRows key={property.id} property={property} dayNumbers={props.dayNumbers} year={props.year} month={props.month} />)}
  </tbody>
);
