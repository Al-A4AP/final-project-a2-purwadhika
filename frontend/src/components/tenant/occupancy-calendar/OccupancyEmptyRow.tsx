import type { FC } from "react";

export const OccupancyEmptyRow: FC<{ colSpan: number }> = ({ colSpan }) => (
  <tr>
    <td colSpan={colSpan} className="p-12 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
      Belum ada data properti dan kamar untuk kalender ketersediaan.
    </td>
  </tr>
);
