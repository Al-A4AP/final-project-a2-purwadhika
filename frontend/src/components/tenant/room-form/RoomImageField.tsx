import type { FC } from "react";
import { useState } from "react";
import type { RoomFormInput, RoomWithPeakRates } from "@/types";
import { RoomFieldShell } from "./RoomFieldShell";
import { Upload, Trash2, Star, Plus } from "lucide-react";
import { ImageCropperModal } from "@/components/common/ImageCropperModal";
import { tenantService } from "@/services/tenantService";
import { toast } from "react-hot-toast";

interface RoomImageFieldProps {
  form: RoomFormInput;
  inputClass: string;
  isEditing: boolean;
  editingRoom?: RoomWithPeakRates | null;
  onChange: (form: RoomFormInput) => void;
  fetchRooms: () => void;
  setEditingRoom: (room: RoomWithPeakRates | null) => void;
}

export const RoomImageField: FC<RoomImageFieldProps> = ({
  form,
  isEditing,
  editingRoom,
  onChange,
  fetchRooms,
  setEditingRoom,
}) => {
  const [cropperSrc, setCropperSrc] = useState<string | null>(null);
  const [cropMode, setCropMode] = useState<"main" | "gallery" | null>(null);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const filePreview = form.image ? URL.createObjectURL(form.image) : null;
  const existingImageUrl = editingRoom?.images?.[0]?.image_url || null;
  const previewUrl = filePreview || existingImageUrl;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setCropMode("main");
    setCropperSrc(URL.createObjectURL(file));
  };

  const handleGalleryFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setCropMode("gallery");
    setCropperSrc(URL.createObjectURL(file));
  };

  const handleCropComplete = async (blob: Blob) => {
    if (cropMode === "main") {
      const croppedFile = new File([blob], "room.jpg", { type: "image/jpeg" });
      if (isEditing && editingRoom) {
        setUploadingGallery(true);
        try {
          await tenantService.addRoomImage(editingRoom.id, croppedFile);
          await refreshRoomState();
          toast.success("Foto utama berhasil ditambahkan");
        } catch {
          toast.error("Gagal menambahkan foto");
        } finally {
          setUploadingGallery(false);
        }
      } else {
        onChange({ ...form, image: croppedFile });
      }
    } else if (cropMode === "gallery" && editingRoom) {
      setUploadingGallery(true);
      try {
        const croppedFile = new File([blob], "room_gallery.jpg", { type: "image/jpeg" });
        await tenantService.addRoomImage(editingRoom.id, croppedFile);
        await refreshRoomState();
        toast.success("Gambar berhasil ditambahkan ke galeri");
      } catch {
        toast.error("Gagal menambahkan gambar");
      } finally {
        setUploadingGallery(false);
      }
    }
    setCropperSrc(null);
    setCropMode(null);
  };

  const refreshRoomState = async () => {
    if (!editingRoom) return;
    const freshRooms = await tenantService.getRooms(editingRoom.propertyId);
    const freshRoom = freshRooms.find((r) => r.id === editingRoom.id);
    if (freshRoom) {
      setEditingRoom(freshRoom);
    }
    fetchRooms();
  };

  const handleDeleteGallery = async (imageId: string) => {
    if (!editingRoom) return;
    try {
      await tenantService.deleteRoomImage(editingRoom.id, imageId);
      await refreshRoomState();
      toast.success("Gambar berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus gambar");
    }
  };

  const handleSetMainGallery = async (imageId: string) => {
    if (!editingRoom) return;
    try {
      await tenantService.setRoomMainImage(editingRoom.id, imageId);
      await refreshRoomState();
      toast.success("Gambar utama berhasil diubah");
    } catch {
      toast.error("Gagal mengubah gambar utama");
    }
  };

  const roomImages = editingRoom?.images || [];
  const canDelete = roomImages.length > 1;

  return (
    <RoomFieldShell label="Galeri Foto Kamar" className="space-y-4">
      <div>
        <label className="relative flex h-48 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-slate-400 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-500 dark:hover:bg-slate-800 p-2">
          {previewUrl ? (
            <img src={previewUrl} className="h-full w-full rounded-lg object-cover" alt="preview" />
          ) : (
            <div className="flex flex-col items-center text-center px-4">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm dark:bg-slate-800 dark:text-slate-500">
                <Upload size={20} />
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Klik untuk upload foto utama kamar</span>
              <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">Format JPG atau PNG</span>
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
        {isEditing && (
          <p className="mt-1.5 text-[10px] text-slate-500 dark:text-slate-400">
            Pilih file baru untuk mengganti foto utama kamar.
          </p>
        )}
      </div>

      {isEditing && editingRoom && roomImages.length > 0 && (
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <label className="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Foto Tambahan
          </label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {roomImages.map((img, index) => {
              const isMain = index === 0;
              return (
                <div key={img.id} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                  <img src={img.image_url} className="h-24 w-full object-cover" alt="Galeri kamar" />
                  
                  {isMain && (
                    <div className="absolute left-1 top-1 rounded-full bg-slate-900 px-2 py-0.5 text-[8px] font-bold text-white shadow-sm dark:bg-white dark:text-slate-900">
                      Utama
                    </div>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-slate-900/40 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100">
                    {!isMain && (
                      <button
                        type="button"
                        onClick={() => handleSetMainGallery(img.id)}
                        className="rounded-lg bg-white p-1.5 text-slate-700 shadow-sm transition hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
                        title="Jadikan Utama"
                      >
                        <Star size={14} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteGallery(img.id)}
                      disabled={!canDelete}
                      className="rounded-lg bg-white p-1.5 text-slate-700 shadow-sm transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                      title="Hapus"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}

            <label className="flex h-24 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-slate-400 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-500 dark:hover:bg-slate-800">
              {uploadingGallery ? (
                <span className="animate-pulse text-[10px] font-semibold text-slate-500">Mengunggah...</span>
              ) : (
                <>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm dark:bg-slate-800 dark:text-slate-500">
                    <Plus size={14} />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500">Tambah Foto</span>
                </>
              )}
              <input type="file" accept="image/*" onChange={handleGalleryFileChange} className="hidden" disabled={uploadingGallery} />
            </label>
          </div>
        </div>
      )}

      <ImageCropperModal
        isOpen={Boolean(cropperSrc)}
        onClose={() => { setCropperSrc(null); setCropMode(null); }}
        imageSrc={cropperSrc}
        aspect={4 / 3}
        onCropComplete={handleCropComplete}
      />
    </RoomFieldShell>
  );
};
