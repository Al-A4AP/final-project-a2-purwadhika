import type { FC } from "react";
import { PropertyForm } from "./PropertyForm";
import { PropertyFormHeader } from "./PropertyFormHeader";
import type { PropertyFormState } from "./propertyFormTypes";

export const PropertyFormContent: FC<{ state: PropertyFormState }> = ({ state }) => (
  <div className="min-h-screen bg-slate-50 px-4 py-8 md:p-10 dark:bg-slate-900 pb-24 md:pb-10">
    <div className="mx-auto max-w-3xl">
      <PropertyFormHeader state={state} />
      <PropertyForm state={state} />
    </div>
  </div>
);
