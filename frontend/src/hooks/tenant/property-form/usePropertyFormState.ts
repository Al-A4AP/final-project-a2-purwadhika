import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/errorMessage";
import { propertyService } from "@/services/propertyService";
import { tenantService } from "@/services/tenantService";
import type { PropertyCategory } from "@/types";
import { useAmenityState, type AmenityState } from "@/pages/tenant/property-form/propertyAmenityState";
import { buildPropertyFormData, toPropertyFormValues } from "@/pages/tenant/property-form/propertyFormData";
import { handlePropertyCrop, useGalleryState, useImageState, type GalleryState, type ImageState } from "@/pages/tenant/property-form/propertyFormMediaState";
import { propertyFormSchema, type PropertyFormInput } from "@/pages/tenant/property-form/propertyFormSchema";
import type { PropertyFormState } from "@/pages/tenant/property-form/propertyFormTypes";

export const usePropertyFormState = () => {
  const context = usePropertyFormContext();
  const amenity = useAmenityState();
  const image = useImageState();
  const gallery = useGalleryState(context.id, image.setPreview);
  const categories = usePropertyFormLoader({ ...context, amenity, gallery, image });
  const onSubmit = useSubmitProperty({ ...context, amenity, file: image.file });
  const handleCropComplete = (blob: Blob) => handlePropertyCrop(blob, { gallery, id: context.id, image });
  return buildPropertyFormState(context, { amenity, categories, gallery, handleCropComplete, image, onSubmit });
};

const usePropertyFormContext = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const form = useForm<PropertyFormInput>({ resolver: zodResolver(propertyFormSchema) });
  return { form, id, isEdit, navigate };
};

const buildPropertyFormState = (context: PropertyFormContext, state: BuildStateOptions): PropertyFormState => ({
  categories: state.categories,
  form: context.form,
  handleBack: () => context.navigate(-1),
  isEdit: context.isEdit,
  onSubmit: state.onSubmit,
  ...pickImageState(state.image, state.handleCropComplete),
  ...pickAmenityState(state.amenity),
  ...pickGalleryState(state.gallery),
});

const pickImageState = (image: ImageState, handleCropComplete: (blob: Blob) => void) => ({
  closeCropper: image.closeCropper,
  cropperSrc: image.cropperSrc,
  handleCropComplete,
  handleFileChange: image.handleFileChange,
  handleGalleryFileChange: image.handleGalleryFileChange,
  preview: image.preview,
});

const pickAmenityState = (amenity: AmenityState) => ({
  selectedAmenities: amenity.selectedAmenities,
  toggleAmenity: amenity.toggleAmenity,
});

const pickGalleryState = (gallery: GalleryState) => ({
  galleryImages: gallery.galleryImages,
  handleDeleteGallery: gallery.handleDeleteGallery,
  handleSetMainGallery: gallery.handleSetMainGallery,
  uploadingGallery: gallery.uploadingGallery,
});

const usePropertyFormLoader = (options: PropertyFormLoaderOptions) => {
  const [categories, setCategories] = useState<PropertyCategory[]>([]);
  const { amenity, form, gallery, id, image, isEdit, navigate } = options;
  const { reset } = form;
  useEffect(() => {
    loadPropertyFormData(setCategories, { id, isEdit, navigate, resetForm: reset, setGalleryImages: gallery.setGalleryImages, setPreview: image.setPreview, setSelectedAmenities: amenity.setSelectedAmenities });
  }, [amenity.setSelectedAmenities, gallery.setGalleryImages, id, image.setPreview, isEdit, navigate, reset]);
  return categories;
};

const loadPropertyFormData = (setCategories: (items: PropertyCategory[]) => void, options: EditablePropertyLoadOptions) => {
  propertyService.getCategories().then(setCategories);
  if (options.isEdit && options.id) loadEditableProperty(options);
};

const useSubmitProperty = ({ amenity, file, id, isEdit, navigate }: SubmitPropertyOptions) =>
  useCallback(async (data: PropertyFormInput) => {
    await submitPropertyForm(data, { amenity, file, id, isEdit, navigate });
  }, [amenity, file, id, isEdit, navigate]);

const loadEditableProperty = (options: EditablePropertyLoadOptions) => {
  tenantService.getProperty(options.id!).then((property) => applyLoadedProperty(property, options)).catch((err) => {
    toast.error(getApiErrorMessage(err, "Properti tidak ditemukan"));
    options.navigate("/tenant/properties");
  });
};

const applyLoadedProperty = (property: Awaited<ReturnType<typeof tenantService.getProperty>>, options: EditablePropertyLoadOptions) => {
  options.setSelectedAmenities(property.amenities || []);
  options.resetForm(toPropertyFormValues(property));
  options.setGalleryImages(property.images || []);
  if (property.featured_image_url) options.setPreview(property.featured_image_url);
};

const submitPropertyForm = async (data: PropertyFormInput, options: SubmitPropertyOptions) => {
  try {
    const formData = buildPropertyFormData(data, options.amenity.selectedAmenities, options.file);
    await saveProperty(options, formData);
    options.navigate("/tenant/properties");
  } catch (err) {
    toast.error(getApiErrorMessage(err, "Properti gagal disimpan"));
  }
};

const saveProperty = (options: SubmitPropertyOptions, formData: FormData) =>
  options.isEdit && options.id ? tenantService.updateProperty(options.id, formData) : tenantService.createProperty(formData);

type Navigate = ReturnType<typeof useNavigate>;
type PropertyForm = UseFormReturn<PropertyFormInput>;
type PropertyFormContext = ReturnType<typeof usePropertyFormContext>;

interface BuildStateOptions {
  amenity: AmenityState;
  categories: PropertyCategory[];
  gallery: GalleryState;
  handleCropComplete: (blob: Blob) => void;
  image: ImageState;
  onSubmit: (data: PropertyFormInput) => Promise<void>;
}

interface PropertyFormLoaderOptions {
  amenity: AmenityState;
  form: PropertyForm;
  gallery: GalleryState;
  id?: string;
  image: ImageState;
  isEdit: boolean;
  navigate: Navigate;
}

interface EditablePropertyLoadOptions {
  id?: string;
  isEdit: boolean;
  navigate: Navigate;
  resetForm: PropertyForm["reset"];
  setGalleryImages: GalleryState["setGalleryImages"];
  setPreview: ImageState["setPreview"];
  setSelectedAmenities: AmenityState["setSelectedAmenities"];
}

interface SubmitPropertyOptions {
  amenity: AmenityState;
  file: File | null;
  id?: string;
  isEdit: boolean;
  navigate: Navigate;
}
