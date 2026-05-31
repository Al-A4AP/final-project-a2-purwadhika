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
  isBooked ? "bg-orange-500 text-white hover:bg-orange-600 cursor-help" : "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:bg-emerald-500/5";

export const OccupancyCell: FC<OccupancyCellProps> = ({ day, month, room, year }) => {
  const booking = getDayBooking(room, day, year, month);
  return (
    <td className={`group relative border-r p-2 text-center transition-all duration-150 dark:border-slate-700 ${cellClass(Boolean(booking))}`}>
      {booking ? "B" : "."}
      {booking && <BookingTooltip booking={booking} />}
    </td>
  );
};
