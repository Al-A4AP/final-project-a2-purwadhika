import type { FC } from "react";

const TABLE_HEADERS = [
  "ID & Tamu",
  "Properti & Kamar",
  "Tanggal Dibuat",
  "Check In/Out",
  "Total & Pembayaran",
  "Status",
  "Aksi",
];

export const OrdersTableHead: FC = () => (
  <thead className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-400">
    <tr>
      {TABLE_HEADERS.map((header) => (
        <th key={header} className="px-6 py-4">
          {header}
        </th>
      ))}
    </tr>
  </thead>
);
