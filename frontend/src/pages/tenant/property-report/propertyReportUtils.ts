import type { OccupancyProperty } from "@/services/tenantReportService";

export const getTotals = (data: OccupancyProperty[]) => ({
  totalProperties: data.length,
  totalRooms: data.reduce((acc, p) => acc + p.rooms.length, 0),
  totalBookings: data.reduce((acc, p) =>
    acc + p.rooms.reduce((r, room) => r + room.orders.length, 0), 0),
});

export const getRoomBookings = (property: OccupancyProperty) =>
  property.rooms.reduce((acc, room) => acc + room.orders.length, 0);
