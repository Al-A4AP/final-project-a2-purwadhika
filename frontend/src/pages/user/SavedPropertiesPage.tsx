import type { FC } from "react";
import { useMemo, useState } from "react";
import { useSavedProperties } from "@/hooks/useSavedProperties";
import {
  SavedPropertiesEmptyState,
  SavedPropertiesGrid,
  SavedPropertiesHeader,
  SavedPropertiesNoSearchResult,
  SavedPropertiesSearch,
} from "./saved-properties/SavedPropertiesPageParts";

const SavedPropertiesPage: FC = () => {
  const { savedProperties, removeProperty } = useSavedProperties();
  const [searchQuery, setSearchQuery] = useState("");
  const filteredProperties = useFilteredProperties(savedProperties, searchQuery);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-900 md:p-12">
      <div className="mx-auto max-w-7xl space-y-8">
        <SavedPropertiesTopbar hasProperties={savedProperties.length > 0} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <SavedPropertiesBody savedProperties={savedProperties} filteredProperties={filteredProperties} searchQuery={searchQuery} onClearSearch={() => setSearchQuery("")} onRemove={removeProperty} />
      </div>
    </div>
  );
};

const SavedPropertiesTopbar: FC<{
  hasProperties: boolean;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}> = ({ hasProperties, searchQuery, onSearchChange }) => (
  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
    <SavedPropertiesHeader />
    {hasProperties && <SavedPropertiesSearch value={searchQuery} onChange={onSearchChange} />}
  </div>
);

const SavedPropertiesBody: FC<BodyProps> = ({
  savedProperties,
  filteredProperties,
  searchQuery,
  onClearSearch,
  onRemove,
}) => {
  if (savedProperties.length === 0) return <SavedPropertiesEmptyState />;
  if (filteredProperties.length === 0) return <SavedPropertiesNoSearchResult searchQuery={searchQuery} onClear={onClearSearch} />;
  return <SavedPropertiesGrid properties={filteredProperties} onRemove={onRemove} />;
};

interface BodyProps {
  savedProperties: ReturnType<typeof useSavedProperties>["savedProperties"];
  filteredProperties: ReturnType<typeof useSavedProperties>["savedProperties"];
  searchQuery: string;
  onClearSearch: () => void;
  onRemove: (id: string) => void;
}

const useFilteredProperties = (
  savedProperties: BodyProps["savedProperties"],
  searchQuery: string,
) =>
  useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return query ? savedProperties.filter((item) => matchesSavedProperty(item, query)) : savedProperties;
  }, [savedProperties, searchQuery]);

const matchesSavedProperty = (
  property: BodyProps["savedProperties"][number],
  query: string,
) => property.name.toLowerCase().includes(query) || property.city.toLowerCase().includes(query);

export default SavedPropertiesPage;
