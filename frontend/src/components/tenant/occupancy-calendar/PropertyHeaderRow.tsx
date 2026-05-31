import type { FC } from "react";
import { Home } from "lucide-react";
import type { OccupancyProperty } from "@/services/tenantReportService";

export const PropertyHeaderRow: FC<{ dayCount: number; property: OccupancyProperty }> = ({ dayCount, property }) => (
  <tr className="border-b bg-gray-100/70 dark:border-slate-700 dark:bg-slate-700/20">
    <td colSpan={dayCount + 1} className="sticky left-0 z-10 bg-gray-100/70 p-2.5 font-bold text-gray-800 dark:bg-slate-800/80 dark:text-gray-200">
      <div className="flex items-center gap-1.5"><Home size={16} className="text-rose-600 dark:text-rose-400" /><span>{property.name}</span></div>
    </td>
  </tr>
);
