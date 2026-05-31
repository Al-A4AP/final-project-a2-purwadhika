import type { FC } from "react";
import { Link } from "react-router-dom";

export const RecentOrdersHeader: FC = () => (
  <div className="flex items-center justify-between border-b p-4 dark:border-slate-700 md:p-6">
    <h2 className="font-semibold text-gray-900 dark:text-white">Pesanan Terbaru</h2>
    <Link to="/tenant/orders" className="text-sm font-medium text-red-600 hover:underline">Lihat semua</Link>
  </div>
);
