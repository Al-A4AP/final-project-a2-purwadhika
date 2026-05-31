import type { FC } from "react";
import type { OccupancyRoom } from "@/services/tenantReportService";
import { OccupancyCell } from "./OccupancyCell";
import { RoomNameCell } from "./RoomNameCell";

export const RoomOccupancyRow: FC<{ dayNumbers: number[]; month: number; room: OccupancyRoom; year: number }> = ({ dayNumbers, month, room, year }) => (
  <tr className="border-b hover:bg-gray-50/50 dark:border-slate-700 dark:hover:bg-slate-700/20">
    <RoomNameCell room={room} />
    {dayNumbers.map((day) => <OccupancyCell key={day} day={day} month={month} room={room} year={year} />)}
  </tr>
);
