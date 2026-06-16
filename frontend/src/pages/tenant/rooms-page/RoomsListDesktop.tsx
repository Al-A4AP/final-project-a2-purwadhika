import type { FC } from "react";
import type { RoomItemProps, RoomOnlyProps, RoomsListViewProps } from "./roomsListTypes";
import {
  AvailabilityButton,
  DeleteRoomButton,
  DesktopRoomPriceCapacity,
  DesktopRoomStock,
  EditRoomButton,
  RoomImage,
  RoomTitle,
} from "./RoomsListParts";

export const RoomsListDesktop: FC<RoomsListViewProps> = ({ rooms, ...actions }) => (
  <div className="hidden md:block overflow-x-auto">
    <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
      <RoomsTableHead />
      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
        {rooms.map((room) => <DesktopRoomRow key={room.id} room={room} {...actions} />)}
      </tbody>
    </table>
  </div>
);

const RoomsTableHead: FC = () => (
  <thead className="border-b border-slate-100 bg-slate-50/50 text-xs uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
    <tr>
      <th scope="col" className="px-6 py-4 font-semibold">Tipe Kamar</th>
      <th scope="col" className="px-6 py-4 font-semibold">Harga & Kapasitas</th>
      <th scope="col" className="px-6 py-4 font-semibold text-right">Pengaturan</th>
    </tr>
  </thead>
);

const DesktopRoomRow: FC<RoomItemProps> = (props) => (
  <tr className="transition hover:bg-slate-50 dark:hover:bg-slate-800/50">
    <td className="px-6 py-4"><DesktopRoomIdentity {...props} /></td>
    <td className="px-6 py-4"><DesktopRoomPriceCapacity {...props} /></td>
    <td className="px-6 py-4 text-right"><DesktopRoomActions {...props} /></td>
  </tr>
);

const DesktopRoomIdentity: FC<RoomOnlyProps> = ({ room, isWholeUnit }) => (
  <div className="flex items-center gap-4">
    <RoomImage className="h-16 w-16 rounded-xl" isWholeUnit={isWholeUnit} room={room} />
    <div>
      <div className="flex items-center gap-2 mb-1">
        <RoomTitle className="font-bold text-slate-900 dark:text-white text-base" isWholeUnit={isWholeUnit} room={room} />
      </div>
      <DesktopRoomStock isWholeUnit={isWholeUnit} room={room} />
    </div>
  </div>
);

const DesktopRoomActions: FC<RoomItemProps> = (props) => (
  <>
    <div className="flex items-center justify-end gap-2 mb-2">
      <EditRoomButton desktop {...props} />
      <DeleteRoomButton desktop {...props} />
    </div>
    <div className="flex items-center justify-end">
      <AvailabilityButton {...props} />
    </div>
  </>
);
