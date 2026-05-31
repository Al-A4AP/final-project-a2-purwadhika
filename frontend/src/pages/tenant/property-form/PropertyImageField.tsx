import type { FC } from "react";
import { Upload } from "lucide-react";
import { FieldLabel } from "./FormFields";
import type { PropertyFormState } from "./propertyFormTypes";

export const PropertyImageField: FC<{ state: PropertyFormState }> = ({ state }) => (
  <div><FieldLabel label="Foto Utama" /><label className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-red-400 transition">{state.preview ? <img src={state.preview} className="w-full h-40 object-cover rounded-lg" alt="preview" /> : <UploadPrompt />}<input type="file" accept="image/*" onChange={state.handleFileChange} className="hidden" /></label></div>
);

const UploadPrompt: FC = () => (
  <><Upload size={24} className="text-gray-400" /><span className="text-sm text-gray-500">Klik untuk upload foto (maks. 1MB)</span></>
);
