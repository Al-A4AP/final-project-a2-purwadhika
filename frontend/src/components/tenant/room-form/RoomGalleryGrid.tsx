import type { ChangeEvent, FC } from "react";
import { Plus, Star, Trash2 } from "lucide-react";
import type { RoomImage } from "@/types";

interface RoomGalleryGridProps {
  canDelete: boolean;
  images: RoomImage[];
  uploadingGallery: boolean;
  onDelete: (imageId: string) => void;
  onSetMain: (imageId: string) => void;
  onGalleryFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const RoomGalleryGrid: FC<RoomGalleryGridProps> = (props) => (
  <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
    <GallerySectionLabel />
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {props.images.map((image, index) => (
        <GalleryImageCard key={image.id} image={image} isMain={index === 0} {...props} />
      ))}
      <GalleryAddTile
        uploadingGallery={props.uploadingGallery}
        onGalleryFileChange={props.onGalleryFileChange}
      />
    </div>
  </div>
);

const GallerySectionLabel = () => (
  <label className="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-300">Foto Tambahan</label>
);

interface GalleryImageCardProps extends Pick<RoomGalleryGridProps, "canDelete" | "onDelete" | "onSetMain"> {
  image: RoomImage;
  isMain: boolean;
}

const GalleryImageCard: FC<GalleryImageCardProps> = ({ image, isMain, ...actions }) => (
  <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
    <img src={image.image_url} className="h-24 w-full object-cover" alt="Galeri kamar" />
    {isMain && <MainImageBadge />}
    <GalleryImageActions imageId={image.id} isMain={isMain} {...actions} />
  </div>
);

const MainImageBadge: FC = () => (
  <div className="absolute left-1 top-1 rounded-full bg-slate-900 px-2 py-0.5 text-[8px] font-bold text-white shadow-sm dark:bg-white dark:text-slate-900">
    Utama
  </div>
);

interface GalleryImageActionsProps extends Pick<RoomGalleryGridProps, "canDelete" | "onDelete" | "onSetMain"> {
  imageId: string;
  isMain: boolean;
}

const GalleryImageActions: FC<GalleryImageActionsProps> = ({
  imageId,
  isMain,
  canDelete,
  onDelete,
  onSetMain,
}) => (
  <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-slate-900/40 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100">
    {!isMain && <GalleryIconButton icon="main" onClick={() => onSetMain(imageId)} />}
    <GalleryIconButton disabled={!canDelete} icon="delete" onClick={() => onDelete(imageId)} />
  </div>
);

interface GalleryIconButtonProps {
  disabled?: boolean;
  icon: "delete" | "main";
  onClick: () => void;
}

const GalleryIconButton: FC<GalleryIconButtonProps> = ({ disabled, icon, onClick }) => {
  const Icon = icon === "main" ? Star : Trash2;
  const title = icon === "main" ? "Jadikan Utama" : "Hapus";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-lg bg-white p-1.5 text-slate-700 shadow-sm transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-red-900/20 dark:hover:text-red-400"
      title={title}
      aria-label={title}
    >
      <Icon size={14} />
    </button>
  );
};

interface GalleryAddTileProps {
  uploadingGallery: boolean;
  onGalleryFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const GalleryAddTile: FC<GalleryAddTileProps> = ({ uploadingGallery, onGalleryFileChange }) => (
  <label className="flex h-24 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-slate-400 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-500 dark:hover:bg-slate-800">
    {uploadingGallery ? <UploadText /> : <AddTileContent />}
    <input
      type="file"
      accept="image/*"
      onChange={onGalleryFileChange}
      className="hidden"
      disabled={uploadingGallery}
    />
  </label>
);

const UploadText: FC = () => (
  <span className="animate-pulse text-[10px] font-semibold text-slate-500">Mengunggah...</span>
);

const AddTileContent: FC = () => (
  <>
    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm dark:bg-slate-800 dark:text-slate-500">
      <Plus size={14} />
    </div>
    <span className="text-[10px] font-semibold text-slate-500">Tambah Foto</span>
  </>
);
