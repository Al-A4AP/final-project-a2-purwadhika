import type { FC } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

export const DashboardHeader: FC = () => (
  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">Selamat datang kembali, kelola properti Anda</p>
    </div>
    <Link to="/tenant/properties/new" className="inline-flex items-center justify-center gap-2 self-start rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 md:self-auto">
      <Plus size={16} /> Tambah Properti
    </Link>
  </div>
);
