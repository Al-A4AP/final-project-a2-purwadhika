import type { FC } from "react";
import type { OccupancyProperty } from "@/services/tenantReportService";
import { PropertyHeaderRow } from "./PropertyHeaderRow";
import { RoomOccupancyRow } from "./RoomOccupancyRow";

export const PropertyOccupancyRows: FC<{ dayNumbers: number[]; month: number; property: OccupancyProperty; year: number }> = (props) => (
  <>
    <PropertyHeaderRow property={props.property} dayCount={props.dayNumbers.length} />
    {props.property.rooms.map((room) => <RoomOccupancyRow key={room.id} room={room} dayNumbers={props.dayNumbers} year={props.year} month={props.month} />)}
  </>
);
