import type { FC } from "react";

const TABLE_HEADERS = ["Order ID & Tamu", "Properti & Kamar", "Check In/Out", "Total & Metode", "Status", "Aksi"];

export const OrdersTableHead: FC = () => (
  <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-slate-700 dark:text-gray-300">
    <tr>
      {TABLE_HEADERS.map((header) => <th key={header} className="px-6 py-4">{header}</th>)}
    </tr>
  </thead>
);
