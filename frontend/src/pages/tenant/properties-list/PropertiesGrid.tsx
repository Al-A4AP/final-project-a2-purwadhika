import type { FC } from "react";
import type { TenantProperty } from "@/types";
import { PropertyCard } from "@/components/tenant/PropertyCard";

interface PropertiesGridProps {
  deletingId: string | null;
  onDelete: (id: string, name: string) => void;
  properties: TenantProperty[];
}

export const PropertiesGrid: FC<PropertiesGridProps> = ({ deletingId, onDelete, properties }) => (
  <div className="space-y-4">
    {properties.map((property) => <PropertyCard key={property.id} property={property} deletingId={deletingId} onDelete={onDelete} />)}
  </div>
);
