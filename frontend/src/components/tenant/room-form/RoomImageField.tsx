import type { FC } from "react";
import type { RoomFormInput } from "@/types";
import { RoomFieldShell } from "./RoomFieldShell";

export const RoomImageField: FC<{ form: RoomFormInput; inputClass: string; isEditing: boolean; onChange: (form: RoomFormInput) => void }> = ({ form, inputClass, isEditing, onChange }) => (
  <RoomFieldShell label="Foto Kamar" className="col-span-2">
    <input type="file" accept="image/*" onChange={(event) => onChange({ ...form, image: event.target.files?.[0] || null })} className={inputClass} required={!isEditing} />
    <p className="mt-0.5 text-xs text-gray-400">{isEditing ? "Kosongkan jika tidak ingin menambah foto baru" : "Minimal 1 foto kamar wajib diupload"}</p>
  </RoomFieldShell>
);
