import type { FC } from "react";
import { Link } from "react-router-dom";
import { MapPin, ChevronRight, BedDouble } from "lucide-react";
import type { Order } from "@/types";
import { EmptyState } from "@/components/common/EmptyState";

interface DashboardUpcomingStayProps {
  order: Order | null;
}

export const DashboardUpcomingStay: FC<DashboardUpcomingStayProps> = ({ order }) => {
  if (!order) {
    return (
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">Reservasi Mendatang</h2>
        <div className="rounded-3xl border border-slate-100 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
          <EmptyState title="Belum Ada Reservasi" description="Anda tidak memiliki reservasi mendatang. Temukan tempat menginap impian Anda sekarang." />
          <div className="mt-6 flex justify-center">
            <Link to="/explore" className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700">
              Eksplorasi Properti
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const checkIn = new Date(order.check_in_date);
  const checkOut = new Date(order.check_out_date);

  return (
    <div className="mb-8">
      <h2 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">Reservasi Mendatang</h2>
      <div className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col md:flex-row">
          <div className="h-48 md:w-1/3 md:h-auto overflow-hidden bg-slate-200 dark:bg-slate-800">
            {order.property?.featured_image_url ? (
              <img src={order.property.featured_image_url} alt={order.property.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <BedDouble size={40} className="text-slate-400" />
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col justify-between p-6 md:p-8">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Terkonfirmasi</span>
                <span className="text-sm text-slate-500 font-mono">#{order.order_number}</span>
              </div>
              <h3 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">{order.property?.name}</h3>
              <div className="mb-4 flex items-center text-sm text-slate-500 dark:text-slate-400">
                <MapPin size={16} className="mr-1" /> {order.property?.city}
              </div>
              
              <div className="mb-6 flex items-center gap-6 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Check-in</p>
                  <p className="font-medium text-slate-900 dark:text-white">{checkIn.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
                <ChevronRight className="text-slate-300" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Check-out</p>
                  <p className="font-medium text-slate-900 dark:text-white">{checkOut.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
              <span className="font-semibold text-slate-700 dark:text-slate-300">{order.room?.room_type}</span>
              <Link to={`/orders/${order.id}`} className="flex items-center text-sm font-bold text-red-600 transition hover:text-red-700 dark:text-red-500 dark:hover:text-red-400">
                Lihat Detail <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
