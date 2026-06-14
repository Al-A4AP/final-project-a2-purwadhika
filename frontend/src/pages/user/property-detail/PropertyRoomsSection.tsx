import type { FC } from "react";
import { useState } from "react";
import type { PropertyDetail, Room } from "@/types";
import { BookingAccessNotice } from "@/components/property/BookingAccessNotice";
import { RoomCard } from "@/components/property/RoomCard";
import { WholeUnitCard } from "@/components/property/WholeUnitCard";
import { NoRoomsNotice } from "./NoRoomsNotice";
import { Pagination } from "@/components/common/Pagination";

interface PropertyRoomsSectionProps {
  bookingBlockedReason?: string;
  checkIn: string;
  checkOut: string;
  isTenant: boolean;
  selectedRoomId: string | null;
  onBooking: (room: Room) => void;
  onSelectRoom: (roomId: string) => void;
  property: PropertyDetail;
}

const isWholeUnit = (property: PropertyDetail) =>
  property.rental_type === "WHOLE_PROPERTY" ||
  ["Villa", "Rumah"].includes(property.category?.name || "");
const hasNoRooms = (
  property: PropertyDetail,
  checkIn: string,
  checkOut: string,
) =>
  Boolean(
    checkIn && checkOut && (!property.rooms || property.rooms.length === 0),
  );

const ROOMS_PER_PAGE = 6;

const RoomList: FC<PropertyRoomsSectionProps> = (props) => {
  const [currentPage, setCurrentPage] = useState(1);

  const rooms = props.property.rooms ?? [];
  const totalPages = Math.ceil(rooms.length / ROOMS_PER_PAGE);
  const paginatedRooms = rooms.slice(
    (currentPage - 1) * ROOMS_PER_PAGE,
    currentPage * ROOMS_PER_PAGE,
  );

  return (
    <>
      <BookingAccessNotice
        message={
          props.isTenant
            ? "Mode Pantau: Akun Tenant tidak dapat melakukan reservasi. Halaman ini hanya untuk pratinjau."
            : props.bookingBlockedReason
        }
      />
      <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        Pilihan Kamar
      </h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {paginatedRooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            amenities={props.property.amenities}
            isTenant={props.isTenant}
            isSelected={room.id === props.selectedRoomId}
            bookingBlockedReason={props.bookingBlockedReason}
            onBooking={props.onBooking}
            onSelectRoom={props.onSelectRoom}
          />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={rooms.length}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

const WholeUnit: FC<PropertyRoomsSectionProps & { room: Room }> = (props) => (
  <>
    <BookingAccessNotice
      message={
        props.isTenant
          ? "Mode Pantau: Akun Tenant tidak dapat melakukan reservasi. Halaman ini hanya untuk pratinjau."
          : props.bookingBlockedReason
      }
    />
    <WholeUnitCard
      room={props.room}
      amenities={props.property.amenities}
      isTenant={props.isTenant}
      isSelected={props.room.id === props.selectedRoomId}
      bookingBlockedReason={props.bookingBlockedReason}
      onBooking={props.onBooking}
      onSelectRoom={props.onSelectRoom}
      categoryName={props.property.category?.name || ""}
    />
  </>
);

export const PropertyRoomsSection: FC<PropertyRoomsSectionProps> = (props) => {
  const firstRoom = props.property.rooms?.[0];
  if (hasNoRooms(props.property, props.checkIn, props.checkOut))
    return <NoRoomsNotice />;
  if (isWholeUnit(props.property) && firstRoom)
    return <WholeUnit {...props} room={firstRoom} />;
  return <RoomList {...props} />;
};
