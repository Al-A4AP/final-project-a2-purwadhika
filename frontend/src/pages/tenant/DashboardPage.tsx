import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, BedDouble, Clock, TrendingUp, Plus } from 'lucide-react';
import { HelpText } from '@/components/common/HelpText';
import { tenantService } from '@/services/tenantService';
import type { DashboardStats, RecentOrder } from '@/types';
import { ORDER_STATUS_SOFT_CLASSES } from '@/lib/constants';
import { formatCurrency, formatPrice, formatDate } from '@/lib/formatters';
import { getOrderStatusLabel } from '@/lib/orderStatus';

interface StatCardProps {
  icon: FC<{ size?: number; className?: string }>;
  label: string;
  value: string | number;
  color: string;
}

const StatCard: FC<StatCardProps> = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border dark:border-slate-700 w-full overflow-hidden">
    <div className="flex items-center justify-between mb-4">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <div className={`p-2 rounded-lg ${color}`}><Icon size={20} /></div>
    </div>
    <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white truncate" title={String(value)}>
      {value}
    </p>
  </div>
);

const DashboardPage: FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tenantService.getDashboard()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="p-4 md:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {[...Array(4)].map((_, i) => <div key={i} className="h-28 rounded-xl bg-gray-200 dark:bg-slate-700 animate-pulse" />)}
    </div>
  );

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Selamat datang kembali, kelola properti Anda</p>
        </div>
        <Link to="/tenant/properties/new"
          className="inline-flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 transition self-start md:self-auto"
        >
          <Plus size={16} /> Tambah Properti
        </Link>
      </div>
      <HelpText>Angka perlu konfirmasi membantu Anda menemukan pembayaran manual yang harus ditinjau lebih dulu.</HelpText>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard icon={Building2} label="Total Properti" value={stats?.propertyCount || 0} color="text-blue-600 bg-blue-50 dark:bg-blue-900/20" />
        <StatCard icon={BedDouble} label="Total Kamar" value={stats?.roomCount || 0} color="text-purple-600 bg-purple-50 dark:bg-purple-900/20" />
        <StatCard icon={Clock} label="Perlu Konfirmasi" value={stats?.pendingOrders || 0} color="text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20" />
        <StatCard icon={TrendingUp} label="Pendapatan Bulan Ini" value={formatCurrency(stats?.monthlyRevenue || 0)} color="text-green-600 bg-green-50 dark:bg-green-900/20" />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700 overflow-hidden">
        <div className="p-4 md:p-6 border-b dark:border-slate-700 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 dark:text-white">Pesanan Terbaru</h2>
          <Link to="/tenant/orders" className="text-sm text-red-600 hover:underline font-medium">Lihat semua</Link>
        </div>
        
        <div className="divide-y dark:divide-slate-700">
          {stats?.recentOrders?.length ? stats.recentOrders.map((ord: RecentOrder) => (
            <div key={ord.id} className="p-4 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{ord.user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{ord.property?.name} <span className="mx-1 font-bold">·</span> {ord.room?.room_type}</p>
                <p className="text-xs text-gray-400">{formatDate(ord.created_at)}</p>
              </div>
              
              <div className="flex flex-row-reverse sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-dashed sm:border-none border-gray-200 dark:border-slate-700">
                <span className={`inline-flex justify-center text-center text-[10px] md:text-xs font-semibold px-2.5 py-1 rounded-full ${ORDER_STATUS_SOFT_CLASSES[ord.status]}`}>
                  {getOrderStatusLabel(ord.status)}
                </span>
                <p className="text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap">
                  {formatPrice(ord.total_price)}
                </p>
              </div>
            </div>
          )) : (
            <div className="p-8 md:p-12 text-center flex flex-col items-center justify-center">
              <p className="text-gray-500 text-sm">Belum ada pesanan terbaru bulan ini.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
