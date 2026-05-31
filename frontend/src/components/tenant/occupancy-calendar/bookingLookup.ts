import type { OccupancyRoom } from "@/services/tenantReportService";

const noonDate = (date: Date) => {
  const value = new Date(date);
  value.setHours(12, 0, 0, 0);
  return value;
};

export const getDayBooking = (room: OccupancyRoom, day: number, year: number, month: number) => {
  const checkDate = noonDate(new Date(year, month, day));
  return room.orders.find((order) => {
    const start = noonDate(new Date(order.check_in_date));
    const end = noonDate(new Date(order.check_out_date));
    return checkDate >= start && checkDate < end;
  });
};
