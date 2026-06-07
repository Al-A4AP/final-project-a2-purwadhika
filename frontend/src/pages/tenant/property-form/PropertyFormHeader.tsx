import type { FC } from "react";
import { ArrowLeft } from "lucide-react";
import type { PropertyFormState } from "@/hooks/tenant/property-form/propertyFormTypes";

export const PropertyFormHeader: FC<{ state: PropertyFormState }> = ({ state }) => (
  <div className="mb-8 flex flex-col gap-4">
    <button 
      onClick={state.handleBack} 
      className="flex w-fit items-center gap-2 rounded-lg pr-4 py-1.5 text-sm font-semibold text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
    >
      <ArrowLeft size={16} /> 
      Kembali ke Daftar Properti
    </button>
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
        {state.isEdit ? "Edit Properti" : "Tambah Properti Baru"}
      </h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Lengkapi detail properti Anda agar lebih menarik bagi tamu.
      </p>
    </div>
  </div>
);
