import type { FC } from "react";
import { ArrowLeft } from "lucide-react";
import type { PropertyFormState } from "./propertyFormTypes";

export const PropertyFormHeader: FC<{ state: PropertyFormState }> = ({ state }) => (
  <><button onClick={state.handleBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm"><ArrowLeft size={16} /> Kembali</button><h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">{state.isEdit ? "Edit Properti" : "Tambah Properti Baru"}</h1></>
);
