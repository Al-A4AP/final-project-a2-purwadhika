import type { FC } from "react";

interface PeakRateSubmitButtonProps {
  isEditing: boolean;
  isSaving: boolean;
  onCancelEdit: () => void;
}

export const PeakRateSubmitButton: FC<PeakRateSubmitButtonProps> = ({ isEditing, isSaving, onCancelEdit }) => (
  <div className="flex gap-2">
    {isEditing && <button type="button" disabled={isSaving} onClick={onCancelEdit} className="flex-1 rounded-lg border py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-700 disabled:opacity-50">Batal Edit</button>}
    <button type="submit" disabled={isSaving} className="flex-1 rounded-lg bg-orange-600 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed">
      {isSaving ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Simpan Aturan Peak Season"}
    </button>
  </div>
);
