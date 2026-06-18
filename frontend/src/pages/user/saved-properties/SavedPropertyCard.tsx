import type { FC } from "react";
import type { SavedProperty } from "@/hooks/useSavedProperties";
import { SavedPropertyActions, SavedPropertyImage, SavedPropertyInfo, SavedPropertyPrice } from "./SavedPropertyCardParts";

interface SavedPropertyCardProps {
  property: SavedProperty;
  onRemove: (id: string) => void;
}

export const SavedPropertyCard: FC<SavedPropertyCardProps> = ({ property, onRemove }) => (
  <div className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:bg-slate-800">
    <SavedPropertyImage property={property} />
    <div className="p-5"><SavedPropertyInfo property={property} /><SavedPropertyPrice price={property.min_price} /><SavedPropertyActions id={property.id} onRemove={onRemove} /></div>
  </div>
);
