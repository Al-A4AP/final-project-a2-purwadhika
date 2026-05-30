import { useMemo } from "react";
import type { Room } from "@/types";

export const usePricingCalendar = (
  rooms: Room[],
  checkIn: string,
  checkOut: string,
  onCheckInChange: (val: string) => void,
  onCheckOutChange: (val: string) => void
) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getPriceForDate = (date: Date) => {
    const dStr = date.toISOString().split("T")[0];
    let minPrice = 0;
    let isPeak = false;
    let availableRooms = 0;

    for (const room of rooms) {
      const isBlocked = room.availabilities?.some(
        (a: { is_available: boolean; date: string }) => !a.is_available && a.date.startsWith(dStr)
      );
      if (isBlocked) continue;

      availableRooms++;
      let price = room.base_price;
      const rate = room.peakRates?.find((r: { start_date: Date | string; end_date: Date | string; rate_type: string; rate_value: number; }) => {
        const start = new Date(r.start_date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(r.end_date);
        end.setHours(0, 0, 0, 0);
        return date >= start && date <= end;
      });

      if (rate) {
        if (rate.rate_type === "PERCENTAGE") {
          price = room.base_price + Math.round((room.base_price * rate.rate_value) / 100);
        } else {
          price = room.base_price + rate.rate_value;
        }
      }

      if (price < minPrice || minPrice === 0) {
        minPrice = price;
        isPeak = !!rate;
      }
    }

    if (availableRooms === 0 || minPrice === 0) return null;
    return { price: minPrice, isPeak };
  };

  const selectedRange = useMemo(() => {
    return {
      from: checkIn ? new Date(checkIn) : undefined,
      to: checkOut ? new Date(checkOut) : undefined,
    };
  }, [checkIn, checkOut]);

  const handleSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (!range) {
      onCheckInChange("");
      onCheckOutChange("");
      return;
    }

    if (range.from) {
      const fromStr = new Date(range.from.getTime() - range.from.getTimezoneOffset() * 60000).toISOString().split("T")[0];
      onCheckInChange(fromStr);
    } else {
      onCheckInChange("");
    }

    if (range.to) {
      const toStr = new Date(range.to.getTime() - range.to.getTimezoneOffset() * 60000).toISOString().split("T")[0];
      onCheckOutChange(toStr);
    } else {
      onCheckOutChange("");
    }
  };

  const nights = checkIn && checkOut && new Date(checkOut) > new Date(checkIn)
    ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)
    : 0;

  return { today, getPriceForDate, selectedRange, handleSelect, nights };
};
