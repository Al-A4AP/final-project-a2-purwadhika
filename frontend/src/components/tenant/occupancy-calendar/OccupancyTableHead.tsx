import type { FC } from "react";

export const OccupancyTableHead: FC<{ dayNumbers: number[] }> = ({ dayNumbers }) => (
  <thead>
    <tr className="border-b bg-gray-50 text-gray-600 dark:border-slate-700 dark:bg-slate-700/50 dark:text-gray-300">
      <th className="sticky left-0 z-10 min-w-50 border-r bg-gray-50 p-3 text-left font-semibold dark:border-slate-700 dark:bg-slate-800">Properti & Kamar</th>
      {dayNumbers.map((day) => <th key={day} className="min-w-9 border-r p-2 text-center font-semibold dark:border-slate-700">{day}</th>)}
    </tr>
  </thead>
);
