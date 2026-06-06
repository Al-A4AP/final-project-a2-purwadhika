import { useReportsData } from "./useReportsData";
import { useReportsFilters } from "./useReportsFilters";

export const useReportsPageState = () => {
  const { actions, filters } = useReportsFilters();
  const data = useReportsData(filters);
  return { actions, filters, ...data };
};
