import type { FC } from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Plus, Info, ChevronRight, BadgePercent } from "lucide-react";
import { tenantService } from "@/services/tenantService";
import { SectionLoading } from "@/components/common/SectionLoading";
import { ErrorState } from "@/components/common/ErrorState";
import type { TenantProperty, PaginationMeta } from "@/types";

const PeakSeasonPage: FC = () => {
  const [data, setData] = useState<{ properties: TenantProperty[]; pagination: PaginationMeta } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchProperties = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await tenantService.getProperties({ limit: 5 });
        if (isMounted) setData(response);
      } catch {
        if (isMounted) setError("Gagal memuat daftar properti");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchProperties();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 md:p-10 dark:bg-slate-900 pb-24">
      <div className="mx-auto max-w-5xl space-y-8">
        
        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Harga Musiman (Peak Season)
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Kelola kenaikan harga untuk musim liburan, akhir pekan panjang, atau event khusus secara spesifik untuk tiap tipe kamar.
            </p>
          </div>
          <div className="flex shrink-0 gap-3">
            <Link 
              to="/tenant/properties"
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              <Building2 size={16} />
              Kelola Properti
            </Link>
          </div>
        </div>

        {/* Explanation Card */}
        <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6 dark:border-blue-900/30 dark:bg-blue-900/10">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
              <Info size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-300">Cara Mengatur Harga Musiman</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-blue-800 dark:text-blue-400/90">
                Pengaturan Harga Musiman dilakukan pada tingkat <strong>Kamar</strong> untuk memberikan Anda fleksibilitas maksimal. Anda dapat menerapkan kenaikan harga secara <em>Persentase (%)</em> ataupun <em>Nominal (Rp)</em> pada rentang tanggal tertentu. Harga akhir yang dilihat pengguna akan otomatis disesuaikan saat mereka memilih tanggal inap tersebut.
              </p>
            </div>
          </div>
        </div>

        {/* Management Hub Selector */}
        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-5 dark:border-slate-800 flex items-center justify-between">
            <h2 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <BadgePercent className="text-orange-500" size={18} />
              Pilih Properti untuk Mengelola Harga
            </h2>
          </div>
          
          <div className="p-0">
            {isLoading && <div className="p-8"><SectionLoading label="Memuat properti..." /></div>}
            {error && <div className="p-8"><ErrorState title="Gagal memuat" message={error} /></div>}
            
            {data && data.properties.length === 0 && (
              <div className="p-12 text-center">
                <Building2 size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Tidak ada properti</h3>
                <p className="mt-2 text-slate-500 dark:text-slate-400">Anda belum memiliki properti. Tambahkan properti terlebih dahulu.</p>
                <Link to="/tenant/properties/new" className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
                  <Plus size={16} /> Tambah Properti Baru
                </Link>
              </div>
            )}

            {data && data.properties.length > 0 && (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {data.properties.map((property: TenantProperty) => (
                  <div key={property.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 transition hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                        <img 
                          src={property.featured_image_url || "https://via.placeholder.com/150?text=Property"} 
                          alt={property.name} 
                          className="h-full w-full object-cover" 
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">{property.name}</h4>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{property.address}</p>
                      </div>
                    </div>
                    <Link 
                      to={`/tenant/properties/${property.id}/rooms`}
                      className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
                    >
                      Kelola Kamar & Harga
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                ))}
              </div>
            )}
            
            {data && data.properties.length > 0 && (data.pagination?.totalPages ?? 0) > 1 && (
              <div className="border-t border-slate-100 bg-slate-50/50 p-4 text-center dark:border-slate-800 dark:bg-slate-800/20">
                <Link to="/tenant/properties" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  Lihat Semua Properti
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeakSeasonPage;
