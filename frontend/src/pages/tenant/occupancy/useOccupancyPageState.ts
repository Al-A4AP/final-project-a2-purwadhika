import { useCallback, useEffect, useState } from "react";
import { getApiErrorMessage } from "@/lib/errorMessage";
import { tenantReportService, type OccupancyProperty } from "@/services/tenantReportService";

export const useOccupancyPageState = () => {
  const [data, setData] = useState<OccupancyProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refetch = useFetchOccupancy(setData, setLoading, setError);
  useEffect(() => { refetch(); }, [refetch]);
  return { data, error, loading, refetch };
};

const useFetchOccupancy = (
  setData: (data: OccupancyProperty[]) => void,
  setLoading: (loading: boolean) => void,
  setError: (error: string | null) => void,
) => useCallback(() => {
  setLoading(true);
  setError(null);
  tenantReportService.getOccupancyCalendar()
    .then((data) => { setData(data); setError(null); })
    .catch((err) => setError(getApiErrorMessage(err, "Kalender okupasi belum bisa dimuat. Coba lagi sebentar.")))
    .finally(() => setLoading(false));
}, [setData, setError, setLoading]);

export type OccupancyPageState = ReturnType<typeof useOccupancyPageState>;
