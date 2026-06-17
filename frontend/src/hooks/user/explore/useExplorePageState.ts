import { useCallback, useState, type Dispatch, type SetStateAction } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useExploreQueryFilters } from "@/hooks/user/home/useExploreQueryFilters";
import { useHomePageState } from "@/hooks/user/home/useHomePageState";
import { useFilterStore } from "@/stores/filterStore";
import { buildExploreUrl } from "./exploreQueryUrl";

export const useExplorePageState = () => {
  useExploreQueryFilters();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const closeFilters = useExploreFilterClose(setFiltersOpen);
  const page = useHomePageState({ detectInitialCity: false });
  return buildExploreState(page, { closeFilters, setFiltersOpen, filtersOpen });
};

const buildExploreState = (page: HomePageState, filter: FilterState) => ({
  ...page,
  closeFilters: filter.closeFilters,
  currentOrder: (page.activeFilters.order as "asc" | "desc") || "desc",
  currentSort: page.activeFilters.sort || "created_at",
  filtersOpen: filter.filtersOpen,
  toggleFilters: () => filter.setFiltersOpen((open) => !open),
});

const useExploreFilterClose = (setFiltersOpen: SetFiltersOpen) => {
  const location = useLocation();
  const navigate = useNavigate();
  return useCallback(() => {
    setFiltersOpen(false);
    syncExploreUrl(location, navigate);
  }, [location, navigate, setFiltersOpen]);
};

const syncExploreUrl = (location: LocationState, navigate: NavigateFunction) => {
  const nextUrl = buildExploreUrl(useFilterStore.getState().activeFilters);
  const currentUrl = `${location.pathname}${location.search}`;
  if (currentUrl !== nextUrl) navigate(nextUrl, { replace: location.pathname === "/explore" });
};

type HomePageState = ReturnType<typeof useHomePageState>;
type SetFiltersOpen = Dispatch<SetStateAction<boolean>>;
type NavigateFunction = ReturnType<typeof useNavigate>;
type LocationState = ReturnType<typeof useLocation>;
type FilterState = {
  closeFilters: () => void;
  filtersOpen: boolean;
  setFiltersOpen: SetFiltersOpen;
};
export type ExplorePageState = ReturnType<typeof useExplorePageState>;
