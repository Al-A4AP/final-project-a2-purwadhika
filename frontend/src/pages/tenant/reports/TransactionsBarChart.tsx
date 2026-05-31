import type { FC } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DashboardAnalytics } from "@/services/tenantReportService";

export const TransactionsBarChart: FC<{ data: DashboardAnalytics["ordersByStatus"] }> = ({ data }) => (
  <ResponsiveContainer width="100%" height={256}><BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}><XAxis dataKey="name" stroke="#8884d8" fontSize={12} tickMargin={10} /><YAxis stroke="#8884d8" fontSize={12} allowDecimals={false} /><Tooltip cursor={{ fill: "transparent" }} contentStyle={{ borderRadius: "8px" }} /><Bar dataKey="count" fill="#FF8042" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer>
);
