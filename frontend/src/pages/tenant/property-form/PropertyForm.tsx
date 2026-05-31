import type { FC } from "react";
import { PropertyAmenitiesField } from "./PropertyAmenitiesField";
import { PropertyBasicFields } from "./PropertyBasicFields";
import { PropertyImageField } from "./PropertyImageField";
import { PropertyLocationFields } from "./PropertyLocationFields";
import { PropertySubmitButton } from "./PropertySubmitButton";
import type { PropertyFormState } from "./propertyFormTypes";

export const PropertyForm: FC<{ state: PropertyFormState }> = ({ state }) => (
  <form onSubmit={state.form.handleSubmit(state.onSubmit)} className="space-y-5"><PropertyBasicFields state={state} /><PropertyLocationFields state={state} /><PropertyAmenitiesField state={state} /><PropertyImageField state={state} /><PropertySubmitButton isSubmitting={state.form.formState.isSubmitting} /></form>
);
