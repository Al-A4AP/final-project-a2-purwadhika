import type { FC } from "react";

interface PeakRateSubmitButtonProps {
  isEditing: boolean;
  onCancelEdit: () => void;
}

export const PeakRateSubmitButton: FC<PeakRateSubmitButtonProps> = ({ isEditing, onCancelEdit }) => (
  <div className="flex gap-2">
    {isEditing && <button type="button" onClick={onCancelEdit} className="flex-1 rounded-lg border py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-700">Batal Edit</button>}
    <button type="submit" className="flex-1 rounded-lg bg-orange-600 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-orange-700">
      {isEditing ? "Simpan Perubahan" : "Simpan Aturan Peak Season"}
    </button>
  </div>
);
