import { useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { getSortParams, PEAK_PROPERTY_LIMIT, type PeakSortValue } from "./peakSeasonOptions";
import type { PeakSeasonFilters, PeakSeasonPropertyActions } from "./peakSeasonTypes";

export const usePeakSeasonFilters = () => {
  const [categoryId, setCategoryIdState] = useState("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sortOption, setSortOptionState] = useState<PeakSortValue>("name-asc");
  const filters = useMemo<PeakSeasonFilters>(() => ({ categoryId, page, search, searchInput, sortOption }), [categoryId, page, search, searchInput, sortOption]);
  const params = useMemo(() => buildPropertyParams(filters), [filters]);
  const actions = useFilterActions(searchInput, { setCategoryIdState, setPage, setSearch, setSearchInput, setSortOptionState });
  return { actions, filters, params };
};

const useFilterActions = (searchInput: string, setters: FilterSetters): PeakSeasonPropertyActions => ({
  applySearch: () => { setters.setSearch(searchInput.trim()); setters.setPage(1); },
  resetFilters: () => { setters.setCategoryIdState(""); setters.setPage(1); setters.setSearch(""); setters.setSearchInput(""); setters.setSortOptionState("name-asc"); },
  setCategoryId: (value) => { setters.setCategoryIdState(value); setters.setPage(1); },
  setPage: setters.setPage,
  setSearchInput: setters.setSearchInput,
  setSortOption: (value) => { setters.setSortOptionState(value); setters.setPage(1); },
});

const buildPropertyParams = (filters: PeakSeasonFilters) => {
  const sort = getSortParams(filters.sortOption);
  return { categoryId: filters.categoryId, limit: PEAK_PROPERTY_LIMIT, page: filters.page, search: filters.search, ...sort };
};

interface FilterSetters {
  setCategoryIdState: Dispatch<SetStateAction<string>>;
  setPage: Dispatch<SetStateAction<number>>;
  setSearch: Dispatch<SetStateAction<string>>;
  setSearchInput: Dispatch<SetStateAction<string>>;
  setSortOptionState: Dispatch<SetStateAction<PeakSortValue>>;
}
