import type { FC } from "react";
import type { OccupancyRoom } from "@/services/tenantReportService";
import { BookingTooltip } from "./BookingTooltip";
import { getDayBooking } from "./bookingLookup";

interface OccupancyCellProps {
  day: number;
  month: number;
  room: OccupancyRoom;
  year: number;
}

const cellClass = (isBooked: boolean) =>
  isBooked 
    ? "bg-orange-500 text-white hover:bg-orange-600 cursor-help" 
    : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20";

export const OccupancyCell: FC<OccupancyCellProps> = ({ day, month, room, year }) => {
  const booking = getDayBooking(room, day, year, month);
  return (
    <td className={`group relative border-r border-slate-100 p-0 text-center transition-all duration-150 dark:border-slate-800 ${cellClass(Boolean(booking))}`}>
      <div className="flex h-10 w-full items-center justify-center text-xs font-semibold">
        {booking ? "B" : "."}
      </div>
      {booking && <BookingTooltip booking={booking} />}
    </td>
  );
};
