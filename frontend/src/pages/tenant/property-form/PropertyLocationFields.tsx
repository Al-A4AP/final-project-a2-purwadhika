import type { FC } from "react";
import type { PropertyFormState } from "@/hooks/tenant/property-form/propertyFormTypes";
import { PropertyLocationFormFields, PropertyLocationHeader } from "./PropertyLocationParts";

export const PropertyLocationFields: FC<{ state: PropertyFormState }> = ({ state }) => (
  <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <PropertyLocationHeader />
    <PropertyLocationFormFields state={state} />
  </div>
);
