import type { FC } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

export const PropertiesHeader: FC = () => (
  <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-8">
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
        Properti Anda
      </h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Kelola hotel, apartemen, kost, dan villa yang Anda sewakan.
      </p>
    </div>
    
    <div className="flex shrink-0">
      <Link 
        to="/tenant/properties/new"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 md:w-auto"
      >
        <Plus size={18} />
        Tambah Properti
      </Link>
    </div>
  </div>
);
