import { useEffect, useState } from "react";
import { tenantService } from "@/services/tenantService";
import type { DashboardStats } from "@/types";

export const useTenantDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  useEffect(() => {
    tenantService.getDashboard()
      .then(setStats)
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);
  return { loading, stats };
};
