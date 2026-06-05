import type { FC } from "react";
import type { OccupancyRoom } from "@/services/tenantReportService";
import { OccupancyCell } from "./OccupancyCell";
import { RoomNameCell } from "./RoomNameCell";

export const RoomOccupancyRow: FC<{ dayNumbers: number[]; month: number; room: OccupancyRoom; year: number }> = ({ dayNumbers, month, room, year }) => (
  <tr className="border-b border-slate-100 transition hover:bg-slate-50/50 dark:border-slate-800 dark:hover:bg-slate-800/20">
    <RoomNameCell room={room} />
    {dayNumbers.map((day) => <OccupancyCell key={day} day={day} month={month} room={room} year={year} />)}
  </tr>
);
