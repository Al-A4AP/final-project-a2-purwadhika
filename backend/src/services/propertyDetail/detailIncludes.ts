import type { OrderStatus } from "@prisma/client";
import type { RoomCalendarRange } from "./detailTypes";


export const propertyInclude = {
  category: true,
  images: { orderBy: { order: "asc" as const } },
  rooms: { where: { deleted_at: null } },
  reviews: {
    where: { deleted_at: null },
    include: { user: { select: { name: true, avatar_url: true } }, replies: true },
    orderBy: { created_at: "desc" as const },
    take: 10,
  },
};


export const roomRelationInclude = (range: RoomCalendarRange) => ({
  images: { orderBy: { order: "asc" as const } },
  peakRates: { where: { deleted_at: null } },
});
