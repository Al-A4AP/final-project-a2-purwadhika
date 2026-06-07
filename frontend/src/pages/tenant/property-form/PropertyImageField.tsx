import type { FC } from "react";
import { Upload, Trash2, Star, Plus, Image as ImageIcon } from "lucide-react";
import type { PropertyFormState } from "@/hooks/tenant/property-form/propertyFormTypes";
import { ImageCropperModal } from "@/components/common/ImageCropperModal";

export const PropertyImageField: FC<{ state: PropertyFormState }> = ({ state }) => {
  const distinctUrls = new Set<string>();
  if (state.preview) distinctUrls.add(state.preview);
  state.galleryImages.forEach(img => distinctUrls.add(img.image_url));
  const canDelete = distinctUrls.size > 1;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
          <ImageIcon size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Galeri Foto</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Foto properti berkualitas meningkatkan daya tarik.</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Foto Utama <span className="text-red-500">*</span>
          </label>
          <label className="relative flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 transition hover:border-slate-400 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-500 dark:hover:bg-slate-800">
            {state.preview ? (
              <img src={state.preview} className="h-64 w-full rounded-xl object-cover" alt="Foto Utama" />
            ) : (
              <UploadPrompt />
            )}
            <input type="file" accept="image/*" onChange={state.handleFileChange} className="hidden" />
          </label>
        </div>

        {state.isEdit && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <label className="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Galeri Foto Tambahan
            </label>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {state.galleryImages.map((img) => {
                const isMain = state.preview === img.image_url;
                return (
                  <div key={img.id} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                    <img src={img.image_url} className="h-32 w-full object-cover" alt="Galeri" />
                    
                    {isMain && (
                      <div className="absolute left-2 top-2 rounded-full bg-slate-900 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm dark:bg-white dark:text-slate-900">
                        Utama
                      </div>
                    )}

                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-slate-900/40 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100">
                      {!isMain && (
                        <button
                          type="button"
                          onClick={() => state.handleSetMainGallery(img.image_url)}
                          className="rounded-lg bg-white p-2 text-slate-700 shadow-sm transition hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
                          title="Jadikan Utama"
                        >
                          <Star size={16} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => state.handleDeleteGallery(img.id)}
                        disabled={!canDelete}
                        className="rounded-lg bg-white p-2 text-slate-700 shadow-sm transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}

              <label className="flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-slate-400 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-500 dark:hover:bg-slate-800">
                {state.uploadingGallery ? (
                  <span className="animate-pulse text-xs font-semibold text-slate-500">Mengunggah...</span>
                ) : (
                  <>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm dark:bg-slate-800 dark:text-slate-500">
                      <Plus size={16} />
                    </div>
                    <span className="text-xs font-semibold text-slate-500">Tambah Foto</span>
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
    </div>
  );
};

const UploadPrompt: FC = () => (
  <div className="flex flex-col items-center text-center">
    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm dark:bg-slate-800 dark:text-slate-500">
      <Upload size={20} />
    </div>
    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Klik untuk memilih foto utama</span>
    <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">Format JPG atau PNG (Maks. 2MB)</span>
  </div>
);
