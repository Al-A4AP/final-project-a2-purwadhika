import { useCallback, useEffect, useMemo, useState } from "react";
import { getApiErrorMessage } from "@/lib/errorMessage";
import { propertyService } from "@/services/propertyService";
import type { FilterValues } from "@/stores/filterStore";
import type { Property } from "@/types";

export const useHomeProperties = (activeFilters: FilterValues, propertyLimit: number) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const setters = useHomePropertySetters(setLoading, setProperties, setTotalCount, setTotalPages, setError);
  const retry = useCallback(() => setReloadToken((value) => value + 1), []);

  useHomePropertyFetch(activeFilters, propertyLimit, reloadToken, setters);
  return { error, loading, properties, retry, totalCount, totalPages };
};

const useHomePropertyFetch = (
  activeFilters: FilterValues,
  propertyLimit: number,
  reloadToken: number,
  setters: HomePropertySetters,
) => {
  useEffect(() => {
    let mounted = true;
    fetchHomeProperties(activeFilters, propertyLimit, () => mounted, setters);
    return () => { mounted = false; };
  }, [activeFilters, propertyLimit, reloadToken, setters]);
};

type PropertyResult = Awaited<ReturnType<typeof propertyService.getProperties>>;

interface HomePropertySetters {
  setError: (value: string | null) => void;
  setLoading: (value: boolean) => void;
  setProperties: (items: Property[]) => void;
  setTotalCount: (value: number) => void;
  setTotalPages: (value: number) => void;
}

const useHomePropertySetters = (
  setLoading: (value: boolean) => void,
  setProperties: (items: Property[]) => void,
  setTotalCount: (value: number) => void,
  setTotalPages: (value: number) => void,
  setError: (value: string | null) => void,
) => useMemo(
  () => ({ setError, setLoading, setProperties, setTotalCount, setTotalPages }),
  [setError, setLoading, setProperties, setTotalCount, setTotalPages],
);

const fetchHomeProperties = async (
  activeFilters: FilterValues,
  propertyLimit: number,
  isMounted: () => boolean,
  setters: HomePropertySetters,
) => {
  setters.setLoading(true);
  setters.setError(null);
  try {
    const result = await propertyService.getProperties({ ...activeFilters, limit: propertyLimit });
    updatePropertyState(result, isMounted(), setters);
  } catch (err) {
    if (isMounted()) handlePropertyError(err, setters);
  } finally {
    if (isMounted()) setters.setLoading(false);
  }
};

const updatePropertyState = (
  result: PropertyResult,
  mounted: boolean,
  setters: HomePropertySetters,
) => {
  if (!mounted) return;
  setters.setError(null);
  setters.setProperties(result.items);
  setters.setTotalCount(result.pagination?.total || 0);
  setters.setTotalPages(result.pagination?.pages || 1);
};

const handlePropertyError = (err: unknown, setters: HomePropertySetters) => {
  setters.setError(getApiErrorMessage(err, "Daftar properti belum bisa dimuat. Periksa koneksi lalu coba lagi."));
  setters.setProperties([]);
  setters.setTotalCount(0);
  setters.setTotalPages(1);
};
