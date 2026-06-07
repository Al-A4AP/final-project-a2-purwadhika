import { useState, type ChangeEvent, type Dispatch, type SetStateAction } from "react";
import { toast } from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/errorMessage";
import { tenantService } from "@/services/tenantService";
import type { PropertyImage } from "@/types";

type CropMode = "main" | "gallery" | null;

export const useImageState = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [cropperSrc, setCropperSrc] = useState<string | null>(null);
  const [cropMode, setCropMode] = useState<CropMode>(null);
  return buildImageState({ cropMode, cropperSrc, file, preview, setCropMode, setCropperSrc, setFile, setPreview });
};

export const useGalleryState = (propertyId: string | undefined, setPreview: SetPreview) => {
  const [galleryImages, setGalleryImages] = useState<PropertyImage[]>([]);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const handleDeleteGallery = (imageId: string) => deleteGalleryImage(propertyId, imageId, { setGalleryImages, setPreview });
  const handleSetMainGallery = (imageUrl: string) => setMainGalleryImage(propertyId, imageUrl, setPreview);
  return { galleryImages, handleDeleteGallery, handleSetMainGallery, setGalleryImages, setUploadingGallery, uploadingGallery };
};

export const handlePropertyCrop = async (blob: Blob, options: CropOptions) => {
  if (options.image.cropMode === "main") completeMainCrop(blob, options.image);
  if (options.image.cropMode === "gallery" && options.id) await uploadGalleryCrop(blob, options);
  closeCropper(options.image);
};

const buildImageState = (state: ImageStateParts) => ({
  ...state,
  closeCropper: () => closeCropper(state),
  handleFileChange: (event: ChangeEvent<HTMLInputElement>) => openCropper(event, "main", state),
  handleGalleryFileChange: (event: ChangeEvent<HTMLInputElement>) => openCropper(event, "gallery", state),
});

const completeMainCrop = (blob: Blob, image: ImageState) => {
  const croppedFile = createJpegFile(blob, "property.jpg");
  image.setFile(croppedFile);
  image.setPreview(URL.createObjectURL(croppedFile));
};

const uploadGalleryCrop = async (blob: Blob, options: CropOptions) => {
  options.gallery.setUploadingGallery(true);
  try {
    const newImage = await tenantService.addPropertyImage(options.id!, createJpegFile(blob, "gallery.jpg"));
    options.gallery.setGalleryImages((items) => [...items, newImage]);
    toast.success("Gambar berhasil ditambahkan ke galeri");
  } catch {
    toast.error("Gagal menambahkan gambar");
  } finally {
    options.gallery.setUploadingGallery(false);
  }
};

const deleteGalleryImage = async (propertyId: string | undefined, imageId: string, actions: GalleryDeleteActions) => {
  if (!propertyId) return;
  try {
    await tenantService.deletePropertyImage(propertyId, imageId);
    await refreshGallery(propertyId, actions);
    toast.success("Gambar galeri berhasil dihapus");
  } catch (err) {
    toast.error(getApiErrorMessage(err, "Gagal menghapus gambar"));
  }
};

const refreshGallery = async (propertyId: string, actions: GalleryDeleteActions) => {
  const updated = await tenantService.getProperty(propertyId);
  actions.setGalleryImages(updated.images || []);
  actions.setPreview(updated.featured_image_url || null);
};

const setMainGalleryImage = async (propertyId: string | undefined, imageUrl: string, setPreview: SetPreview) => {
  if (!propertyId) return;
  try {
    await tenantService.updateProperty(propertyId, buildFeaturedImageData(imageUrl));
    setPreview(imageUrl);
    toast.success("Gambar utama berhasil diubah");
  } catch {
    toast.error("Gagal mengubah gambar utama");
  }
};

const openCropper = (event: ChangeEvent<HTMLInputElement>, mode: Exclude<CropMode, null>, state: ImageStateParts) => {
  const selected = event.target.files?.[0];
  if (!selected) return;
  state.setCropMode(mode);
  state.setCropperSrc(URL.createObjectURL(selected));
};

const closeCropper = (state: ImageStateParts) => {
  state.setCropperSrc(null);
  state.setCropMode(null);
};

const buildFeaturedImageData = (imageUrl: string) => {
  const formData = new FormData();
  formData.append("featured_image_url", imageUrl);
  return formData;
};

const createJpegFile = (blob: Blob, name: string) =>
  new File([blob], name, { type: "image/jpeg" });

type SetPreview = (value: string | null) => void;
type SetGalleryImages = Dispatch<SetStateAction<PropertyImage[]>>;
export type ImageState = ReturnType<typeof useImageState>;
export type GalleryState = ReturnType<typeof useGalleryState>;

interface ImageStateParts {
  cropMode: CropMode;
  cropperSrc: string | null;
  file: File | null;
  preview: string | null;
  setCropMode: (value: CropMode) => void;
  setCropperSrc: (value: string | null) => void;
  setFile: (value: File | null) => void;
  setPreview: SetPreview;
}

interface CropOptions {
  gallery: GalleryState;
  id?: string;
  image: ImageState;
}

interface GalleryDeleteActions {
  setGalleryImages: SetGalleryImages;
  setPreview: SetPreview;
}

