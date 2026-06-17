import type { FC } from "react";
import { AreaChart, ResponsiveContainer } from "recharts";
import {
  EmptyRevenueTrend,
  RevenueArea,
  RevenueGradient,
  RevenueTooltip,
  RevenueXAxis,
  RevenueYAxis,
} from "./RevenueTrendChartParts";

interface RevenueTrendChartProps {
  data: { label: string; amount: number }[];
}

export const RevenueTrendChart: FC<RevenueTrendChartProps> = ({ data }) => {
  if (!data || data.length === 0) return <EmptyRevenueTrend />;

  return <RevenueTrendCanvas data={data} maxRevenue={getMaxRevenue(data)} />;
};

const RevenueTrendCanvas: FC<RevenueTrendChartProps & { maxRevenue: number }> = ({
  data,
  maxRevenue,
}) => (
  <div className="h-64 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <RevenueGradient />
        <RevenueXAxis />
        <RevenueYAxis maxRevenue={maxRevenue} />
        <RevenueTooltip />
        <RevenueArea />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

const getMaxRevenue = (data: RevenueTrendChartProps["data"]) =>
  Math.max(...data.map((item) => item.amount));
