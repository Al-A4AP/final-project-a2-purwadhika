import type { Prisma } from "@prisma/client";
import type { PropertyFormData } from "./tenantPropertyTypes";

const WHOLE_PROPERTY_ROOM_NAME = "Seluruh Properti";

export interface WholePropertyRoomData {
  base_price: number;
  capacity: number;
  description: string;
  quantity: number;
  room_type: string;
}

export const buildWholePropertyRoomData = (
  data: PropertyFormData,
): WholePropertyRoomData => ({
  base_price: Number(data.whole_property_price),
  capacity: Number(data.whole_property_capacity),
  description: "Menyewakan seluruh area properti.",
  quantity: 1,
  room_type: WHOLE_PROPERTY_ROOM_NAME,
});

export const upsertWholePropertyRoom = async (
  tx: Prisma.TransactionClient,
  propertyId: string,
  data: WholePropertyRoomData,
) => {
  const room = await findWholePropertyRoom(tx, propertyId);
  if (room) return tx.room.update({ where: { id: room.id }, data });
  return tx.room.create({ data: { ...data, propertyId } });
};

const findWholePropertyRoom = async (
  tx: Prisma.TransactionClient,
  propertyId: string,
) => (await findNamedWholePropertyRoom(tx, propertyId))
  || findFirstActiveRoom(tx, propertyId);

const findNamedWholePropertyRoom = (
  tx: Prisma.TransactionClient,
  propertyId: string,
) => tx.room.findFirst({
    where: {
      propertyId,
      deleted_at: null,
      room_type: { equals: WHOLE_PROPERTY_ROOM_NAME, mode: "insensitive" },
    },
  });

const findFirstActiveRoom = (
  tx: Prisma.TransactionClient,
  propertyId: string,
) => tx.room.findFirst({
    where: { propertyId, deleted_at: null },
    orderBy: { created_at: "asc" },
  });
