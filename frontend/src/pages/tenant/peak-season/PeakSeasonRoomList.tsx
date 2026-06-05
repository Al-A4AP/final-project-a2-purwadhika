import type { FC, ReactNode } from "react";
import { EmptyState } from "@/components/common/EmptyState";
import { SectionLoading } from "@/components/common/SectionLoading";
import type { TenantProperty } from "@/types";
import { PeakSeasonRoomRow } from "./PeakSeasonRoomRow";
import type { PeakSeasonPageState } from "./peakSeasonTypes";

export const PeakSeasonRoomList: FC<PeakSeasonRoomListProps> = ({ property, state }) => {
  if (state.roomActions.isLoadingRooms(property.id)) return <RoomListShell><SectionLoading label="Memuat kamar..." variant="table" /></RoomListShell>;
  if (state.roomActions.errorByProperty[property.id]) return <RoomListShell><p className="text-sm text-red-600">{state.roomActions.errorByProperty[property.id]}</p></RoomListShell>;
  const rooms = state.roomActions.getRooms(property.id);
  if (!rooms.length) return <RoomListShell><EmptyState title="Belum ada kamar" description="Tambahkan kamar terlebih dahulu sebelum mengatur harga musiman." /></RoomListShell>;
  return <RoomListShell>{rooms.map((room) => <PeakSeasonRoomRow key={room.id} propertyId={property.id} room={room} state={state} />)}</RoomListShell>;
};

const RoomListShell: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="border-t border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/30">
    <div className="space-y-3">{children}</div>
  </div>
);

interface PeakSeasonRoomListProps {
  property: TenantProperty;
  state: PeakSeasonPageState;
}
