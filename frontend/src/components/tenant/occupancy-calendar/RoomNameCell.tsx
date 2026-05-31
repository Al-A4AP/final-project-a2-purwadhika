import type { FC } from "react";
import { Key } from "lucide-react";
import type { OccupancyRoom } from "@/services/tenantReportService";

export const RoomNameCell: FC<{ room: OccupancyRoom }> = ({ room }) => (
  <td className="sticky left-0 z-10 max-w-50 truncate border-r bg-white p-3 font-medium text-gray-700 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-300">
    <div className="flex items-center gap-1.5"><Key size={14} className="text-gray-500" /><span>{room.room_type}</span></div>
  </td>
);
