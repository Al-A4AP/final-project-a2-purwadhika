import type { UseFormReturn } from "react-hook-form";
import type { PropertyCategory, PropertyImage } from "@/types";
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
  cropperSrc: string | null;
  handleCropComplete: (blob: Blob) => void;
  closeCropper: () => void;
  galleryImages: PropertyImage[];
  uploadingGallery: boolean;
  handleGalleryFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeleteGallery: (imageId: string) => Promise<void>;
  handleSetMainGallery: (imageUrl: string) => Promise<void>;
}
