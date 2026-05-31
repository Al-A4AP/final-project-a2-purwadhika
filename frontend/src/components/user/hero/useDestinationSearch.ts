import { useFilterStore } from "@/stores/filterStore";

const scrollToResults = () => {
  document
    .getElementById("results-section")
    ?.scrollIntoView({ behavior: "smooth" });
};

export const useDestinationSearch = () => {
  const filters = useFilterStore();

  return (city: string) => {
    filters.setCity(city);
    filters.applyFilters();
    scrollToResults();
  };
};
