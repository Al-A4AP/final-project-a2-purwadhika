import type { FC } from "react";
import { ChevronRight } from "lucide-react";
import type { Order } from "@/types";

export const OrderStayDates: FC<{ order: Order }> = ({ order }) => {
  const checkIn = new Date(order.check_in_date);
  const checkOut = new Date(order.check_out_date);
  return (
    <div className="mb-6 flex items-center gap-6 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50">
      <StayDate label="Check-in" value={checkIn} />
      <ChevronRight className="text-slate-300" />
      <StayDate label="Check-out" value={checkOut} />
    </div>
  );
};

const StayDate: FC<{ label: string; value: Date }> = ({ label, value }) => (
  <div>
    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
    <p className="font-medium text-slate-900 dark:text-white">{formatStayDate(value)}</p>
  </div>
);

const formatStayDate = (date: Date) =>
  date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
