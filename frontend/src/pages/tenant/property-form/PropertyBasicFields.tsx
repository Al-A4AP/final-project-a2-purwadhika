import type { FC } from "react";
import type { PropertyCategory } from "@/types";
import { FieldErrorText, FieldLabel, PROPERTY_INPUT_CLASS, TextAreaField, TextField } from "./FormFields";
import type { PropertyFormState } from "./propertyFormTypes";

export const PropertyBasicFields: FC<{ state: PropertyFormState }> = ({ state }) => {
  const { errors } = state.form.formState;
  return <><TextField label="Nama Properti" name="name" placeholder="cth. Grand Menteng Hotel" register={state.form.register} error={errors.name} /><CategoryField categories={state.categories} state={state} /><TextAreaField label="Deskripsi" name="description" placeholder="Jelaskan properti Anda..." register={state.form.register} error={errors.description} /></>;
};

const CategoryField: FC<{ categories: PropertyCategory[]; state: PropertyFormState }> = ({ categories, state }) => (
  <div><FieldLabel label="Kategori" /><select {...state.form.register("categoryId")} className={PROPERTY_INPUT_CLASS}><option value="">Pilih kategori...</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select>{state.form.formState.errors.categoryId && <FieldErrorText message={state.form.formState.errors.categoryId.message} />}</div>
);
