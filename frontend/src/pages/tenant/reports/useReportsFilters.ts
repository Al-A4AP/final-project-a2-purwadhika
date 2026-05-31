import { useCallback, useMemo, useState } from "react";
import type { ReportsFilterActions, ReportsFilters } from "./reportsTypes";

export const useReportsFilters = () => {
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [userName, setUserName] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [reportPage, setReportPage] = useState(1);
  const resetFilters = useCallback(() => { setSelectedPropertyId(""); setSelectedStatus(""); setUserName(""); setStartDate(""); setEndDate(""); setSortBy("created_at"); setSortOrder("desc"); }, []);
  const filters = useMemo<ReportsFilters>(() => ({ endDate, reportPage, selectedPropertyId, selectedStatus, sortBy, sortOrder, startDate, userName }), [endDate, reportPage, selectedPropertyId, selectedStatus, sortBy, sortOrder, startDate, userName]);
  const actions = useMemo<ReportsFilterActions>(() => ({ resetFilters, setEndDate, setReportPage, setSelectedPropertyId, setSelectedStatus, setSortBy, setSortOrder, setStartDate, setUserName }), [resetFilters]);
  return { actions, filters };
};
