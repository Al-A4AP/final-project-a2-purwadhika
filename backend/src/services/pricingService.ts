import prisma from "../config/prisma";
import { checkAvailability } from "./availabilityService";

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

const buildDates = (checkIn: Date, checkOut: Date) => {
  const ci = new Date(checkIn);
  ci.setUTCHours(0, 0, 0, 0);
  const co = new Date(checkOut);
  co.setUTCHours(0, 0, 0, 0);
  if (ci >= co) throw new Error("Tanggal check-out harus setelah check-in");
  return { ci, co };
};

const buildBreakdown = (ci: Date, co: Date, room: any) => {
  const breakdown: StayDetailBreakdown[] = [];
  let totalPrice = 0;
  const current = new Date(ci);
  while (current < co) {
    const res = getPriceForDate(current, room.base_price, room.peakRates);
    breakdown.push({ date: current.toISOString().split("T")[0], ...res });
    totalPrice += res.price;
    current.setDate(current.getDate() + 1);
  }
  return { breakdown, totalPrice };
};

export const calculateStayDetails = async (
  roomId: string,
  checkInDate: Date,
  checkOutDate: Date,
  tx?: any,
) => {
  const room = await (tx || prisma).room.findFirst({
    where: { id: roomId, deleted_at: null },
    include: { peakRates: { where: { deleted_at: null } } },
  });
  if (!room) throw new Error("Kamar tidak ditemukan");
  const { ci, co } = buildDates(checkInDate, checkOutDate);
  const { breakdown, totalPrice } = buildBreakdown(ci, co, room);
  const nights = Math.ceil((co.getTime() - ci.getTime()) / 86400000);
  return { roomId, basePrice: room.base_price, nights, totalPrice, breakdown };
};

export const getValidatedStayDetails = async (
  roomId: string,
  checkInDate: Date,
  checkOutDate: Date,
  tx?: any,
) => {
  const avail = await checkAvailability(roomId, checkInDate, checkOutDate, tx);
  if (!avail.available) throw new Error(avail.reason || "Kamar penuh");
  return calculateStayDetails(roomId, checkInDate, checkOutDate, tx);
};
