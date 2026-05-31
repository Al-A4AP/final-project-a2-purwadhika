import type { FC } from "react";
import { Plus } from "lucide-react";

export const RoomsAddButton: FC<{ isVisible: boolean; onClick: () => void; showForm: boolean }> = ({ isVisible, onClick, showForm }) => {
  if (!isVisible) return null;
  return (
    <button onClick={onClick} className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700">
      <Plus size={16} /> {showForm ? "Batal" : "Tambah Kamar"}
    </button>
  );
};
