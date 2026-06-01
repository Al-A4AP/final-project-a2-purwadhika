import type { Room } from "@/types";

export const getDefaultSelectedRoom = (rooms: Room[]) =>
  rooms.find((room) => room.is_available !== false) || rooms[0] || null;

export const getSelectedRoom = (rooms: Room[], selectedRoomId: string | null) =>
  rooms.find((room) => room.id === selectedRoomId) || getDefaultSelectedRoom(rooms);
