import type { FC } from "react";
import { MapPin } from "lucide-react";
import type { PropertyFormState } from "@/hooks/tenant/property-form/propertyFormTypes";
import { ADDRESS_MAX_LENGTH, CITY_MAX_LENGTH, PROVINCE_MAX_LENGTH } from "@/constants/validation";
import { TextField } from "./FormFields";

export const PropertyLocationHeader = () => (
  <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"><MapPin size={20} /></div>
    <div><h2 className="text-lg font-bold text-slate-900 dark:text-white">Lokasi</h2><p className="text-xs text-slate-500 dark:text-slate-400">Alamat lengkap properti Anda.</p></div>
  </div>
);

export const PropertyLocationFormFields: FC<{ state: PropertyFormState }> = ({ state }) => {
  const errors = state.form.formState.errors;
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      <TextField label="Kota" name="city" placeholder="Contoh: Jakarta Selatan" register={state.form.register} error={errors.city} maxLength={CITY_MAX_LENGTH} />
      <TextField label="Provinsi" name="province" placeholder="Contoh: DKI Jakarta" register={state.form.register} error={errors.province} maxLength={PROVINCE_MAX_LENGTH} />
      <div className="md:col-span-2"><TextField label="Alamat Lengkap" name="address" placeholder="Contoh: Jl. Sudirman No. 123, RT 01/RW 02..." register={state.form.register} error={errors.address} maxLength={ADDRESS_MAX_LENGTH} helperText="Alamat spesifik untuk membantu navigasi tamu." /></div>
    </div>
  );
};
