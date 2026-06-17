import type { FC } from "react";
import { Area, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency } from "@/lib/formatters";

export const EmptyRevenueTrend: FC = () => (
  <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Belum ada data pendapatan.</p>
  </div>
);

export const RevenueGradient: FC = () => (
  <defs>
    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
    </linearGradient>
  </defs>
);

export const RevenueXAxis: FC = () => (
  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} dy={10} minTickGap={20} />
);

export const RevenueYAxis: FC<{ maxRevenue: number }> = ({ maxRevenue }) => (
  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} tickFormatter={formatAxisCurrency} domain={[0, maxRevenue > 0 ? "auto" : 100000]} />
);

export const RevenueTooltip: FC = () => (
  <Tooltip cursor={TOOLTIP_CURSOR} contentStyle={TOOLTIP_STYLE} formatter={formatTooltipValue} labelStyle={LABEL_STYLE} />
);

export const RevenueArea: FC = () => (
  <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" activeDot={{ r: 6, strokeWidth: 0, fill: "#10b981" }} />
);

const formatAxisCurrency = (value: number) => {
  if (value === 0) return "Rp 0";
  if (value >= 1000000) return `Rp ${(value / 1000000).toFixed(1)}Jt`;
  if (value >= 1000) return `Rp ${(value / 1000).toFixed(0)}Rb`;
  return value.toString();
};

const formatTooltipValue = (value: unknown) => [formatCurrency(Number(value || 0)), "Pendapatan"];

const TOOLTIP_CURSOR = { stroke: "#e2e8f0", strokeWidth: 2, strokeDasharray: "4 4" };
const TOOLTIP_STYLE = { borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)", padding: "12px" };
const LABEL_STYLE = { color: "#64748b", marginBottom: "4px", fontWeight: "bold" };
