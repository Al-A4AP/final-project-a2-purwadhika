import type { FC } from "react";
import type { PropertyCategory } from "@/types";
import type { PropertyFormState } from "@/hooks/tenant/property-form/propertyFormTypes";
import {
  FieldErrorText,
  FieldLabel,
  PROPERTY_INPUT_CLASS,
  TextAreaField,
  TextField,
} from "./FormFields";
import { Building2 } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

export const PropertyBasicFields: FC<{ state: PropertyFormState }> = ({
  state,
}) => {
  const { errors } = state.form.formState;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
          <Building2 size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Informasi Dasar
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Detail utama properti Anda.
          </p>
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
          maxLength={35}
        />
        <CategoryField categories={state.categories} state={state} />
        <RentalTypeField state={state} />
        <TextAreaField
          label="Deskripsi"
          name="description"
          placeholder="Ceritakan keunikan dan keunggulan properti Anda..."
          register={state.form.register}
          error={errors.description}
          helperText="Deskripsi yang menarik meningkatkan peluang pemesanan."
          maxLength={2000}
        />
      </div>
    </div>
  );
};

const CategoryField: FC<{
  categories: PropertyCategory[];
  state: PropertyFormState;
}> = ({ categories, state }) => {
  const error = state.form.formState.errors.categoryId;
  const user = useAuthStore((s) => s.user);

  const systemCategories = categories.filter((c) => c.tenantId === null);
  const ownCategories = categories.filter((c) => c.tenantId === user?.id);
  const sharedCategories = categories.filter(
    (c) => c.tenantId !== null && c.tenantId !== user?.id,
  );

  return (
    <div>
      <FieldLabel label="Kategori" />
      <select
        {...state.form.register("categoryId")}
        className={`${PROPERTY_INPUT_CLASS} ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
      >
        <option value="">Pilih kategori...</option>
        {systemCategories.length > 0 && (
          <optgroup label="Default Sistem">
            {systemCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </optgroup>
        )}
        {ownCategories.length > 0 && (
          <optgroup label="Kategori Anda">
            {ownCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </optgroup>
        )}
        {sharedCategories.length > 0 && (
          <optgroup label="Dipakai Bersama">
            {sharedCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </optgroup>
        )}
      </select>
      <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
        Kategori menentukan filter pencarian.
      </p>
      {error && <FieldErrorText message={error.message} />}
    </div>
  );
};

const RentalTypeField: FC<{ state: PropertyFormState }> = ({ state }) => {
  const error = state.form.formState.errors.rental_type;

  return (
    <div>
      <FieldLabel label="Mode Sewa" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1.5">
        <label
          className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all ${state.form.watch("rental_type") === "PER_ROOM" ? "border-blue-500 bg-blue-50/50 dark:border-blue-500/50 dark:bg-blue-900/20" : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600"}`}
        >
          <div className="flex h-5 items-center">
            <input
              type="radio"
              value="PER_ROOM"
              {...state.form.register("rental_type")}
              className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-600 dark:border-slate-600 dark:bg-slate-800"
            />
          </div>
          <div>
            <div className="font-semibold text-slate-900 dark:text-white">
              Sewa Kamar
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Konfigurasi kamar terpisah dengan harga dan fasilitas
              masing-masing (seperti hotel/apartemen).
            </div>
          </div>
        </label>

        <label
          className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all ${state.form.watch("rental_type") === "WHOLE_PROPERTY" ? "border-blue-500 bg-blue-50/50 dark:border-blue-500/50 dark:bg-blue-900/20" : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600"}`}
        >
          <div className="flex h-5 items-center">
            <input
              type="radio"
              value="WHOLE_PROPERTY"
              {...state.form.register("rental_type")}
              className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-600 dark:border-slate-600 dark:bg-slate-800"
            />
          </div>
          <div>
            <div className="font-semibold text-slate-900 dark:text-white">
              Sewa Seluruh Properti
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Sewa seluruh fasilitas properti secara bersama tanpa rincian kamar
              (seperti rumah/villa).
            </div>
          </div>
        </label>
      </div>
      {error && <FieldErrorText message={error.message} />}
    </div>
  );
};
