import type { FC } from "react";

export const OccupancyTableHead: FC<{ dayNumbers: number[] }> = ({ dayNumbers }) => (
  <thead>
    <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
      <th className="sticky left-0 z-10 min-w-50 border-r border-slate-100 bg-slate-50 p-3 text-left text-xs font-semibold uppercase tracking-wider dark:border-slate-800 dark:bg-slate-800/90">
        Properti & Tipe Kamar
      </th>
      {dayNumbers.map((day) => (
        <th key={day} className="min-w-9 border-r border-slate-100 p-2 text-center text-xs font-semibold dark:border-slate-800">
          {day}
        </th>
      ))}
    </tr>
  </thead>
);
