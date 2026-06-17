import type { ChangeEvent, FC } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { UserDashboardBackLink } from "@/components/user/UserDashboardBackLink";
import type { SavedProperty } from "@/hooks/useSavedProperties";
import { SavedPropertyCard } from "./SavedPropertyCard";

export const SavedPropertiesHeader: FC = () => (
  <div>
    <div className="mb-4"><UserDashboardBackLink /></div>
    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Properti Tersimpan</h1>
    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Daftar properti yang telah Anda simpan ke wishlist untuk dibandingkan nanti.</p>
  </div>
);

export const SavedPropertiesSearch: FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => (
  <div className="relative w-full shrink-0 md:w-72">
    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
    <input type="text" placeholder="Cari properti atau kota..." value={value} onChange={toSearchChange(onChange)} className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-500" />
  </div>
);

export const SavedPropertiesGrid: FC<{
  properties: SavedProperty[];
  onRemove: (id: string) => void;
}> = ({ properties, onRemove }) => (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {properties.map((property) => <SavedPropertyCard key={property.id} property={property} onRemove={onRemove} />)}
  </div>
);

export const SavedPropertiesNoSearchResult: FC<{
  searchQuery: string;
  onClear: () => void;
}> = ({ searchQuery, onClear }) => (
  <div className="rounded-2xl border border-slate-100 bg-white py-16 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">Tidak ditemukan</h3>
    <p className="text-slate-500 dark:text-slate-400">Tidak ada properti tersimpan yang cocok dengan pencarian "{searchQuery}"</p>
    <button onClick={onClear} className="mt-6 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Hapus Pencarian</button>
  </div>
);

export const SavedPropertiesEmptyState: FC = () => (
  <div className="mt-12 rounded-2xl border border-slate-100 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <EmptyState title="Belum ada properti tersimpan" description="Anda belum menambahkan properti apa pun ke wishlist Anda. Mulai eksplorasi untuk menemukan tempat menginap impian Anda." action={<ExploreAction />} />
  </div>
);

const ExploreAction: FC = () => (
  <Link to="/explore" className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900">
    <Search className="mr-2 h-5 w-5" /> Eksplorasi Properti
  </Link>
);

const toSearchChange =
  (onChange: (value: string) => void) =>
  (event: ChangeEvent<HTMLInputElement>) =>
    onChange(event.target.value);
