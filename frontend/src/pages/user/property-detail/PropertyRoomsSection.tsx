import type { FC } from "react";
import type { PropertyDetail, Room } from "@/types";
import { BookingAccessNotice } from "@/components/property/BookingAccessNotice";
import { RoomCard } from "@/components/property/RoomCard";
import { WholeUnitCard } from "@/components/property/WholeUnitCard";
import { NoRoomsNotice } from "./NoRoomsNotice";

interface PropertyRoomsSectionProps {
  bookingBlockedReason?: string;
  checkIn: string;
  checkOut: string;
  isTenant: boolean;
  onBooking: (room: Room) => void;
  onCheckAvail: (room: Room) => void;
  property: PropertyDetail;
}

const isWholeUnitCategory = (name?: string) => ["Villa", "Rumah"].includes(name || "");
const hasNoRooms = (property: PropertyDetail, checkIn: string, checkOut: string) =>
  Boolean(checkIn && checkOut && (!property.rooms || property.rooms.length === 0));

const RoomList: FC<PropertyRoomsSectionProps> = (props) => (
  <>
    <BookingAccessNotice message={!props.isTenant ? props.bookingBlockedReason : undefined} />
    <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Pilihan Kamar</h2>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {props.property.rooms?.map((room) => <RoomCard key={room.id} room={room} amenities={props.property.amenities} isTenant={props.isTenant} bookingBlockedReason={props.bookingBlockedReason} onBooking={props.onBooking} onCheckAvail={props.onCheckAvail} />)}
    </div>
  </>
);

const WholeUnit: FC<PropertyRoomsSectionProps & { room: Room }> = (props) => (
  <>
    <BookingAccessNotice message={!props.isTenant ? props.bookingBlockedReason : undefined} />
    <WholeUnitCard room={props.room} amenities={props.property.amenities} isTenant={props.isTenant} bookingBlockedReason={props.bookingBlockedReason} onBooking={props.onBooking} onCheckAvail={props.onCheckAvail} categoryName={props.property.category?.name || ""} />
  </>
);

export const PropertyRoomsSection: FC<PropertyRoomsSectionProps> = (props) => {
  const firstRoom = props.property.rooms?.[0];
  if (hasNoRooms(props.property, props.checkIn, props.checkOut)) return <NoRoomsNotice />;
  if (isWholeUnitCategory(props.property.category?.name) && firstRoom) return <WholeUnit {...props} room={firstRoom} />;
  return <RoomList {...props} />;
};
