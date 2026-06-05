import type { FC } from "react";
import { ArrowLeft, Plus } from "lucide-react";

interface RoomsPageHeaderProps {
  onBack: () => void;
  propertyName?: string;
  onAdd: () => void;
  isWholeUnit: boolean;
}

export const RoomsPageHeader: FC<RoomsPageHeaderProps> = ({ onBack, propertyName, onAdd, isWholeUnit }) => (
  <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
    <div className="flex flex-col gap-4">
      <button 
        onClick={onBack} 
        className="flex w-fit items-center gap-2 rounded-lg pr-4 py-1.5 text-sm font-semibold text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
      >
        <ArrowLeft size={16} /> 
        Kembali ke Properti
      </button>
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Manajemen Kamar
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          {propertyName ? `Atur tipe kamar, harga, dan ketersediaan untuk ${propertyName}.` : "Atur tipe kamar, harga, dan ketersediaan."}
        </p>
      </div>
    </div>
    
    {!isWholeUnit && (
      <div className="flex shrink-0">
        <button 
          onClick={onAdd}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 md:w-auto"
        >
          <Plus size={18} />
          Tambah Kamar
        </button>
      </div>
    )}
  </div>
);
