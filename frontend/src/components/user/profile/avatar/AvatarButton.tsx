import type { FC } from "react";
import type { RefObject } from "react";
import { Camera, Loader2 } from "lucide-react";

export const AvatarButton: FC<{ fileRef: RefObject<HTMLInputElement | null>; uploading: boolean }> = ({ fileRef, uploading }) => (
  <button onClick={() => fileRef.current?.click()} disabled={uploading} className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white transition hover:bg-red-700 disabled:opacity-50" aria-label="Ubah foto profil">
    {uploading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
  </button>
);
