import prisma from "../config/prisma";

export interface StayDetailBreakdown {
  date: string;
  price: number;
  isPeak: boolean;
  rateName?: string;
}

export const getPriceForDate = (
  date: Date,
  basePrice: number,
  peakRates: any[],
) => {
  const targetDate = new Date(date);
  targetDate.setUTCHours(0, 0, 0, 0);

  // Find the first matching active peak season rate
  const rate = peakRates.find((r) => {
    const start = new Date(r.start_date);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(r.end_date);
    end.setUTCHours(0, 0, 0, 0);
    return targetDate >= start && targetDate <= end;
  });

  if (!rate) {
    return { price: basePrice, isPeak: false };
  }

  let price = basePrice;
  if (rate.rate_type === "PERCENTAGE") {
    price = basePrice + Math.round((basePrice * rate.rate_value) / 100);
  } else if (rate.rate_type === "NOMINAL") {
    price = basePrice + rate.rate_value;
  }

  return {
    price,
    isPeak: true,
    rateName: rate.description || "Tarif Peak Season",
  };
};

export const calculateStayDetails = async (
  roomId: string,
  checkInDate: Date,
  checkOutDate: Date,
  tx?: any,
) => {
  const client = tx || prisma;
  // harusnya periksa ketersediaan kamarnya dulu sehingga kamarnya malah muncul (tempelkan availabilitySErvice.ts) atau menggunakan prisma memeriksa availabilty room.
  const room = await client.room.findFirst({
    where: { id: roomId, deleted_at: null },
    include: { peakRates: { where: { deleted_at: null } } },
  });

  if (!room) {
    throw new Error("Kamar tidak ditemukan");
  }

  const checkIn = new Date(checkInDate);
  checkIn.setUTCHours(0, 0, 0, 0);
  const checkOut = new Date(checkOutDate);
  checkOut.setUTCHours(0, 0, 0, 0);

  if (checkIn >= checkOut) {
    throw new Error("Tanggal check-out harus setelah tanggal check-in");
  }

  const nights = Math.ceil(
    (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
  );
  const breakdown: StayDetailBreakdown[] = [];
  let totalPrice = 0;

  const current = new Date(checkIn);
  while (current < checkOut) {
    const dateStr = current.toISOString().split("T")[0];
    const { price, isPeak, rateName } = getPriceForDate(
      current,
      room.base_price,
      room.peakRates,
    );
    breakdown.push({
      date: dateStr,
      price,
      isPeak,
      rateName,
    });
    totalPrice += price;
    current.setDate(current.getDate() + 1);
  }

  return {
    roomId,
    basePrice: room.base_price,
    nights,
    totalPrice,
    breakdown,
  };
};
