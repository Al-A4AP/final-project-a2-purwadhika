import type { FC } from "react";
import { TextField } from "./FormFields";
import type { PropertyFormState } from "./propertyFormTypes";

export const PropertyLocationFields: FC<{ state: PropertyFormState }> = ({ state }) => {
  const { errors } = state.form.formState;
  return <div className="grid grid-cols-2 gap-4"><TextField label="Kota" name="city" placeholder="cth. Jakarta" register={state.form.register} error={errors.city} /><TextField label="Provinsi" name="province" placeholder="cth. DKI Jakarta" register={state.form.register} /><div className="col-span-2"><TextField label="Alamat" name="address" placeholder="Jl. Contoh No. 1" register={state.form.register} error={errors.address} /></div></div>;
};
