import type { FC } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { MAX_PROPERTIES_PER_TENANT } from "@/constants/validation";

export const PropertiesHeader: FC<{ total: number }> = ({ total }) => {
  const isLimitReached = total >= MAX_PROPERTIES_PER_TENANT;
  return (
  <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-8">
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
        Properti Anda
      </h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Kelola hotel, apartemen, kost, dan villa yang Anda sewakan.
      </p>
    </div>
    
    <div className="flex shrink-0 flex-col gap-2">
      {isLimitReached ? <DisabledAddButton /> : <AddPropertyLink />}
      {isLimitReached && <p className="max-w-xs text-xs font-medium text-amber-600 dark:text-amber-400">Batas {MAX_PROPERTIES_PER_TENANT} properti sudah tercapai.</p>}
    </div>
  </div>
  );
};

const AddPropertyLink = () => (
  <Link 
    to="/tenant/properties/new"
    className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 md:w-auto"
  >
    <Plus size={18} />
    Tambah Properti
  </Link>
);

const DisabledAddButton = () => (
  <button
    type="button"
    disabled
    className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-300 px-6 py-3 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed dark:bg-slate-700 dark:text-slate-400 md:w-auto"
  >
    <Plus size={18} />
    Tambah Properti
  </button>
);
