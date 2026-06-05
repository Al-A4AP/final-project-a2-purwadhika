import type { FC } from "react";
import { AmenitiesSelector } from "@/components/tenant/AmenitiesSelector";
import type { PropertyFormState } from "./propertyFormTypes";
import { Sparkles } from "lucide-react";

export const PropertyAmenitiesField: FC<{ state: PropertyFormState }> = ({ state }) => (
  <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
        <Sparkles size={20} />
      </div>
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Fasilitas Properti</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Pilih fasilitas yang tersedia untuk tamu.</p>
      </div>
    </div>

    <AmenitiesSelector selected={state.selectedAmenities} onToggle={state.toggleAmenity} />
  </div>
);
