import type { FC } from "react";
import { AmenitiesSelector } from "@/components/tenant/AmenitiesSelector";
import { FieldLabel } from "./FormFields";
import type { PropertyFormState } from "./propertyFormTypes";

export const PropertyAmenitiesField: FC<{ state: PropertyFormState }> = ({ state }) => (
  <div><FieldLabel label="Fasilitas" /><AmenitiesSelector selected={state.selectedAmenities} onToggle={state.toggleAmenity} /></div>
);
