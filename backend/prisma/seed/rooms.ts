import type { PrismaClient, Property, Room } from '@prisma/client';
import { ROOM_SEEDS } from './data';

type RoomSeed = (typeof ROOM_SEEDS)[number];

const createRoom = (
  prisma: PrismaClient,
  properties: Property[],
  seed: RoomSeed,
) => prisma.room.create({ data: buildRoomData(properties, seed) });

const buildRoomData = (properties: Property[], seed: RoomSeed) => ({
  propertyId: properties[seed.propertyIndex].id,
  room_type: seed.room_type,
  base_price: seed.base_price,
  child_price: Math.round(seed.base_price * 0.5),
  capacity: seed.capacity,
  quantity: 1,
  description: seed.description,
  images: buildRoomImageData(properties, seed),
});

const buildRoomImageData = (properties: Property[], seed: RoomSeed) => ({
  create: {
    image_url: properties[seed.propertyIndex].featured_image_url || '',
    order: 0,
  },
});

export const createRooms = async (
  prisma: PrismaClient,
  properties: Property[],
): Promise<Room[]> =>
  Promise.all(ROOM_SEEDS.map((seed) => createRoom(prisma, properties, seed)));
