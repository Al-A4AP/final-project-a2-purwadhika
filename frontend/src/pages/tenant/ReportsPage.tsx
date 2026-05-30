import type { FC } from 'react';
import { useEffect, useState, useCallback } from 'react';
import { tenantReportService, type DashboardAnalytics, type OccupancyProperty } from '@/services/tenantReportService';
import { tenantService } from '@/services/tenantService';
import { formatPrice } from '@/lib/formatters';
import type { TenantProperty } from '@/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { OccupancyCalendar } from '@/components/tenant/OccupancyCalendar';
import { Pagination } from '@/components/common/Pagination';
import { OrderStatusPieChart } from '@/components/tenant/OrderStatusPieChart';

const ReportsPage: FC = () => {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [properties, setProperties] = useState<TenantProperty[]>([]);
  const [occupancyData, setOccupancyData] = useState<OccupancyProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [userName, setUserName] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [reportPage, setReportPage] = useState(1);

  useEffect(() => {
    tenantService.getProperties({ limit: 100 }).then((data) => setProperties(data.properties)).catch(() => {});
    tenantReportService.getOccupancyCalendar().then(setOccupancyData).catch(() => {});
  }, []);

  const fetchAnalytics = useCallback(() => {
    setLoading(true);
    tenantReportService.getDashboardAnalytics({ propertyId: selectedPropertyId || undefined, status: selectedStatus || undefined, userName: userName || undefined, startDate: startDate || undefined, endDate: endDate || undefined, sortBy, sortOrder, page: reportPage, limit: 10 })
      .then(setAnalytics).finally(() => setLoading(false));
  }, [selectedPropertyId, selectedStatus, userName, startDate, endDate, sortBy, sortOrder, reportPage]);

  useEffect(() => { Promise.resolve().then(() => fetchAnalytics()); }, [fetchAnalytics]);

  const resetFilters = () => { setSelectedPropertyId(''); setSelectedStatus(''); setUserName(''); setStartDate(''); setEndDate(''); setSortBy('created_at'); setSortOrder('desc'); };

  return (
    <div className="p-6 md:p-8 space-y-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Laporan & Analitik</h1>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border dark:border-slate-700 flex flex-wrap gap-4 items-end shadow-sm">
        <FilterSelect label="Properti" value={selectedPropertyId} onChange={setSelectedPropertyId} options={[{ value: '', label: 'Semua Properti' }, ...properties.map(p => ({ value: p.id, label: p.name }))]} />
        <FilterSelect label="Status Transaksi" value={selectedStatus} onChange={setSelectedStatus}
          options={[{ value: '', label: 'Semua Status' }, { value: 'WAITING_PAYMENT', label: 'Menunggu Pembayaran' }, { value: 'WAITING_CONFIRMATION', label: 'Menunggu Konfirmasi' }, { value: 'PROCESSED', label: 'Dikonfirmasi' }, { value: 'COMPLETED', label: 'Selesai Menginap' }, { value: 'CANCELLED', label: 'Dibatalkan' }]} />
        <div className="flex-1 min-w-40">
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Nama Pemesan</label>
          <input type="text" placeholder="Cari nama..." value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full text-sm border dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg p-2 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-red-500" />
        </div>
        <FilterDate label="Mulai Tanggal" value={startDate} onChange={setStartDate} />
        <FilterDate label="Sampai Tanggal" value={endDate} onChange={setEndDate} />
        <FilterSelect label="Urutan Transaksi" value={`${sortBy}-${sortOrder}`}
          onChange={(v) => { const [by, o] = v.split('-'); setSortBy(by); setSortOrder(o as 'asc' | 'desc'); }}
          options={[{ value: 'created_at-desc', label: 'Tanggal: Terbaru' }, { value: 'created_at-asc', label: 'Tanggal: Terlama' }, { value: 'total_price-desc', label: 'Nilai: Terbesar' }, { value: 'total_price-asc', label: 'Nilai: Terkecil' }]} />
        <button onClick={resetFilters} className="px-4 py-2 border dark:border-slate-700 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 bg-white dark:bg-slate-900">Reset</button>
      </div>

      {loading ? (
        <div className="p-20 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700">Memuat Laporan & Analitik...</div>
      ) : !analytics ? (
        <div className="p-10 text-center text-gray-500 bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700">Tidak ada data laporan.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard label="Total Pendapatan (Dikonfirmasi/Selesai)" value={formatPrice(analytics.totalRevenue)} />
            <KPICard label="Total Transaksi" value={String(analytics.totalOrders)} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ChartCard title="Status Pesanan">
              <OrderStatusPieChart data={analytics.ordersByStatus} />
            </ChartCard>
            <ChartCard title="Perbandingan Transaksi">
              <ResponsiveContainer width="100%" height={256}>
                <BarChart data={analytics.ordersByStatus} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#8884d8" fontSize={12} tickMargin={10} /><YAxis stroke="#8884d8" fontSize={12} allowDecimals={false} />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px' }} /><Bar dataKey="count" fill="#FF8042" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border dark:border-slate-700 overflow-hidden lg:col-span-2">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Daftar Transaksi Laporan</h2>
              <div className="space-y-4">
                {analytics.recentOrders.length === 0 ? <p className="text-sm text-gray-500 py-4">Belum ada pesanan masuk.</p> : analytics.recentOrders.map((order) => (
                  <div key={order.id} className="flex justify-between items-center border-b dark:border-slate-700 pb-2">
                    <div><p className="font-semibold text-gray-900 dark:text-white text-sm">{order.property?.name}</p><p className="text-xs text-gray-500">{order.user?.name} - {order.order_number} ({new Date(order.created_at).toLocaleDateString('id-ID')})</p></div>
                    <div className="text-right"><p className="font-bold text-sm text-gray-900 dark:text-white">{formatPrice(order.total_price)}</p><p className="text-xs text-gray-500">{order.status}</p></div>
                  </div>
                ))}
              </div>
              <Pagination
                currentPage={analytics.pagination?.page || 1}
                totalPages={analytics.pagination?.totalPages || 1}
                totalItems={analytics.pagination?.total}
                onPageChange={setReportPage}
              />
            </div>
          </div>
        </>
      )}

      <OccupancyCalendar data={occupancyData} />
    </div>
  );
};

/* Small helper sub-components */
const FilterSelect: FC<{ label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }> = ({ label, value, onChange, options }) => (
  <div className="flex-1 min-w-40">
    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">{label}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full text-sm border dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg p-2 text-gray-900 dark:text-white">
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const FilterDate: FC<{ label: string; value: string; onChange: (v: string) => void }> = ({ label, value, onChange }) => (
  <div className="w-40">
    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">{label}</label>
    <input type="date" value={value} onChange={(e) => onChange(e.target.value)} className="w-full text-sm border dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg p-2 text-gray-900 dark:text-white" />
  </div>
);

const KPICard: FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border dark:border-slate-700">
    <p className="text-sm text-gray-500 mb-1">{label}</p>
    <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
  </div>
);

const ChartCard: FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border dark:border-slate-700">
    <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">{title}</h2>
    {children}
  </div>
);

export default ReportsPage;
