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

  // Form image preview (for new creation)
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
    <RoomFieldShell label="Foto Kamar" className="col-span-2 space-y-4">
      {/* Upload/Preview Area */}
      <div>
        <label className="relative border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-4 flex flex-col items-center gap-1.5 cursor-pointer hover:border-rose-400 transition bg-white dark:bg-slate-800">
          {previewUrl ? (
            <img src={previewUrl} className="w-full h-36 object-cover rounded-xl" alt="preview" />
          ) : (
            <div className="py-4 text-center">
              <Upload size={20} className="mx-auto text-gray-400 mb-1" />
              <span className="text-xs text-gray-500 font-medium">Klik untuk upload foto utama kamar</span>
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
        {isEditing && (
          <p className="mt-1 text-[10px] text-gray-400 text-center">
            Pilih file baru untuk menambahkan atau ganti foto utama kamar
          </p>
        )}
      </div>

      {/* Gallery Manager (Only in Edit Mode) */}
      {isEditing && editingRoom && roomImages.length > 0 && (
        <div className="space-y-2 pt-2 border-t dark:border-slate-700">
          <span className="text-xs font-semibold text-gray-700 dark:text-slate-300">Galeri Foto Kamar</span>
          <div className="grid grid-cols-3 gap-2">
            {roomImages.map((img, index) => {
              const isMain = index === 0;
              return (
                <div key={img.id} className="relative group rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                  <img src={img.image_url} className="w-full h-20 object-cover" alt="Galeri kamar" />
                  
                  {isMain && (
                    <div className="absolute top-1 left-1 bg-rose-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-md">
                      Utama
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 transition-opacity">
                    {!isMain && (
                      <button
                        type="button"
                        onClick={() => handleSetMainGallery(img.id)}
                        className="p-1 bg-white hover:bg-slate-100 text-rose-600 rounded shadow transition-colors"
                        title="Jadikan Utama"
                      >
                        <Star size={12} fill="currentColor" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteGallery(img.id)}
                      disabled={!canDelete}
                      className="p-1 bg-white hover:bg-slate-100 text-slate-600 hover:text-red-600 rounded shadow disabled:opacity-50 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })}

            <label className="border-2 border-dashed border-gray-300 dark:border-slate-600 hover:border-rose-400 rounded-lg h-20 flex flex-col items-center justify-center cursor-pointer transition bg-white dark:bg-slate-800">
              {uploadingGallery ? (
                <span className="text-[10px] text-gray-500 font-medium animate-pulse">Unggah...</span>
              ) : (
                <>
                  <Plus size={16} className="text-gray-400" />
                  <span className="text-[10px] text-gray-500 font-medium mt-0.5">Tambah</span>
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
