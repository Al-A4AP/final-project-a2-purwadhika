import type { FC } from "react";
import { CalendarIcon } from "lucide-react";

export const NightsNotice: FC<{ nights: number }> = ({ nights }) =>
  nights > 0 ? (
    <p className="mt-4 text-sm text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
      <CalendarIcon size={16} /> Terpilih: {nights} malam
    </p>
  ) : null;
