import type { FC } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { getOrderStatusLabel } from '@/lib/orderStatus';

interface StatusItem {
  name: string;
  count: number;
}

interface OrderStatusPieChartProps {
  data: StatusItem[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#EF4444'];

const LegendItem: FC<{ item: StatusItem; color: string }> = ({ item, color }) => (
  <div className="flex min-w-0 items-center gap-2 rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs dark:bg-slate-900">
    <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: color }} />
    <span className="min-w-0 wrap-break-word text-gray-600 dark:text-gray-400">
      {getOrderStatusLabel(item.name)} ({item.count})
    </span>
  </div>
);

export const OrderStatusPieChart: FC<OrderStatusPieChartProps> = ({ data }) => {
  if (!data.length) {
    return <p className="py-12 text-center text-sm text-gray-500">Belum ada data status pesanan.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={getChartData(data)} cx="50%" cy="50%" outerRadius={80} dataKey="count" label={false}>
              {data.map((item, i) => <Cell key={item.name} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {data.map((item, i) => (
          <LegendItem key={item.name} item={item} color={COLORS[i % COLORS.length]} />
        ))}
      </div>
    </div>
  );
};

const getChartData = (data: StatusItem[]) =>
  data.map((item) => ({ ...item, name: getOrderStatusLabel(item.name) }));
