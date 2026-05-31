import type { FC, KeyboardEvent } from "react";

interface PropertiesSearchBarProps {
  applySearch: () => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

const submitOnEnter = (event: KeyboardEvent<HTMLInputElement>, applySearch: () => void) => {
  if (event.key === "Enter") applySearch();
};

export const PropertiesSearchBar: FC<PropertiesSearchBarProps> = ({ applySearch, searchQuery, setSearchQuery }) => (
  <div className="flex max-w-md flex-1 gap-2">
    <input type="text" placeholder="Cari nama properti, alamat atau kota..." value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} onKeyDown={(event) => submitOnEnter(event, applySearch)} className="flex-1 rounded-lg border bg-white px-4 py-2 text-sm text-gray-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
    <button onClick={applySearch} className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white transition hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600">Cari</button>
  </div>
);
