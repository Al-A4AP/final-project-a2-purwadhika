import prisma from '../../config/prisma';
import type { OrderStatus } from '@prisma/client';

const ACTIVE_OCCUPANCY_STATUSES: OrderStatus[] = ['WAITING_PAYMENT', 'WAITING_CONFIRMATION', 'PROCESSED', 'COMPLETED'];

export const findOccupancyCalendar = (tenantId: string) => (
  prisma.property.findMany({
    where: { tenantId, deleted_at: null },
    select: {
      id: true,
      name: true,
      rooms: { where: { deleted_at: null }, select: buildRoomOccupancySelect() },
    },
  })
);

const buildRoomOccupancySelect = () => ({
  id: true,
  orders: { where: { status: { in: ACTIVE_OCCUPANCY_STATUSES } }, select: buildOrderOccupancySelect() },
  room_type: true,
});

const buildOrderOccupancySelect = () => ({
  check_in_date: true,
  check_out_date: true,
  id: true,
  order_number: true,
  user: { select: { name: true } },
});
