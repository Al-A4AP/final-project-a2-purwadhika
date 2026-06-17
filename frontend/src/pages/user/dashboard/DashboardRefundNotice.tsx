import type { FC } from "react";
import {
  RefundNoticeContent,
  RefundNoticeLink,
} from "./DashboardRefundNoticeParts";

export const DashboardRefundNotice: FC<{ count: number }> = ({ count }) => {
  if (count === 0) return null;

  return (
    <div className="mb-8 rounded-2xl border border-orange-200 bg-orange-50 p-5 shadow-sm dark:border-orange-900/50 dark:bg-orange-900/10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <RefundNoticeContent count={count} />
        <RefundNoticeLink />
      </div>
    </div>
  );
};
