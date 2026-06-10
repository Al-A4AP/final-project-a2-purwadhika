import type { FC } from "react";
import type { OccupancyRoom } from "@/services/tenantReportService";
import { BookingTooltip } from "./BookingTooltip";
import { getDayBooking, getDayBlocked, getDayPeakRate } from "./bookingLookup";

interface OccupancyCellProps {
  day: number;
  month: number;
  room: OccupancyRoom;
  year: number;
}

const getCellAppearance = (isBooked: boolean, isBlocked: boolean, isPeak: boolean) => {
  if (isBooked) return {
    className: "bg-orange-500 text-white hover:bg-orange-600 cursor-help",
    label: "B"
  };
  if (isBlocked) return {
    className: "bg-slate-200 text-slate-500 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-500 dark:hover:bg-slate-700 cursor-not-allowed",
    label: "✕"
  };
  if (isPeak) return {
    className: "bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 cursor-help",
    label: "↑"
  };
  return {
    className: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20 cursor-default",
    label: "."
  };
};

export const OccupancyCell: FC<OccupancyCellProps> = ({ day, month, room, year }) => {
  const booking = getDayBooking(room, day, year, month);
  const blocked = getDayBlocked(room, day, year, month);
  const peak = getDayPeakRate(room, day, year, month);
  
  const appearance = getCellAppearance(Boolean(booking), Boolean(blocked), Boolean(peak));
  
  const getTooltipText = () => {
    if (booking) return null;
    if (blocked) return "Tidak Tersedia";
    if (peak) {
      const val = peak.rate_type === "PERCENTAGE" ? `${peak.rate_value}%` : `Rp ${peak.rate_value.toLocaleString("id-ID")}`;
      return `Peak Season (+${val})`;
    }
    return "Tersedia";
  };

  const tooltipText = getTooltipText();

  return (
    <td className={`group relative border-r border-slate-100 p-0 text-center transition-all duration-150 dark:border-slate-800 ${appearance.className}`}>
      <div className="flex h-10 w-full items-center justify-center text-xs font-semibold">
        {appearance.label}
      </div>
      {booking && <BookingTooltip booking={booking} />}
      {tooltipText && (
        <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 rounded bg-slate-800 px-2 py-1 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap">
          {tooltipText}
          <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-slate-800" />
        </div>
      )}
    </td>
  );
};
