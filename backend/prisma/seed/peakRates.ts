import type { PrismaClient, Room } from '@prisma/client';

export const createPeakRates = async (prisma: PrismaClient, rooms: Room[]) => {
  await prisma.peakSeasonRate.createMany({
    data: [
      { roomId: rooms[0].id, start_date: new Date('2026-12-20'), end_date: new Date('2027-01-05'), rate_type: 'PERCENTAGE', rate_value: 50, description: 'Libur Natal & Tahun Baru' },
      { roomId: rooms[1].id, start_date: new Date('2026-12-20'), end_date: new Date('2027-01-05'), rate_type: 'PERCENTAGE', rate_value: 50, description: 'Libur Natal & Tahun Baru' },
      { roomId: rooms[10].id, start_date: new Date('2026-07-01'), end_date: new Date('2026-07-31'), rate_type: 'NOMINAL', rate_value: 500000, description: 'High season Bali Juli' },
    ],
  });
};
