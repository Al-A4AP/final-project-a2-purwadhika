import type { FC } from "react";
import { HelpText } from "@/components/common/HelpText";

export const RoomFormHeader: FC<{ isEditing: boolean }> = ({ isEditing }) => (
  <>
    <h3 className="font-semibold text-gray-900 dark:text-white">{isEditing ? "Edit Kamar" : "Kamar Baru"}</h3>
    <HelpText>Jumlah unit menentukan stok kamar per tanggal; gunakan kalender ketersediaan untuk menutup tanggal tertentu.</HelpText>
  </>
);
