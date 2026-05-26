import type { FC } from 'react';
import { useState } from 'react';
import type { OccupancyProperty, OccupancyRoom } from '@/services/tenantReportService';
import { Calendar, ChevronLeft, ChevronRight, Info, Home, Key } from 'lucide-react';

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const getDayBooking = (room: OccupancyRoom, day: number, year: number, month: number) => {
  const checkDate = new Date(year, month, day); checkDate.setHours(12, 0, 0, 0);
  return room.orders.find((order) => {
    const start = new Date(order.check_in_date); start.setHours(12, 0, 0, 0);
    const end = new Date(order.check_out_date); end.setHours(12, 0, 0, 0);
    return checkDate >= start && checkDate < end;
  });
};

interface Props { data: OccupancyProperty[] }

export const OccupancyCalendar: FC<Props> = ({ data }) => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const dayNumbers = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handlePrevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(p => p - 1); }
    else setCurrentMonth(p => p - 1);
  };
  const handleNextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(p => p + 1); }
    else setCurrentMonth(p => p + 1);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border dark:border-slate-700 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="text-red-600" size={24} />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Kalender Okupansi Kamar</h2>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={handlePrevMonth} className="p-2 border dark:border-slate-600 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition"><ChevronLeft size={18} /></button>
          <span className="text-md font-semibold text-gray-800 dark:text-gray-200">{MONTH_NAMES[currentMonth]} {currentYear}</span>
          <button onClick={handleNextMonth} className="p-2 border dark:border-slate-600 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition"><ChevronRight size={18} /></button>
        </div>
      </div>

      <div className="flex items-center gap-6 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-emerald-500 rounded border border-emerald-600"></div><span>Kosong / Tersedia</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 bg-orange-500 rounded border border-orange-600"></div><span>Terisi / Dipesan</span></div>
      </div>

      <div className="overflow-x-auto border dark:border-slate-700 rounded-xl">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-700/50 text-gray-600 dark:text-gray-300 border-b dark:border-slate-700">
              <th className="p-3 font-semibold text-left min-w-50 border-r dark:border-slate-700 sticky left-0 bg-gray-50 dark:bg-slate-800 z-10">Properti & Kamar</th>
              {dayNumbers.map(day => (<th key={day} className="p-2 font-semibold text-center min-w-9 border-r dark:border-slate-700">{day}</th>))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan={daysInMonth + 1} className="p-8 text-center text-gray-500">Belum ada data properti dan kamar untuk kalender okupansi.</td></tr>
            ) : data.map(property => (
              <PropertyOccupancyRows key={property.id} property={property} dayNumbers={dayNumbers} year={currentYear} month={currentMonth} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PropertyOccupancyRows: FC<{ property: OccupancyProperty; dayNumbers: number[]; year: number; month: number }> = ({ property, dayNumbers, year, month }) => (
  <>
    <tr className="bg-gray-100/70 dark:bg-slate-700/20 border-b dark:border-slate-700">
      <td colSpan={dayNumbers.length + 1} className="p-2.5 font-bold text-gray-800 dark:text-gray-200 sticky left-0 bg-gray-100/70 dark:bg-slate-800/80 z-10">
        <div className="flex items-center gap-1.5"><Home size={16} className="text-rose-600 dark:text-rose-400" /><span>{property.name}</span></div>
      </td>
    </tr>
    {property.rooms.map(room => (
      <tr key={room.id} className="border-b dark:border-slate-700 hover:bg-gray-50/50 dark:hover:bg-slate-700/20">
        <td className="p-3 font-medium text-gray-700 dark:text-gray-300 border-r dark:border-slate-700 sticky left-0 bg-white dark:bg-slate-800 z-10 truncate max-w-50">
          <div className="flex items-center gap-1.5"><Key size={14} className="text-gray-500" /><span>{room.room_type}</span></div>
        </td>
        {dayNumbers.map(day => {
          const booking = getDayBooking(room, day, year, month);
          return (
            <td key={day} className={`p-2 text-center border-r dark:border-slate-700 relative group transition-all duration-150 ${booking ? 'bg-orange-500 hover:bg-orange-600 text-white cursor-help' : 'bg-emerald-500/10 dark:bg-emerald-500/5 hover:bg-emerald-500/20 text-emerald-600'}`}>
              {booking ? 'B' : '•'}
              {booking && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-900 text-white p-2.5 rounded-lg shadow-xl text-left pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-20 border border-slate-700 space-y-1">
                  <div className="flex items-center gap-1 text-[10px] text-orange-400 font-bold uppercase tracking-wider"><Info size={10} /> Dipesan</div>
                  <p className="font-semibold text-xs truncate">{booking.user?.name}</p>
                  <p className="text-[10px] text-gray-400">{booking.order_number}</p>
                  <div className="text-[9px] text-gray-400 border-t border-slate-800 pt-1 mt-1">
                    {new Date(booking.check_in_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - {new Date(booking.check_out_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
              )}
            </td>
          );
        })}
      </tr>
    ))}
  </>
);
