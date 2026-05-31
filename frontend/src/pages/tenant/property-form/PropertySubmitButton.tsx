import type { FC } from "react";
import { Loader2 } from "lucide-react";

export const PropertySubmitButton: FC<{ isSubmitting: boolean }> = ({ isSubmitting }) => (
  <button type="submit" disabled={isSubmitting} className="w-full bg-red-600 text-white py-2.5 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2 disabled:opacity-60">
    {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Menyimpan...</> : "Simpan Properti"}
  </button>
);
