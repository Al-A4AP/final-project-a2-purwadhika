import type { FC } from "react";

export const OccupancyEmptyRow: FC<{ colSpan: number }> = ({ colSpan }) => (
  <tr><td colSpan={colSpan} className="p-8 text-center text-gray-500">Belum ada data properti dan kamar untuk kalender okupansi.</td></tr>
);
