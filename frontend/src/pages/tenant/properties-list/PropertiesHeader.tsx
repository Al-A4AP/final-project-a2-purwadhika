import type { FC } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

export const PropertiesHeader: FC = () => (
  <div className="flex items-center justify-between">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Properti Saya</h1>
    <Link to="/tenant/properties/new" className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700">
      <Plus size={16} /> Tambah Properti
    </Link>
  </div>
);
