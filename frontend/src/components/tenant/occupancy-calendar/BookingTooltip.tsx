import type { FC } from "react";
import { Info } from "lucide-react";
import type { OccupancyRoom } from "@/services/tenantReportService";

type Booking = OccupancyRoom["orders"][number];

const formatShortDate = (date: string) => new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "short" });

export const BookingTooltip: FC<{ booking: Booking }> = ({ booking }) => (
  <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-48 -translate-x-1/2 space-y-1 rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-left text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
    <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-orange-400"><Info size={10} /> Dipesan</div>
    <p className="truncate text-xs font-semibold">{booking.user?.name}</p>
    <p className="text-[10px] text-gray-400">{booking.order_number}</p>
    <div className="mt-1 border-t border-slate-800 pt-1 text-[9px] text-gray-400">{formatShortDate(booking.check_in_date)} - {formatShortDate(booking.check_out_date)}</div>
  </div>
);
