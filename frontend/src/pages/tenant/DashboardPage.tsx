import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, BedDouble, Clock, TrendingUp, Plus } from 'lucide-react';
import { tenantService } from '@/services/tenantService';
import type { DashboardStats, RecentOrder } from '@/types';
import { formatPrice, formatDate } from '@/lib/formatters';

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  WAITING_PAYMENT: { label: 'Menunggu Pembayaran', color: 'text-yellow-600 bg-yellow-50' },
  WAITING_CONFIRMATION: { label: 'Menunggu Konfirmasi', color: 'text-blue-600 bg-blue-50' },
  PROCESSED: { label: 'Diproses', color: 'text-green-600 bg-green-50' },
  CANCELLED: { label: 'Dibatalkan', color: 'text-red-600 bg-red-50' },
};

interface StatCardProps {
  icon: FC<{ size?: number; className?: string }>;
  label: string;
  value: string | number;
  color: string;
}

const StatCard: FC<StatCardProps> = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border dark:border-slate-700">
    <div className="flex items-center justify-between mb-4">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <div className={`p-2 rounded-lg ${color}`}><Icon size={20} /></div>
    </div>
    <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
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
    <div className="p-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => <div key={i} className="h-28 rounded-xl bg-gray-200 dark:bg-slate-700 animate-pulse" />)}
    </div>
  );

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Selamat datang kembali, kelola properti Anda</p>
        </div>
        <Link to="/tenant/properties/new"
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition"
        >
          <Plus size={16} /> Tambah Properti
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Building2} label="Total Properti" value={stats?.propertyCount || 0} color="text-blue-600 bg-blue-50 dark:bg-blue-900/20" />
        <StatCard icon={BedDouble} label="Total Kamar" value={stats?.roomCount || 0} color="text-purple-600 bg-purple-50 dark:bg-purple-900/20" />
        <StatCard icon={Clock} label="Perlu Konfirmasi" value={stats?.pendingOrders || 0} color="text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20" />
        <StatCard icon={TrendingUp} label="Pendapatan Bulan Ini" value={formatPrice(stats?.monthlyRevenue || 0)} color="text-green-600 bg-green-50 dark:bg-green-900/20" />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700">
        <div className="p-6 border-b dark:border-slate-700 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 dark:text-white">Pesanan Terbaru</h2>
          <Link to="/tenant/orders" className="text-sm text-red-600 hover:underline">Lihat semua</Link>
        </div>
        <div className="divide-y dark:divide-slate-700">
          {stats?.recentOrders?.length ? stats.recentOrders.map((ord: RecentOrder) => (
            <div key={ord.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{ord.user?.name}</p>
                <p className="text-xs text-gray-500">{ord.property?.name} · {ord.room?.room_type}</p>
                <p className="text-xs text-gray-400">{formatDate(ord.created_at)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{formatPrice(ord.total_price)}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${STATUS_MAP[ord.status]?.color}`}>
                  {STATUS_MAP[ord.status]?.label}
                </span>
              </div>
            </div>
          )) : (
            <p className="p-6 text-center text-gray-500 text-sm">Belum ada pesanan</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
