import type { FC } from "react";
import { HelpText } from "@/components/common/HelpText";

interface RoomFormHeaderProps {
  isEditing: boolean;
  isWholeUnit: boolean;
}

const getHelpText = (isWholeUnit: boolean) =>
  isWholeUnit ? "Rumah dan villa disewakan sebagai satu unit penuh; stok otomatis dihitung satu." : "Jumlah unit menentukan stok kamar per tanggal; gunakan kalender ketersediaan untuk menutup tanggal tertentu.";

export const RoomFormHeader: FC<RoomFormHeaderProps> = ({ isEditing, isWholeUnit }) => (
  <>
    <h3 className="font-semibold text-gray-900 dark:text-white">{isEditing ? "Edit Kamar" : "Kamar Baru"}</h3>
    <HelpText>{getHelpText(isWholeUnit)}</HelpText>
  </>
);
