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
  orders: { where: buildActiveOrderWhere(), select: buildOrderOccupancySelect() },
  room_type: true,
});

const buildActiveOrderWhere = () => ({
  check_out_date: { gte: startOfToday() },
  status: { in: ACTIVE_OCCUPANCY_STATUSES },
});

const buildOrderOccupancySelect = () => ({
  check_in_date: true,
  check_out_date: true,
  id: true,
  order_number: true,
  user: { select: { name: true } },
});

const startOfToday = () => {
  const value = new Date();
  value.setHours(0, 0, 0, 0);
  return value;
};
