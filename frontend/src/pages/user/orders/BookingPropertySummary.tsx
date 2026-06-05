import type { FC } from "react";
import type { Order } from "@/types";
import { BedDouble, Calendar, MapPin, Moon } from "lucide-react";
import { differenceInCalendarDays } from "date-fns";

export const BookingPropertySummary: FC<{ order: Order }> = ({ order }) => {
  const checkIn = new Date(order.check_in_date);
  const checkOut = new Date(order.check_out_date);
  const duration = differenceInCalendarDays(checkOut, checkIn);

  return (
    <div className="mb-8 rounded-3xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-6 text-lg font-bold text-slate-900 dark:text-white">Detail Properti</h2>
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        <div className="h-48 w-full md:w-1/3 shrink-0 overflow-hidden rounded-2xl bg-slate-200 dark:bg-slate-800">
          {order.property?.featured_image_url ? (
            <img src={order.property.featured_image_url} alt={order.property.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <BedDouble size={40} className="text-slate-400" />
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col justify-center">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{order.property?.name}</h3>
          <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-6">
            <MapPin size={16} className="mr-1" /> {order.property?.city || 'Lokasi'}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 text-slate-400"><BedDouble size={18} /></div>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Tipe Kamar</p>
                <p className="font-medium text-slate-900 dark:text-white">{order.room?.room_type}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 text-slate-400"><Moon size={18} /></div>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Durasi</p>
                <p className="font-medium text-slate-900 dark:text-white">{duration} Malam</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 text-slate-400"><Calendar size={18} /></div>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Check-in</p>
                <p className="font-medium text-slate-900 dark:text-white">{checkIn.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 text-slate-400"><Calendar size={18} /></div>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Check-out</p>
                <p className="font-medium text-slate-900 dark:text-white">{checkOut.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
