import type { FC } from "react";
import { Building2 } from "lucide-react";
import type { OccupancyProperty } from "@/services/tenantReportService";

export const PropertyHeaderRow: FC<{ dayCount: number; property: OccupancyProperty }> = ({ dayCount, property }) => (
  <tr className="border-b border-slate-200 bg-slate-100 dark:border-slate-700/80 dark:bg-slate-800">
    <td colSpan={dayCount + 1} className="sticky left-0 z-10 bg-slate-100 px-4 py-3 font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-r border-slate-200 dark:border-slate-700/80 shadow-[4px_0_12px_rgba(0,0,0,0.03)] dark:shadow-[4px_0_12px_rgba(0,0,0,0.2)]">
      <div className="flex items-center gap-2">
        <Building2 size={16} className="text-slate-500 dark:text-slate-400" />
        <span>{property.name}</span>
      </div>
    </td>
  </tr>
);
