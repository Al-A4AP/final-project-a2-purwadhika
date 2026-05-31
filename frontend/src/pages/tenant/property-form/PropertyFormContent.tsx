import type { FC } from "react";
import { PropertyForm } from "./PropertyForm";
import { PropertyFormHeader } from "./PropertyFormHeader";
import type { PropertyFormState } from "./propertyFormTypes";

export const PropertyFormContent: FC<{ state: PropertyFormState }> = ({ state }) => (
  <div className="p-6 md:p-8 max-w-2xl"><PropertyFormHeader state={state} /><PropertyForm state={state} /></div>
);
