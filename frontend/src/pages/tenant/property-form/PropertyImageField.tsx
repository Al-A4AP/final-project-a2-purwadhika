import type { FC } from "react";
import { Upload, Trash2, Star, Plus } from "lucide-react";
import { FieldLabel } from "./FormFields";
import type { PropertyFormState } from "./propertyFormTypes";
import { ImageCropperModal } from "@/components/common/ImageCropperModal";

export const PropertyImageField: FC<{ state: PropertyFormState }> = ({ state }) => {
  const distinctUrls = new Set<string>();
  if (state.preview) distinctUrls.add(state.preview);
  state.galleryImages.forEach(img => distinctUrls.add(img.image_url));
  const canDelete = distinctUrls.size > 1;

  return (
    <div className="space-y-6">
      <div>
        <FieldLabel label="Foto Utama Properti" />
        <label className="relative border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-rose-400 transition bg-white dark:bg-slate-800">
          {state.preview ? (
            <img src={state.preview} className="w-full h-48 object-cover rounded-xl" alt="Foto Utama" />
          ) : (
            <UploadPrompt />
          )}
          <input type="file" accept="image/*" onChange={state.handleFileChange} className="hidden" />
        </label>
      </div>

      {state.isEdit && (
        <div className="space-y-3">
          <FieldLabel label="Galeri Foto Tambahan" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {state.galleryImages.map((img) => {
              const isMain = state.preview === img.image_url;
              return (
                <div key={img.id} className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                  <img src={img.image_url} className="w-full h-28 object-cover" alt="Galeri" />
                  
                  {isMain && (
                    <div className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                      Utama
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                    {!isMain && (
                      <button
                        type="button"
                        onClick={() => state.handleSetMainGallery(img.image_url)}
                        className="p-1.5 bg-white hover:bg-slate-100 text-rose-600 rounded-lg shadow transition-colors"
                        title="Jadikan Utama"
                      >
                        <Star size={16} fill="currentColor" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => state.handleDeleteGallery(img.id)}
                      disabled={!canDelete}
                      className="p-1.5 bg-white hover:bg-slate-100 text-slate-600 hover:text-red-600 rounded-lg shadow disabled:opacity-50 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}

            <label className="border-2 border-dashed border-gray-300 dark:border-slate-600 hover:border-rose-400 rounded-xl h-28 flex flex-col items-center justify-center gap-1 cursor-pointer transition bg-white dark:bg-slate-800">
              {state.uploadingGallery ? (
                <span className="text-xs text-gray-500 font-medium animate-pulse">Mengunggah...</span>
              ) : (
                <>
                  <Plus size={20} className="text-gray-400" />
                  <span className="text-xs text-gray-500 font-medium">Tambah Foto</span>
                </>
              )}
              <input type="file" accept="image/*" onChange={state.handleGalleryFileChange} className="hidden" disabled={state.uploadingGallery} />
            </label>
          </div>
        </div>
      )}

      <ImageCropperModal
        isOpen={Boolean(state.cropperSrc)}
        onClose={state.closeCropper}
        imageSrc={state.cropperSrc}
        aspect={16 / 9}
        onCropComplete={state.handleCropComplete}
      />
    </div>
  );
};

const UploadPrompt: FC = () => (
  <>
    <Upload size={24} className="text-gray-400" />
    <span className="text-sm text-gray-500 font-medium">Klik untuk pilih foto utama properti</span>
    <span className="text-xs text-gray-400">(Format: JPG, PNG, maks. 1MB)</span>
  </>
);
