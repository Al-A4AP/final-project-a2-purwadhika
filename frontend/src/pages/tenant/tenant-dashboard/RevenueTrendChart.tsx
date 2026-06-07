import type { FC } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency } from "@/lib/formatters";

interface RevenueTrendChartProps {
  data: { label: string; amount: number }[];
}

export const RevenueTrendChart: FC<RevenueTrendChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Belum ada data pendapatan.</p>
      </div>
    );
  }

  // Calculate a reasonable Y-axis domain to make the chart look good
  const maxRevenue = Math.max(...data.map(d => d.amount));
  
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="label" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: "#94a3b8" }} 
            dy={10} 
            minTickGap={20}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: "#94a3b8" }}
            tickFormatter={(value) => {
              if (value === 0) return "Rp 0";
              if (value >= 1000000) return `Rp ${(value / 1000000).toFixed(1)}Jt`;
              if (value >= 1000) return `Rp ${(value / 1000).toFixed(0)}Rb`;
              return value.toString();
            }}
            domain={[0, maxRevenue > 0 ? 'auto' : 100000]}
          />
          <Tooltip 
            cursor={{ stroke: "#e2e8f0", strokeWidth: 2, strokeDasharray: "4 4" }}
            contentStyle={{ 
              borderRadius: "12px", 
              border: "none", 
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
              padding: "12px"
            }}
            formatter={(value) => [formatCurrency(Number(value || 0)), "Pendapatan"]}
            labelStyle={{ color: "#64748b", marginBottom: "4px", fontWeight: "bold" }}
          />
          <Area 
            type="monotone" 
            dataKey="amount" 
            stroke="#10b981" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorRevenue)" 
            activeDot={{ r: 6, strokeWidth: 0, fill: "#10b981" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
