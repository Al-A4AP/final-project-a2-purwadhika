import type { FC } from "react";
import { ArrowLeft } from "lucide-react";
import { HelpText } from "@/components/common/HelpText";

export const RoomsPageHeader: FC<{ onBack: () => void }> = ({ onBack }) => (
  <>
    <div className="flex items-center gap-4">
      <button onClick={onBack} className="text-gray-500 hover:text-gray-700" aria-label="Kembali ke properti">
        <ArrowLeft size={20} />
      </button>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manajemen Kamar</h1>
    </div>
    <HelpText>Kamar membutuhkan harga, kapasitas, dan minimal satu foto agar properti siap dipesan oleh user.</HelpText>
  </>
);
