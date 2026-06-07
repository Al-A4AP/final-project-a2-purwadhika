import type { FC } from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "@/components/common/EmptyState";
import { Search } from "lucide-react";
import { useSavedProperties } from "@/hooks/useSavedProperties";
import { SavedPropertyCard } from "./saved-properties/SavedPropertyCard";
import { useState, useMemo } from "react";
import { UserDashboardBackLink } from "@/components/user/UserDashboardBackLink";

const SavedPropertiesPage: FC = () => {
  const { savedProperties, removeProperty } = useSavedProperties();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProperties = useMemo(() => {
    if (!searchQuery.trim()) return savedProperties;
    const query = searchQuery.toLowerCase();
    return savedProperties.filter(
      p => p.name.toLowerCase().includes(query) || p.city.toLowerCase().includes(query)
    );
  }, [savedProperties, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 md:p-12 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="mb-4">
              <UserDashboardBackLink />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Properti Tersimpan</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Daftar properti yang telah Anda simpan ke wishlist untuk dibandingkan nanti.</p>
          </div>
          
          {savedProperties.length > 0 && (
            <div className="relative w-full md:w-72 shrink-0">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari properti atau kota..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-500"
              />
            </div>
          )}
        </div>

        {savedProperties.length > 0 ? (
          filteredProperties.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
               {filteredProperties.map((property) => (
                 <SavedPropertyCard 
                   key={property.id} 
                   property={property} 
                   onRemove={removeProperty} 
                 />
               ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-100 bg-white py-16 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">Tidak ditemukan</h3>
              <p className="text-slate-500 dark:text-slate-400">Tidak ada properti tersimpan yang cocok dengan pencarian "{searchQuery}"</p>
              <button 
                onClick={() => setSearchQuery("")}
                className="mt-6 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Hapus Pencarian
              </button>
            </div>
          )
        ) : (
          <div className="mt-12 rounded-2xl border border-slate-100 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <EmptyState 
              title="Belum ada properti tersimpan" 
              description="Anda belum menambahkan properti apa pun ke wishlist Anda. Mulai eksplorasi untuk menemukan tempat menginap impian Anda."
              action={
                <Link to="/explore" className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900">
                  <Search className="mr-2 h-5 w-5"/> Eksplorasi Properti
                </Link>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPropertiesPage;
