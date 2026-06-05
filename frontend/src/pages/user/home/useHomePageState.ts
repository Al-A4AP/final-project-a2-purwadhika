import { usePropertyPageLimit } from "@/hooks/usePropertyPageLimit";
import { useFilterStore } from "@/stores/filterStore";
import { useActiveHomeFilters, useHasFilterChanges } from "./useHomeFilters";
import { useHomeProperties } from "./useHomeProperties";
import { useInitialCityDetection } from "./useInitialCityDetection";

interface UseHomePageStateOptions {
  detectInitialCity?: boolean;
}

export const useHomePageState = (options: UseHomePageStateOptions = {}) => {
  const filters = useFilterStore();
  const propertyLimit = usePropertyPageLimit();
  const activeFilters = useActiveHomeFilters(filters);
  const hasFilterChanges = useHasFilterChanges(filters, activeFilters);
  const propertyState = useHomeProperties(activeFilters, propertyLimit);
  useInitialCityDetection(options.detectInitialCity !== false);
  return { activeFilters, hasFilterChanges, propertyLimit, propertyState };
};
