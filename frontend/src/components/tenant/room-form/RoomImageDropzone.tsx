import type { ChangeEvent, FC } from "react";
import { Upload } from "lucide-react";

interface RoomImageDropzoneProps {
  isEditing: boolean;
  previewUrl: string | null;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const RoomImageDropzone: FC<RoomImageDropzoneProps> = ({
  isEditing,
  previewUrl,
  onFileChange,
}) => (
  <div>
    <label className="relative flex h-48 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-2 transition hover:border-slate-400 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-500 dark:hover:bg-slate-800">
      {previewUrl ? <RoomImagePreview previewUrl={previewUrl} /> : <RoomImagePlaceholder />}
      <input type="file" accept="image/*" onChange={onFileChange} className="hidden" />
    </label>
    {isEditing && <ImageReplacementHint />}
  </div>
);

const ImageReplacementHint = () => (
  <p className="mt-1.5 text-[10px] text-slate-500 dark:text-slate-400">Pilih file baru untuk mengganti foto utama kamar.</p>
);

const RoomImagePreview: FC<{ previewUrl: string }> = ({ previewUrl }) => (
  <img src={previewUrl} className="h-full w-full rounded-lg object-cover" alt="preview" />
);

const RoomImagePlaceholder: FC = () => (
  <div className="flex flex-col items-center px-4 text-center">
    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm dark:bg-slate-800 dark:text-slate-500">
      <Upload size={20} />
    </div>
    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
      Klik untuk upload foto utama kamar
    </span>
    <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">
      Format JPG atau PNG
    </span>
  </div>
);
