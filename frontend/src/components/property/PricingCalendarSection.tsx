import type { FC } from "react";
import { useMemo } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { CalendarIcon, AlertTriangle } from "lucide-react";
import type { Room } from "@/types";

interface Props {
  checkIn: string;
  checkOut: string;
  dateError: string;
  rooms: Room[];
  onCheckInChange: (val: string) => void;
  onCheckOutChange: (val: string) => void;
}

export const PricingCalendarSection: FC<Props> = ({
  checkIn,
  checkOut,
  dateError,
  rooms,
  onCheckInChange,
  onCheckOutChange,
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // We assume the user is looking at the cheapest room available for the dates.
  // Or, we find the absolute minimum price across all rooms for a specific date.
  const getPriceForDate = (date: Date) => {
    const dStr = date.toISOString().split("T")[0];
    let minPrice = 0;
    let isPeak = false;
    let availableRooms = 0;

    for (const room of rooms) {
      // Check if room is blocked
      const isBlocked = room.availabilities?.some(
        (a: { is_available: boolean; date: string }) =>
          !a.is_available && a.date.startsWith(dStr),
      );
      if (isBlocked) continue;

      availableRooms++;

      let price = room.base_price;
      const rate = room.peakRates?.find(
        (r: {
          start_date: Date | string;
          end_date: Date | string;
          rate_type: string;
          rate_value: number;
        }) => {
          const start = new Date(r.start_date);
          start.setHours(0, 0, 0, 0);
          const end = new Date(r.end_date);
          end.setHours(0, 0, 0, 0);
          return date >= start && date <= end;
        },
      );

      if (rate) {
        if (rate.rate_type === "PERCENTAGE") {
          price =
            room.base_price +
            Math.round((room.base_price * rate.rate_value) / 100);
        } else {
          price = room.base_price + rate.rate_value;
        }
      }

      if (price < minPrice) {
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
      // Make sure we format to local string YYYY-MM-DD
      const fromStr = new Date(
        range.from.getTime() - range.from.getTimezoneOffset() * 60000,
      )
        .toISOString()
        .split("T")[0];
      onCheckInChange(fromStr);
    } else {
      onCheckInChange("");
    }

    if (range.to) {
      const toStr = new Date(
        range.to.getTime() - range.to.getTimezoneOffset() * 60000,
      )
        .toISOString()
        .split("T")[0];
      onCheckOutChange(toStr);
    } else {
      onCheckOutChange("");
    }
  };

  const nights =
    checkIn && checkOut && new Date(checkOut) > new Date(checkIn)
      ? Math.ceil(
          (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
            86400000,
        )
      : 0;

  return (
    <div
      id="date-picker-section"
      className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border dark:border-slate-700 mb-8"
    >
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <CalendarIcon size={20} className="text-red-600" /> Pilih Tanggal &
        Lihat Perbandingan Harga
      </h2>

      <p className="text-sm text-gray-500 mb-6">
        Harga yang ditampilkan adalah harga termurah yang tersedia per malam.
      </p>
      <p className="text-sm text-gray-50 mb-6">
        Klik sekali pada tanggal yang dipilih untuk membatalkan check-in atau
        check-out.
      </p>

      <div className="flex justify-center overflow-x-auto bg-gray-50 dark:bg-slate-900/50 p-6 rounded-xl border border-gray-100 dark:border-slate-700/50">
        <DayPicker
          mode="range"
          selected={selectedRange}
          onSelect={handleSelect}
          disabled={{ before: today }}
          numberOfMonths={window.innerWidth > 768 ? 2 : 1}
          pagedNavigation
          components={{
            DayButton: (
              props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
                day: { date: Date };
                modifiers?: unknown;
              },
            ) => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { day, modifiers, ...buttonProps } = props;
              const date = day.date;
              const isPast = date < today;
              const pricing = isPast ? null : getPriceForDate(date);

              return (
                <button
                  {...buttonProps}
                  className={`${buttonProps.className || ""} flex flex-col items-center justify-center h-full w-full py-1 relative`}
                >
                  <span className="text-sm font-medium z-10">
                    {date.getDate()}
                  </span>
                  {!isPast && pricing && (
                    <span
                      className={`text-[9px] mt-0.5 whitespace-nowrap z-10 ${pricing.isPeak ? "text-red-600 dark:text-red-400 font-bold" : "text-gray-500 dark:text-gray-400"}`}
                    >
                      {pricing.price >= 1000
                        ? `${pricing.price / 1000}k`
                        : pricing.price}
                    </span>
                  )}
                  {!isPast && !pricing && (
                    <span className="text-[9px] mt-0.5 text-gray-400 z-10">
                      Penuh
                    </span>
                  )}
                </button>
              );
            },
          }}
          modifiersClassNames={{
            selected: "bg-red-50 text-red-600 font-bold",
            range_start: "bg-red-600 text-white rounded-l-full",
            range_end: "bg-red-600 text-white rounded-r-full",
            range_middle:
              "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
          }}
          styles={{
            day: { height: "3.5rem", width: "3.5rem", margin: "0.1rem" },
          }}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Check-in
          </label>
          <input
            type="date"
            value={checkIn}
            readOnly
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-700/50 dark:text-gray-400 rounded-lg outline-none cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Check-out
          </label>
          <input
            type="date"
            value={checkOut}
            readOnly
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-700/50 dark:text-gray-400 rounded-lg outline-none cursor-not-allowed"
          />
        </div>
      </div>

      {dateError && (
        <p className="mt-4 text-sm text-red-500 flex items-center gap-1 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
          <AlertTriangle size={16} /> {dateError}
        </p>
      )}

      {nights > 0 && (
        <p className="mt-4 text-sm text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
          <CalendarIcon size={16} /> Terpilih: {nights} malam
        </p>
      )}
    </div>
  );
};
