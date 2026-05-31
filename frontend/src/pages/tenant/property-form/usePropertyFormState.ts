import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import type { AxiosError } from "axios";
import { propertyService } from "@/services/propertyService";
import { tenantService } from "@/services/tenantService";
import type { ApiResponse, PropertyCategory } from "@/types";
import { buildPropertyFormData, toPropertyFormValues } from "./propertyFormData";
import { propertyFormSchema, type PropertyFormInput } from "./propertyFormSchema";

export const usePropertyFormState = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const form = useForm<PropertyFormInput>({ resolver: zodResolver(propertyFormSchema) });
  const [categories, setCategories] = useState<PropertyCategory[]>([]);
  const media = usePropertyMedia();
  const amenities = usePropertyAmenities();
  useLoadPropertyForm(id, isEdit, form.reset, amenities.setSelectedAmenities, setCategories, navigate);
  const onSubmit = usePropertySubmit(id, isEdit, media.file, amenities.selectedAmenities, navigate);
  return { categories, form, handleBack: () => navigate(-1), handleFileChange: media.handleFileChange, isEdit, onSubmit, preview: media.preview, selectedAmenities: amenities.selectedAmenities, toggleAmenity: amenities.toggleAmenity };
};

const usePropertyMedia = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => updateFilePreview(event, setFile, setPreview);
  return { file, handleFileChange, preview };
};

const usePropertyAmenities = () => {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const toggleAmenity = (id: string) => setSelectedAmenities((items) => toggleItem(items, id));
  return { selectedAmenities, setSelectedAmenities, toggleAmenity };
};

const useLoadPropertyForm = (
  id: string | undefined,
  isEdit: boolean,
  reset: (values: PropertyFormInput) => void,
  setAmenities: (values: string[]) => void,
  setCategories: (values: PropertyCategory[]) => void,
  navigate: (path: string) => void,
) => {
  useEffect(() => {
    propertyService.getCategories().then(setCategories);
    if (isEdit && id) loadPropertyForEdit(id, reset, setAmenities, navigate);
  }, [id, isEdit, navigate, reset, setAmenities, setCategories]);
};

const loadPropertyForEdit = (
  id: string,
  reset: (values: PropertyFormInput) => void,
  setAmenities: (values: string[]) => void,
  navigate: (path: string) => void,
) => tenantService.getProperty(id).then((property) => {
  setAmenities(property.amenities || []);
  reset(toPropertyFormValues(property));
}).catch((err) => handleLoadError(err, navigate));

const handleLoadError = (err: unknown, navigate: (path: string) => void) => {
  const axiosErr = err as AxiosError<ApiResponse<null>>;
  toast.error(axiosErr.response?.data?.message || "Properti tidak ditemukan atau Anda tidak memiliki akses");
  navigate("/tenant/properties");
};

const usePropertySubmit = (
  id: string | undefined,
  isEdit: boolean,
  file: File | null,
  amenities: string[],
  navigate: (path: string) => void,
) => async (data: PropertyFormInput) => {
  try { await saveProperty(id, isEdit, buildPropertyFormData(data, amenities, file)); navigate("/tenant/properties"); }
  catch (err) { handleSubmitError(err); }
};

const saveProperty = (id: string | undefined, isEdit: boolean, formData: FormData) => {
  if (isEdit && id) return tenantService.updateProperty(id, formData);
  return tenantService.createProperty(formData);
};

const handleSubmitError = (err: unknown) => {
  const axiosErr = err as AxiosError<ApiResponse<null>>;
  toast.error(axiosErr.response?.data?.message || "Gagal menyimpan properti");
};

const updateFilePreview = (
  event: React.ChangeEvent<HTMLInputElement>,
  setFile: (file: File) => void,
  setPreview: (url: string) => void,
) => {
  const file = event.target.files?.[0];
  if (!file) return;
  setFile(file);
  setPreview(URL.createObjectURL(file));
};

const toggleItem = (items: string[], id: string) =>
  items.includes(id) ? items.filter((item) => item !== id) : [...items, id];
