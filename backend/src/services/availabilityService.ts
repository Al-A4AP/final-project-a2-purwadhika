import prisma from '../config/prisma';

export const checkAvailability = async (roomId: string, checkInDate: Date, checkOutDate: Date, tx?: any) => {
  const client = tx || prisma;

  // Fetch the room with quantity
  const room = await client.room.findFirst({
    where: { id: roomId, deleted_at: null }
  });

  if (!room) {
    throw new Error('Kamar tidak ditemukan');
  }

  const checkIn = new Date(checkInDate);
  checkIn.setUTCHours(0, 0, 0, 0);
  const checkOut = new Date(checkOutDate);
  checkOut.setUTCHours(0, 0, 0, 0);

  if (checkIn >= checkOut) {
    throw new Error('Tanggal check-out harus setelah tanggal check-in');
  }

  // Get nights list
  const nights: Date[] = [];
  const current = new Date(checkIn);
  while (current < checkOut) {
    nights.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  // Fetch blocked availabilities
  const availabilities = await client.roomAvailability.findMany({
    where: {
      roomId,
      date: {
        gte: checkIn,
        lt: checkOut
      },
      is_available: false
    }
  });

  // Fetch overlapping active orders
  const overlappingOrders = await client.order.findMany({
    where: {
      roomId,
      deleted_at: null,
      status: {
        in: ['WAITING_PAYMENT', 'WAITING_CONFIRMATION', 'PROCESSED', 'COMPLETED']
      },
      check_in_date: {
        lt: checkOut
      },
      check_out_date: {
        gt: checkIn
      }
    }
  });

  // Check each night
  for (const date of nights) {
    // 1. Check blocked dates
    const isBlocked = availabilities.some(
      a => new Date(a.date).getTime() === date.getTime()
    );
    if (isBlocked) {
      return {
        available: false,
        reason: `Kamar tidak tersedia (di-block oleh pengelola) pada tanggal ${date.toISOString().split('T')[0]}`
      };
    }

    // 2. Check overlapping quantity limit
    const orderCount = overlappingOrders.filter((order: any) => {
      const orderCheckIn = new Date(order.check_in_date);
      orderCheckIn.setUTCHours(0, 0, 0, 0);
      const orderCheckOut = new Date(order.check_out_date);
      orderCheckOut.setUTCHours(0, 0, 0, 0);
      return date >= orderCheckIn && date < orderCheckOut;
    }).length;

    if (orderCount >= room.quantity) {
      return {
        available: false,
        reason: `Kamar sudah penuh dipesan pada tanggal ${date.toISOString().split('T')[0]}`
      };
    }
  }

  return { available: true };
};
