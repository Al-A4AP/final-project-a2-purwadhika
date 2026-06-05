import { useState } from "react";

export const usePropertiesFilters = () => {
  const [activeSearch, setActiveSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const applySearch = () => setActiveSearch(searchQuery);
  const resetFilters = () => {
    setActiveSearch("");
    setSearchQuery("");
    setSortKey("created_at");
    setSortOrder("desc");
  };
  const setSort = (sort: string, order: "asc" | "desc") => {
    setSortKey(sort);
    setSortOrder(order);
  };
  return { activeSearch, applySearch, resetFilters, searchQuery, setSearchQuery, setSort, sortKey, sortOrder };
};
