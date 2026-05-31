import type { UseFormReturn } from "react-hook-form";
import type { PropertyCategory } from "@/types";
import type { PropertyFormInput } from "./propertyFormSchema";

export interface PropertyFormState {
  categories: PropertyCategory[];
  form: UseFormReturn<PropertyFormInput>;
  handleBack: () => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isEdit: boolean;
  onSubmit: (data: PropertyFormInput) => Promise<void>;
  preview: string | null;
  selectedAmenities: string[];
  toggleAmenity: (id: string) => void;
}
