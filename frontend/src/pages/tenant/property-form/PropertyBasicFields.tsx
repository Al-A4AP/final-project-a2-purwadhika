import type { FC } from "react";
import type { PropertyCategory } from "@/types";
import { FieldErrorText, FieldLabel, PROPERTY_INPUT_CLASS, TextAreaField, TextField } from "./FormFields";
import type { PropertyFormState } from "./propertyFormTypes";
import { Building2 } from "lucide-react";

export const PropertyBasicFields: FC<{ state: PropertyFormState }> = ({ state }) => {
  const { errors } = state.form.formState;
  
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
          <Building2 size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Informasi Dasar</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Detail utama properti Anda.</p>
        </div>
      </div>

      <div className="space-y-5">
        <TextField 
          label="Nama Properti" 
          name="name" 
          placeholder="Contoh: Grand Menteng Hotel" 
          register={state.form.register} 
          error={errors.name}
          helperText="Nama yang akan dilihat oleh tamu."
        />
        <CategoryField categories={state.categories} state={state} />
        <TextAreaField 
          label="Deskripsi" 
          name="description" 
          placeholder="Ceritakan keunikan dan keunggulan properti Anda..." 
          register={state.form.register} 
          error={errors.description} 
          helperText="Deskripsi yang menarik meningkatkan peluang pemesanan."
        />
      </div>
    </div>
  );
};

const CategoryField: FC<{ categories: PropertyCategory[]; state: PropertyFormState }> = ({ categories, state }) => {
  const error = state.form.formState.errors.categoryId;
  
  return (
    <div>
      <FieldLabel label="Kategori" />
      <select 
        {...state.form.register("categoryId")} 
        className={`${PROPERTY_INPUT_CLASS} ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
      >
        <option value="">Pilih kategori...</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>{category.name}</option>
        ))}
      </select>
      <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">Kategori menentukan filter pencarian.</p>
      {error && <FieldErrorText message={error.message} />}
    </div>
  );
};
