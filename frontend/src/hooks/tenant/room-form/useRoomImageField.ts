import type { ChangeEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { tenantService } from "@/services/tenantService";
import type { RoomFormInput, RoomWithPeakRates } from "@/types";

type CropMode = "main" | "gallery" | null;

interface UseRoomImageFieldParams {
  form: RoomFormInput;
  isEditing: boolean;
  editingRoom?: RoomWithPeakRates | null;
  onChange: (form: RoomFormInput) => void;
  fetchRooms: () => void;
  setEditingRoom: (room: RoomWithPeakRates | null) => void;
}

const makeJpegFile = (blob: Blob, name: string) =>
  new File([blob], name, { type: "image/jpeg" });

export const useRoomImageField = (params: UseRoomImageFieldParams) => {
  const [cropperSrc, setCropperSrc] = useState<string | null>(null);
  const [cropMode, setCropMode] = useState<CropMode>(null);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const filePreview = useImagePreview(params.form.image);
  const roomImages = params.editingRoom?.images || [];
  const previewUrl = filePreview || params.editingRoom?.images?.[0]?.image_url || null;

  const refreshRoomState = async () => {
    if (!params.editingRoom) return;
    const freshRooms = await tenantService.getRooms(params.editingRoom.propertyId);
    const freshRoom = freshRooms.find((room) => room.id === params.editingRoom?.id);
    if (freshRoom) params.setEditingRoom(freshRoom);
    params.fetchRooms();
  };

  const openCropper = (mode: Exclude<CropMode, null>) => (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setCropMode(mode);
    setCropperSrc(URL.createObjectURL(file));
  };

  const uploadCroppedRoomImage = async (fileName: string, blob: Blob, message: string) => {
    if (!params.editingRoom) return;
    setUploadingGallery(true);
    try {
      await tenantService.addRoomImage(params.editingRoom.id, makeJpegFile(blob, fileName));
      await refreshRoomState();
      toast.success(message);
    } catch {
      toast.error("Gagal menambahkan foto");
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleMainCrop = async (blob: Blob) => {
    if (!params.isEditing || !params.editingRoom) {
      params.onChange({ ...params.form, image: makeJpegFile(blob, "room.jpg") });
      return;
    }
    await uploadCroppedRoomImage("room.jpg", blob, "Foto utama berhasil ditambahkan");
  };

  const handleGalleryCrop = async (blob: Blob) => {
    await uploadCroppedRoomImage(
      "room_gallery.jpg",
      blob,
      "Gambar berhasil ditambahkan ke galeri",
    );
  };

  const closeCropper = () => {
    setCropperSrc(null);
    setCropMode(null);
  };

  const handleCropComplete = async (blob: Blob) => {
    if (cropMode === "main") await handleMainCrop(blob);
    if (cropMode === "gallery") await handleGalleryCrop(blob);
    closeCropper();
  };

  const deleteGalleryImage = async (imageId: string) => {
    if (!params.editingRoom) return;
    try {
      await tenantService.deleteRoomImage(params.editingRoom.id, imageId);
      await refreshRoomState();
      toast.success("Gambar berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus gambar");
    }
  };

  const setMainGalleryImage = async (imageId: string) => {
    if (!params.editingRoom) return;
    try {
      await tenantService.setRoomMainImage(params.editingRoom.id, imageId);
      await refreshRoomState();
      toast.success("Gambar utama berhasil diubah");
    } catch {
      toast.error("Gagal mengubah gambar utama");
    }
  };

  return {
    canDelete: roomImages.length > 1,
    closeCropper,
    cropperSrc,
    deleteGalleryImage,
    handleCropComplete,
    openGalleryCropper: openCropper("gallery"),
    openMainCropper: openCropper("main"),
    previewUrl,
    roomImages,
    setMainGalleryImage,
    uploadingGallery,
  };
};

const useImagePreview = (file?: File | null) => {
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);
  return preview;
};
