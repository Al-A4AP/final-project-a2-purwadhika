import type { FC } from "react";
import { ArrowLeft } from "lucide-react";

export const PropertyBackButton: FC<{ onBack: () => void }> = ({ onBack }) => (
  <button onClick={onBack} className="mb-6 flex items-center gap-2 text-gray-600 hover:text-red-600 dark:text-gray-400">
    <ArrowLeft size={20} /> Kembali
  </button>
);
