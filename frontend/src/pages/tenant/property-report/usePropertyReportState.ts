import { useCallback, useEffect, useState } from "react";
import { getApiErrorMessage } from "@/lib/errorMessage";
import { tenantReportService, type OccupancyProperty } from "@/services/tenantReportService";

export const usePropertyReportState = () => {
  const [data, setData] = useState<OccupancyProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refetch = useFetchData(setData, setLoading, setError);
  useEffect(() => { Promise.resolve().then(() => refetch()); }, [refetch]);
  return { data, error, loading, refetch };
};

const useFetchData = (
  setData: (data: OccupancyProperty[]) => void,
  setLoading: (v: boolean) => void,
  setError: (v: string | null) => void,
) => useCallback(() => {
  setLoading(true);
  setError(null);
  tenantReportService.getOccupancyCalendar()
    .then((data) => { setData(data); setError(null); })
    .catch((err) => setError(getApiErrorMessage(err, "Laporan properti belum bisa dimuat. Coba lagi sebentar.")))
    .finally(() => setLoading(false));
}, [setData, setError, setLoading]);

export type PropertyReportState = ReturnType<typeof usePropertyReportState>;
