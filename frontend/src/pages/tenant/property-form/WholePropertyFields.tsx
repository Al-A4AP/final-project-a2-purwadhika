import type { FC } from "react";
import type { PropertyFormState } from "@/hooks/tenant/property-form/propertyFormTypes";
import { CurrencyField, TextField } from "./FormFields";

export const WholePropertyFields: FC<{ state: PropertyFormState }> = ({ state }) => {
  if (state.form.watch("rental_type") !== "WHOLE_PROPERTY") return null;
  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-900/40 dark:bg-blue-900/10">
      <WholePropertyHeader />
      <WholePropertyFieldGrid state={state} />
    </div>
  );
};

const WholePropertyHeader: FC = () => (
  <>
    <h3 className="font-semibold text-slate-900 dark:text-white">Harga & Kapasitas Sewa Seluruh Properti</h3>
    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Berlaku untuk satu unit properti dengan stok tetap satu.</p>
  </>
);

const WholePropertyFieldGrid: FC<{ state: PropertyFormState }> = ({ state }) => (
  <div className="mt-4 grid gap-4 md:grid-cols-2">
    <CurrencyField control={state.form.control} error={state.form.formState.errors.whole_property_price}
      helperText="Harga sewa seluruh unit per malam, maksimal Rp100.000.000." label="Harga per Malam (Rp)"
      name="whole_property_price" placeholder="Contoh: 1.500.000" />
    <TextField error={state.form.formState.errors.whole_property_capacity}
      helperText="Jumlah maksimal orang dewasa untuk seluruh unit." label="Kapasitas Dewasa" min="1"
      name="whole_property_capacity" placeholder="Contoh: 8" register={state.form.register} type="number" />
  </div>
);
