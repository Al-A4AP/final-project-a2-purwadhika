import type { FC } from 'react';
import { useEffect, useState, useCallback } from 'react';
import { tenantReportService, type DashboardAnalytics, type OccupancyProperty, type OccupancyRoom } from '@/services/tenantReportService';
import { tenantService } from '@/services/tenantService';
import { formatPrice } from '@/lib/formatters';
import type { TenantProperty } from '@/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, ChevronLeft, ChevronRight, Info } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ReportsPage: FC = () => {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [properties, setProperties] = useState<TenantProperty[]>([]);
  const [occupancyData, setOccupancyData] = useState<OccupancyProperty[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Occupancy Calendar navigation
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed

  // Load properties list for filter & occupancy calendar
  useEffect(() => {
    tenantService.getProperties({ limit: 100 })
      .then((data) => setProperties(data.properties))
      .catch(() => {});
    
    tenantReportService.getOccupancyCalendar()
      .then(setOccupancyData)
      .catch(() => {});
  }, []);

  const fetchAnalytics = useCallback(() => {
    setLoading(true);
    tenantReportService.getDashboardAnalytics({
      propertyId: selectedPropertyId || undefined,
      status: selectedStatus || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      sortBy,
      sortOrder,
    })
      .then(setAnalytics)
      .finally(() => setLoading(false));
  }, [selectedPropertyId, selectedStatus, startDate, endDate, sortBy, sortOrder]);

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchAnalytics();
    });
  }, [fetchAnalytics]);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const dayNumbers = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const getDayBooking = (room: OccupancyRoom, day: number) => {
    const checkDate = new Date(currentYear, currentMonth, day);
    checkDate.setHours(12, 0, 0, 0);

    return room.orders.find((order) => {
      const start = new Date(order.check_in_date);
      start.setHours(12, 0, 0, 0);
      const end = new Date(order.check_out_date);
      end.setHours(12, 0, 0, 0);
      return checkDate >= start && checkDate < end;
    });
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Laporan & Analitik</h1>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border dark:border-slate-700 flex flex-wrap gap-4 items-end shadow-sm">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Properti</label>
          <select
            value={selectedPropertyId}
            onChange={(e) => setSelectedPropertyId(e.target.value)}
            className="w-full text-sm border dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg p-2 text-gray-900 dark:text-white"
          >
            <option value="">Semua Properti</option>
            {properties.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="w-[180px]">
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Status Transaksi</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full text-sm border dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg p-2 text-gray-900 dark:text-white"
          >
            <option value="">Semua Status</option>
            <option value="WAITING_PAYMENT">Menunggu Pembayaran</option>
            <option value="WAITING_CONFIRMATION">Menunggu Konfirmasi</option>
            <option value="PROCESSED">Dikonfirmasi</option>
            <option value="COMPLETED">Selesai Menginap</option>
            <option value="CANCELLED">Dibatalkan</option>
          </select>
        </div>

        <div className="w-[160px]">
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Mulai Tanggal</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full text-sm border dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg p-2 text-gray-900 dark:text-white"
          />
        </div>

        <div className="w-[160px]">
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Sampai Tanggal</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full text-sm border dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg p-2 text-gray-900 dark:text-white"
          />
        </div>

        <div className="w-[180px]">
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Urutan Transaksi</label>
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [by, order] = e.target.value.split('-');
              setSortBy(by);
              setSortOrder(order as 'asc' | 'desc');
            }}
            className="w-full text-sm border dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg p-2 text-gray-900 dark:text-white"
          >
            <option value="created_at-desc">Tanggal: Terbaru</option>
            <option value="created_at-asc">Tanggal: Terlama</option>
            <option value="total_price-desc">Nilai: Terbesar</option>
            <option value="total_price-asc">Nilai: Terkecil</option>
          </select>
        </div>

        <button
          onClick={() => {
            setSelectedPropertyId('');
            setSelectedStatus('');
            setStartDate('');
            setEndDate('');
            setSortBy('created_at');
            setSortOrder('desc');
          }}
          className="px-4 py-2 border dark:border-slate-700 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 bg-white dark:bg-slate-900"
        >
          Reset
        </button>
      </div>

      {loading ? (
        <div className="p-20 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700">
          Memuat Laporan & Analitik...
        </div>
      ) : !analytics ? (
        <div className="p-10 text-center text-gray-500 bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700">
          Tidak ada data laporan.
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border dark:border-slate-700">
              <p className="text-sm text-gray-500 mb-1">Total Pendapatan (Dikonfirmasi/Selesai)</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatPrice(analytics.totalRevenue)}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border dark:border-slate-700">
              <p className="text-sm text-gray-500 mb-1">Total Transaksi</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalOrders}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Status Chart */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border dark:border-slate-700">
              <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Status Pesanan</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={analytics.ordersByStatus} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="count" label>
                      {analytics.ordersByStatus.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
                {analytics.ordersByStatus.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-gray-600 dark:text-gray-400">{entry.name} ({entry.count})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bar Chart (Perbandingan Status) */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border dark:border-slate-700">
              <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Perbandingan Transaksi</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.ordersByStatus} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#8884d8" fontSize={12} tickMargin={10} />
                    <YAxis stroke="#8884d8" fontSize={12} allowDecimals={false} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px' }} />
                    <Bar dataKey="count" fill="#FF8042" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Orders List (Simplified) */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border dark:border-slate-700 overflow-hidden lg:col-span-2">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Daftar Transaksi Laporan</h2>
              <div className="space-y-4">
                {analytics.recentOrders.length === 0 ? (
                  <p className="text-sm text-gray-500 py-4">Belum ada pesanan masuk.</p>
                ) : analytics.recentOrders.map((order) => (
                  <div key={order.id} className="flex justify-between items-center border-b dark:border-slate-700 pb-2">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{order.property?.name}</p>
                      <p className="text-xs text-gray-500">{order.user?.name} - {order.order_number} ({new Date(order.created_at).toLocaleDateString('id-ID')})</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-gray-900 dark:text-white">{formatPrice(order.total_price)}</p>
                      <p className="text-xs text-gray-500">{order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Gantt-style Occupancy Calendar */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border dark:border-slate-700 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="text-red-600" size={24} />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Kalender Okupansi Kamar</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={handlePrevMonth} className="p-2 border dark:border-slate-600 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition">
              <ChevronLeft size={18} />
            </button>
            <span className="text-md font-semibold text-gray-800 dark:text-gray-200">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <button onClick={handleNextMonth} className="p-2 border dark:border-slate-600 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-500 rounded border border-emerald-600"></div>
            <span>Kosong / Tersedia (Available)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded border border-orange-600"></div>
            <span>Terisi / Dipesan (Booked)</span>
          </div>
        </div>

        {/* Gantt Matrix Grid Container */}
        <div className="overflow-x-auto border dark:border-slate-700 rounded-xl">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-700/50 text-gray-600 dark:text-gray-300 border-b dark:border-slate-700">
                <th className="p-3 font-semibold text-left min-w-[200px] border-r dark:border-slate-700 sticky left-0 bg-gray-50 dark:bg-slate-800 z-10">Properti & Kamar</th>
                {dayNumbers.map(day => (
                  <th key={day} className="p-2 font-semibold text-center min-w-[36px] border-r dark:border-slate-700">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {occupancyData.length === 0 ? (
                <tr>
                  <td colSpan={daysInMonth + 1} className="p-8 text-center text-gray-500">
                    Belum ada data properti dan kamar untuk kalender okupansi.
                  </td>
                </tr>
              ) : (
                occupancyData.map(property => (
                  <>
                    {/* Property header row */}
                    <tr key={property.id} className="bg-gray-100/70 dark:bg-slate-700/20 border-b dark:border-slate-700">
                      <td colSpan={daysInMonth + 1} className="p-2.5 font-bold text-gray-800 dark:text-gray-200 sticky left-0 bg-gray-100/70 dark:bg-slate-800/80 z-10">
                        🏠 {property.name}
                      </td>
                    </tr>

                    {/* Rooms rows */}
                    {property.rooms.map(room => (
                      <tr key={room.id} className="border-b dark:border-slate-700 hover:bg-gray-50/50 dark:hover:bg-slate-700/20">
                        <td className="p-3 font-medium text-gray-700 dark:text-gray-300 border-r dark:border-slate-700 sticky left-0 bg-white dark:bg-slate-800 z-10 truncate max-w-[200px]">
                          🔑 {room.room_type}
                        </td>
                        {dayNumbers.map(day => {
                          const booking = getDayBooking(room, day);
                          return (
                            <td
                              key={day}
                              className={`p-2 text-center border-r dark:border-slate-700 relative group transition-all duration-150 ${
                                booking
                                  ? 'bg-orange-500 hover:bg-orange-600 text-white cursor-help'
                                  : 'bg-emerald-500/10 dark:bg-emerald-500/5 hover:bg-emerald-500/20 text-emerald-600'
                              }`}
                            >
                              {booking ? 'B' : '•'}

                              {/* Tooltip on Hover */}
                              {booking && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-slate-900 text-white p-2.5 rounded-lg shadow-xl text-left pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-20 border border-slate-700 space-y-1">
                                  <div className="flex items-center gap-1 text-[10px] text-orange-400 font-bold uppercase tracking-wider">
                                    <Info size={10} /> Dipesan
                                  </div>
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
