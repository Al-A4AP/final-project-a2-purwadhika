import { useEffect, useState } from "react";
import { voucherService } from "@/services/voucherService";
import type { UserVoucherSummary } from "@/types";

export const useUserVoucherSummary = () => {
  const [summary, setSummary] = useState<UserVoucherSummary | null>(null);
  useEffect(() => {
    voucherService.getUserVouchers()
      .then(setSummary)
      .catch(() => setSummary(null));
  }, []);
  return summary;
};
