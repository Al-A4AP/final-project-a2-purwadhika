import { useEffect, useState } from "react";
import { tenantService } from "@/services/tenantService";
import type { DashboardRevenuePeriod, DashboardStats } from "@/types";
import { DEFAULT_REVENUE_PERIOD } from "./dashboardRevenuePeriod";

export const useTenantDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [revenuePeriod, setRevenuePeriod] = useState<DashboardRevenuePeriod>(DEFAULT_REVENUE_PERIOD);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  useEffect(() => {
    tenantService.getDashboard({ revenuePeriod })
      .then(setStats)
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, [revenuePeriod]);
  return { loading, revenuePeriod, setRevenuePeriod, stats };
};
