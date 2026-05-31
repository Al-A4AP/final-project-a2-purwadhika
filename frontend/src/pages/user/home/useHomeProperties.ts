import { useEffect, useMemo, useState } from "react";
import { propertyService } from "@/services/propertyService";
import type { FilterValues } from "@/stores/filterStore";
import type { Property } from "@/types";

export const useHomeProperties = (activeFilters: FilterValues, propertyLimit: number) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const setters = useHomePropertySetters(setLoading, setProperties, setTotalCount, setTotalPages);

  useHomePropertyFetch(activeFilters, propertyLimit, setters);
  return { properties, loading, totalCount, totalPages };
};

const useHomePropertyFetch = (
  activeFilters: FilterValues,
  propertyLimit: number,
  setters: HomePropertySetters,
) => {
  useEffect(() => {
    let mounted = true;
    fetchHomeProperties(activeFilters, propertyLimit, () => mounted, setters);
    return () => { mounted = false; };
  }, [activeFilters, propertyLimit, setters]);
};

type PropertyResult = Awaited<ReturnType<typeof propertyService.getProperties>>;

interface HomePropertySetters {
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
) => useMemo(
  () => ({ setLoading, setProperties, setTotalCount, setTotalPages }),
  [setLoading, setProperties, setTotalCount, setTotalPages],
);

const fetchHomeProperties = async (
  activeFilters: FilterValues,
  propertyLimit: number,
  isMounted: () => boolean,
  setters: HomePropertySetters,
) => {
  setters.setLoading(true);
  try {
    const result = await propertyService.getProperties({ ...activeFilters, limit: propertyLimit });
    updatePropertyState(result, isMounted(), setters);
  } catch {
    if (isMounted()) setters.setProperties([]);
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
  setters.setProperties(result.items);
  setters.setTotalCount(result.pagination?.total || 0);
  setters.setTotalPages(result.pagination?.pages || 1);
};
