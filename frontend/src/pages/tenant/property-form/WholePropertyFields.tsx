import type { FC } from "react";
import type { PropertyFormState } from "@/hooks/tenant/property-form/propertyFormTypes";
import { TextField } from "./FormFields";

export const WholePropertyFields: FC<{ state: PropertyFormState }> = ({
  state,
}) => {
  if (state.form.watch("rental_type") !== "WHOLE_PROPERTY") return null;
  const errors = state.form.formState.errors;
  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-900/40 dark:bg-blue-900/10">
      <h3 className="font-semibold text-slate-900 dark:text-white">
        Harga & Kapasitas Sewa Seluruh Properti
      </h3>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        Berlaku untuk satu unit properti dengan stok tetap satu.
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <TextField
          error={errors.whole_property_price}
          helperText="Harga sewa seluruh unit per malam."
          label="Harga per Malam (Rp)"
          min="1"
          name="whole_property_price"
          placeholder="Contoh: 1500000"
          register={state.form.register}
          step="10000"
          type="number"
        />
        <TextField
          error={errors.whole_property_capacity}
          helperText="Jumlah maksimal tamu untuk seluruh unit."
          label="Kapasitas Maksimal"
          min="1"
          name="whole_property_capacity"
          placeholder="Contoh: 8"
          register={state.form.register}
          type="number"
        />
      </div>
    </div>
  );
};
