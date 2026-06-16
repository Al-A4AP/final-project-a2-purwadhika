import type { FC } from "react";
import type { RoomItemProps, RoomOnlyProps, RoomsListViewProps } from "./roomsListTypes";
import {
  AvailabilityButton,
  DeleteRoomButton,
  EditRoomButton,
  MobileRoomPriceCapacity,
  MobileRoomQuantity,
  RoomImage,
  RoomTitle,
} from "./RoomsListParts";

export const RoomsListMobile: FC<RoomsListViewProps> = ({ rooms, ...actions }) => (
  <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
    {rooms.map((room) => <MobileRoomCard key={room.id} room={room} {...actions} />)}
  </div>
);

const MobileRoomCard: FC<RoomItemProps> = (props) => (
  <div className="p-4 transition hover:bg-slate-50 dark:hover:bg-slate-800/50">
    <div className="flex gap-4">
      <RoomImage className="h-24 w-24 rounded-xl" isWholeUnit={props.isWholeUnit} room={props.room} />
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <MobileRoomMeta isWholeUnit={props.isWholeUnit} room={props.room} />
        <MobileRoomActions {...props} />
      </div>
    </div>
    <div className="mt-4"><AvailabilityButton mobile {...props} /></div>
  </div>
);

const MobileRoomMeta: FC<RoomOnlyProps> = ({ room, isWholeUnit }) => (
  <div>
    <h3 className="truncate font-bold text-slate-900 dark:text-white">
      <RoomTitle className="" isWholeUnit={isWholeUnit} room={room} />
    </h3>
    <MobileRoomPriceCapacity isWholeUnit={isWholeUnit} room={room} />
  </div>
);

const MobileRoomActions: FC<RoomItemProps> = (props) => (
  <div className="mt-3 flex items-center justify-between">
    <MobileRoomQuantity isWholeUnit={props.isWholeUnit} room={props.room} />
    <div className="flex items-center gap-1">
      <EditRoomButton {...props} />
      <DeleteRoomButton {...props} />
    </div>
  </div>
);
