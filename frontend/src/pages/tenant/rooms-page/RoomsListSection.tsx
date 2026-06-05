import type { FC } from "react";
import { SectionLoading } from "@/components/common/SectionLoading";
import { EmptyState } from "@/components/common/EmptyState";
import { RoomsListView } from "./RoomsListView";
import type { RoomWithPeakRates } from "@/types";

interface RoomsListSectionProps {
  handleEdit: (room: RoomWithPeakRates) => void;
  handleOpenAvailModal: (id: string) => void;
  isWholeUnit: boolean;
  loading: boolean;
  onDelete: (id: string) => void;
  rooms: RoomWithPeakRates[];
}

export const RoomsListSection: FC<RoomsListSectionProps> = (props) => {
  if (props.loading) {
    return <SectionLoading variant="table" label="Memuat kamar..." />;
  }
  
  if (props.rooms.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <EmptyState 
          title="Tidak ada tipe kamar" 
          description="Tambahkan tipe kamar untuk mulai menerima pesanan dari tamu." 
        />
      </div>
    );
  }
  
  return (
    <RoomsListView {...props} />
  );
};
