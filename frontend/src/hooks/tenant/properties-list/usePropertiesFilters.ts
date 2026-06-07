import { useState } from "react";

export const usePropertiesFilters = () => {
  const [activeSearch, setActiveSearch] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const applySearch = () => applyFilters(searchQuery, categoryId, setActiveSearch, setActiveCategoryId);
  const resetFilters = () => resetFilterState({ setActiveCategoryId, setActiveSearch, setCategoryId, setSearchQuery, setSortKey, setSortOrder });
  const setSort = (sort: string, order: "asc" | "desc") => setSortState(sort, order, setSortKey, setSortOrder);
  return { activeCategoryId, activeSearch, applySearch, categoryId, resetFilters, searchQuery, setCategoryId, setSearchQuery, setSort, sortKey, sortOrder };
};

const applyFilters = (search: string, categoryId: string, setSearch: SetString, setCategory: SetString) => {
  setSearch(search);
  setCategory(categoryId);
};

const setSortState = (sort: string, order: "asc" | "desc", setSortKey: SetString, setSortOrder: SetSortOrder) => {
  setSortKey(sort);
  setSortOrder(order);
};

const resetFilterState = (actions: ResetActions) => {
  actions.setActiveCategoryId("");
  actions.setActiveSearch("");
  actions.setCategoryId("");
  actions.setSearchQuery("");
  setSortState("created_at", "desc", actions.setSortKey, actions.setSortOrder);
};

type SetString = (value: string) => void;
type SetSortOrder = (value: "asc" | "desc") => void;

interface ResetActions {
  setActiveCategoryId: SetString;
  setActiveSearch: SetString;
  setCategoryId: SetString;
  setSearchQuery: SetString;
  setSortKey: SetString;
  setSortOrder: SetSortOrder;
}
