import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { tenantReportService, type DashboardAnalytics } from '@/services/tenantReportService';
import { formatPrice } from '@/lib/formatters';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// blm ada ide, standar dulu aja kita diskusi lg
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ReportsPage: FC = () => {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tenantReportService.getDashboardAnalytics()
      .then(setAnalytics)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-10 text-center">Loading reports...</div>;
  if (!analytics) return null;

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Laporan & Analitik</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border dark:border-slate-700">
          <p className="text-sm text-gray-500 mb-1">Total Pendapatan (Processed)</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatPrice(analytics.totalRevenue)}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border dark:border-slate-700">
          <p className="text-sm text-gray-500 mb-1">Total Transaksi</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalOrders}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
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
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Pesanan Terbaru</h2>
          <div className="space-y-4">
            {analytics.recentOrders.length === 0 ? (
              <p className="text-sm text-gray-500">Belum ada pesanan.</p>
            ) : analytics.recentOrders.map((order) => (
              <div key={order.id} className="flex justify-between items-center border-b dark:border-slate-700 pb-2">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{order.property.name}</p>
                  <p className="text-xs text-gray-500">{order.user.name} - {order.order_number}</p>
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
    </div>
  );
};

export default ReportsPage;
