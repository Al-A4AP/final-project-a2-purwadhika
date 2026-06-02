import prisma from "../../config/prisma";
import { propertyInclude, roomRelationInclude } from "./detailIncludes";
import type { RoomCalendarRange } from "./detailTypes";

export const findProperty = async (id: string) => {
  const property = await prisma.property.findFirst({
    where: { id, deleted_at: null },
    include: propertyInclude,
  });
  if (!property) throw new Error("Properti tidak ditemukan");
  return property;
};

export const findRoomRelation = (roomId: string, range: RoomCalendarRange) =>
  prisma.room.findUnique({
    where: { id: roomId },
    include: roomRelationInclude(range),
  });
