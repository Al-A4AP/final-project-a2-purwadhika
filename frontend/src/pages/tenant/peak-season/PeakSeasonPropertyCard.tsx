import type { FC } from "react";
import { ChevronDown, ChevronUp, MapPin } from "lucide-react";
import type { PeakSeasonPageState } from "@/hooks/tenant/peak-season/peakSeasonTypes";
import type { TenantProperty } from "@/types";
import { amenityLabel, propertyPriceLabel } from "./peakSeasonFormat";
import { PeakSeasonRoomList } from "./PeakSeasonRoomList";

export const PeakSeasonPropertyCard: FC<PeakSeasonPropertyCardProps> = ({ property, state }) => {
  const isOpen = state.roomActions.expandedPropertyId === property.id;
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <PropertySummary isOpen={isOpen} property={property} onToggle={() => state.roomActions.toggleProperty(property.id)} />
      {isOpen && <PeakSeasonRoomList property={property} state={state} />}
    </article>
  );
};

const PropertySummary: FC<PropertySummaryProps> = ({ isOpen, onToggle, property }) => (
  <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
    <div className="flex min-w-0 gap-4">
      <PropertyImage property={property} />
      <PropertyMeta property={property} />
    </div>
    <button type="button" onClick={onToggle} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
      {isOpen ? "Tutup Kamar" : "Kelola Harga"}
      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
    </button>
  </div>
);

const PropertyImage: FC<{ property: TenantProperty }> = ({ property }) => (
  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
    <img src={property.featured_image_url || "https://via.placeholder.com/160?text=Property"} alt={property.name} className="h-full w-full object-cover" />
  </div>
);

const PropertyMeta: FC<{ property: TenantProperty }> = ({ property }) => (
  <div className="min-w-0">
    <div className="flex flex-wrap items-center gap-2">
      <h2 className="truncate text-lg font-bold text-slate-900 dark:text-white">{property.name}</h2>
      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{property.category?.name || "Tanpa kategori"}</span>
    </div>
    <p className="mt-1 flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400"><MapPin size={14} /> {property.city}</p>
    <p className="mt-2 text-sm font-semibold text-orange-600 dark:text-orange-300">{propertyPriceLabel(property)}</p>
    <AmenitySummary amenities={property.amenities || []} />
  </div>
);

const AmenitySummary: FC<{ amenities: string[] }> = ({ amenities }) => (
  amenities.length ? <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Fasilitas: {amenities.slice(0, 4).map(amenityLabel).join(", ")}</p> : null
);

interface PeakSeasonPropertyCardProps {
  property: TenantProperty;
  state: PeakSeasonPageState;
}

interface PropertySummaryProps {
  isOpen: boolean;
  onToggle: () => void;
  property: TenantProperty;
}
