import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/errorMessage";
import { propertyService } from "@/services/propertyService";
import { tenantService } from "@/services/tenantService";
import type { PropertyCategory, PropertyImage } from "@/types";
import { buildPropertyFormData, toPropertyFormValues } from "./propertyFormData";
import { propertyFormSchema, type PropertyFormInput } from "./propertyFormSchema";

export const usePropertyFormState = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const form = useForm<PropertyFormInput>({ resolver: zodResolver(propertyFormSchema) });
  const [categories, setCategories] = useState<PropertyCategory[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // Image & Gallery State
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [cropperSrc, setCropperSrc] = useState<string | null>(null);
  const [cropMode, setCropMode] = useState<"main" | "gallery" | null>(null);
  const [galleryImages, setGalleryImages] = useState<PropertyImage[]>([]);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  useEffect(() => {
    propertyService.getCategories().then(setCategories);
    if (isEdit && id) {
      tenantService.getProperty(id).then((property) => {
        setSelectedAmenities(property.amenities || []);
        form.reset(toPropertyFormValues(property));
        setGalleryImages(property.images || []);
        if (property.featured_image_url) setPreview(property.featured_image_url);
      }).catch((err) => {
        toast.error(getApiErrorMessage(err, "Properti tidak ditemukan"));
        navigate("/tenant/properties");
      });
    }
  }, [id, isEdit, navigate, form.reset]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (!selected) return;
    setCropMode("main");
    setCropperSrc(URL.createObjectURL(selected));
  };

  const handleGalleryFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (!selected) return;
    setCropMode("gallery");
    setCropperSrc(URL.createObjectURL(selected));
  };

  const handleCropComplete = async (blob: Blob) => {
    if (cropMode === "main") {
      const croppedFile = new File([blob], "property.jpg", { type: "image/jpeg" });
      setFile(croppedFile);
      setPreview(URL.createObjectURL(croppedFile));
    } else if (cropMode === "gallery" && id) {
      setUploadingGallery(true);
      try {
        const croppedFile = new File([blob], "gallery.jpg", { type: "image/jpeg" });
        const newImg = await tenantService.addPropertyImage(id, croppedFile);
        setGalleryImages((prev) => [...prev, newImg]);
        toast.success("Gambar berhasil ditambahkan ke galeri");
      } catch (err) {
        toast.error("Gagal menambahkan gambar");
      } finally {
        setUploadingGallery(false);
      }
    }
    setCropperSrc(null);
    setCropMode(null);
  };

  const handleDeleteGallery = async (imageId: string) => {
    if (!id) return;
    try {
      await tenantService.deletePropertyImage(id, imageId);
      const updated = await tenantService.getProperty(id);
      setGalleryImages(updated.images || []);
      setPreview(updated.featured_image_url || null);
      toast.success("Gambar galeri berhasil dihapus");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Gagal menghapus gambar"));
    }
  };

  const handleSetMainGallery = async (imageUrl: string) => {
    if (!id) return;
    try {
      const formData = new FormData();
      formData.append("featured_image_url", imageUrl);
      await tenantService.updateProperty(id, formData);
      setPreview(imageUrl);
      toast.success("Gambar utama berhasil diubah");
    } catch (err) {
      toast.error("Gagal mengubah gambar utama");
    }
  };

  const onSubmit = async (data: PropertyFormInput) => {
    try {
      const formData = buildPropertyFormData(data, selectedAmenities, file);
      if (isEdit && id) {
        await tenantService.updateProperty(id, formData);
      } else {
        await tenantService.createProperty(formData);
      }
      navigate("/tenant/properties");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Properti gagal disimpan"));
    }
  };

  return {
    categories,
    form,
    handleBack: () => navigate(-1),
    handleFileChange,
    isEdit,
    onSubmit,
    preview,
    selectedAmenities,
    toggleAmenity: (uid: string) => setSelectedAmenities((items) =>
      items.includes(uid) ? items.filter((item) => item !== uid) : [...items, uid]
    ),
    cropperSrc,
    handleCropComplete,
    closeCropper: () => { setCropperSrc(null); setCropMode(null); },
    galleryImages,
    uploadingGallery,
    handleGalleryFileChange,
    handleDeleteGallery,
    handleSetMainGallery,
  };
};
