import { useState, type Dispatch, type SetStateAction } from "react";
import { useExploreQueryFilters } from "@/hooks/user/home/useExploreQueryFilters";
import { useHomePageState } from "@/hooks/user/home/useHomePageState";

export const useExplorePageState = () => {
  useExploreQueryFilters();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const page = useHomePageState({ detectInitialCity: false });
  return buildExploreState(page, { setFiltersOpen, filtersOpen });
};

const buildExploreState = (page: HomePageState, filter: FilterState) => ({
  ...page,
  closeFilters: () => filter.setFiltersOpen(false),
  currentOrder: (page.activeFilters.order as "asc" | "desc") || "desc",
  currentSort: page.activeFilters.sort || "created_at",
  filtersOpen: filter.filtersOpen,
  toggleFilters: () => filter.setFiltersOpen((open) => !open),
});

type HomePageState = ReturnType<typeof useHomePageState>;
type SetFiltersOpen = Dispatch<SetStateAction<boolean>>;
type FilterState = { filtersOpen: boolean; setFiltersOpen: SetFiltersOpen };
export type ExplorePageState = ReturnType<typeof useExplorePageState>;
