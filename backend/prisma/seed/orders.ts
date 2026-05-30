import type { Order, PrismaClient, Property, Room } from '@prisma/client';
import { ORDER_SEEDS } from './data';
import type { SeedUsers } from './users';

type OrderSeed = (typeof ORDER_SEEDS)[number];

const DAY_MS = 86400000;

const dateFromOffset = (days: number) => new Date(Date.now() + days * DAY_MS);

const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

const getPaymentDates = (status: OrderSeed['status']) => ({
  payment_verified_at: status === 'PROCESSED' ? dateFromOffset(-1) : null,
  canceled_at: status === 'CANCELLED' ? dateFromOffset(-4) : null,
});

const buildOrderData = (seed: OrderSeed, users: SeedUsers, properties: Property[], rooms: Room[]) => ({
  order_number: generateOrderNumber(),
  userId: users[seed.userKey].id,
  roomId: rooms[seed.roomIndex].id,
  propertyId: properties[seed.propertyIndex].id,
  check_in_date: dateFromOffset(seed.checkInOffset),
  check_out_date: dateFromOffset(seed.checkOutOffset),
  total_price: rooms[seed.roomIndex].base_price * seed.nights,
  status: seed.status,
  payment_method: 'MANUAL' as const,
  ...getPaymentDates(seed.status),
});

const createOrder = (
  prisma: PrismaClient,
  seed: OrderSeed,
  users: SeedUsers,
  properties: Property[],
  rooms: Room[],
) => prisma.order.create({ data: buildOrderData(seed, users, properties, rooms) });

export const createOrders = async (
  prisma: PrismaClient,
  users: SeedUsers,
  properties: Property[],
  rooms: Room[],
): Promise<Order[]> =>
  Promise.all(ORDER_SEEDS.map((seed) => createOrder(prisma, seed, users, properties, rooms)));
