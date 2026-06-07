import { useCallback, useEffect, useState } from "react";
import { getApiErrorMessage } from "@/lib/errorMessage";
import { tenantService } from "@/services/tenantService";
import type { PropertyCategory } from "@/types";
import type { PeakSeasonPropertyData } from "./peakSeasonTypes";

export const usePeakSeasonProperties = (params: PeakSeasonPropertyParams) => {
  const [categories, setCategories] = useState<PropertyCategory[]>([]);
  const [data, setData] = useState<PeakSeasonPropertyData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fetchProperties = useFetchProperties(params, setData, setError, setIsLoading);
  useEffect(() => { void fetchProperties(); }, [fetchProperties]);
  useEffect(() => { void loadCategories(setCategories); }, []);
  return { categories, data, error, isLoading, refetchProperties: fetchProperties };
};

const useFetchProperties = (
  params: PeakSeasonPropertyParams,
  setData: (data: PeakSeasonPropertyData | null) => void,
  setError: (error: string | null) => void,
  setLoading: (loading: boolean) => void,
) => useCallback(async () => {
  setLoading(true);
  setError(null);
  try { setData(await tenantService.getProperties(params)); }
  catch (err) { setError(getApiErrorMessage(err, "Daftar properti belum bisa dimuat.")); }
  finally { setLoading(false); }
}, [params, setData, setError, setLoading]);

const loadCategories = async (setCategories: (categories: PropertyCategory[]) => void) => {
  try { setCategories((await tenantService.getCategories({ limit: 50, sortBy: "name", sortOrder: "asc" })).categories); }
  catch { setCategories([]); }
};

export interface PeakSeasonPropertyParams {
  categoryId?: string;
  limit: number;
  page: number;
  search?: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}
