import type { FC } from "react";

interface ReviewToggleButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const ReviewToggleButton: FC<ReviewToggleButtonProps> = ({ isOpen, onToggle }) => (
  <button onClick={onToggle} className="mt-2 text-sm text-blue-600 hover:underline">
    {isOpen ? "Tutup Ulasan" : "Beri Ulasan"}
  </button>
);
