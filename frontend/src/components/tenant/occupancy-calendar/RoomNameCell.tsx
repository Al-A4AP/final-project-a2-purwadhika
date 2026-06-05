import type { FC } from "react";
import { BedDouble } from "lucide-react";
import type { OccupancyRoom } from "@/services/tenantReportService";

export const RoomNameCell: FC<{ room: OccupancyRoom }> = ({ room }) => (
  <td className="sticky left-0 z-10 max-w-50 truncate border-r border-slate-100 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-[4px_0_12px_rgba(0,0,0,0.02)] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:shadow-[4px_0_12px_rgba(0,0,0,0.2)]">
    <div className="flex items-center gap-2">
      <BedDouble size={14} className="text-slate-400" />
      <span className="truncate">{room.room_type}</span>
    </div>
  </td>
);
