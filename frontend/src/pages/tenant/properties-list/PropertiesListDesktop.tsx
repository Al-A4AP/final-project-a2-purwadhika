import type { FC } from "react";
import type { PropertiesListViewProps, PropertyItemProps, PropertyOnlyProps } from "./propertiesListTypes";
import {
  CreatedAtInfo,
  DeletePropertyButton,
  EditPropertyLink,
  MinPriceInfo,
  PropertyCategoryBadge,
  PropertyImage,
  PropertyLocationMeta,
  RoomCountInfo,
  RoomsLink,
} from "./PropertiesListParts";
import { getMinRoomPrice } from "./propertiesListHelpers";

export const DesktopPropertiesTable: FC<PropertiesListViewProps> = ({ properties, deletingId, onDelete }) => (
  <div className="hidden md:block overflow-x-auto">
    <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
      <DesktopTableHead />
      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
        {properties.map((property) => (
          <DesktopPropertyRow key={property.id} deletingId={deletingId} onDelete={onDelete} property={property} />
        ))}
      </tbody>
    </table>
  </div>
);

const DesktopTableHead: FC = () => (
  <thead className="border-b border-slate-100 bg-slate-50/50 text-xs uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
    <tr>
      <th scope="col" className="px-6 py-4 font-semibold">Properti</th>
      <th scope="col" className="px-6 py-4 font-semibold">Status / Info</th>
      <th scope="col" className="px-6 py-4 font-semibold">Aksi</th>
    </tr>
  </thead>
);

const DesktopPropertyRow: FC<PropertyItemProps> = ({ property, deletingId, onDelete }) => (
  <tr className="transition hover:bg-slate-50 dark:hover:bg-slate-800/50">
    <td className="px-6 py-4"><DesktopPropertyIdentity property={property} /></td>
    <td className="px-6 py-4"><DesktopPropertyInfo property={property} /></td>
    <td className="px-6 py-4"><DesktopPropertyActions deletingId={deletingId} onDelete={onDelete} property={property} /></td>
  </tr>
);

const DesktopPropertyIdentity: FC<PropertyOnlyProps> = ({ property }) => (
  <div className="flex items-center gap-4">
    <PropertyImage className="h-16 w-16 rounded-xl" property={property} />
    <div>
      <div className="flex items-center gap-2 mb-1">
        <span className="font-bold text-slate-900 dark:text-white text-base">{property.name}</span>
        <PropertyCategoryBadge name={property.category?.name} />
      </div>
      <PropertyLocationMeta property={property} />
    </div>
  </div>
);

const DesktopPropertyInfo: FC<PropertyOnlyProps> = ({ property }) => {
  const minPrice = getMinRoomPrice(property);
  return (
    <div className="space-y-1.5">
      <RoomCountInfo property={property} />
      {minPrice !== null && <MinPriceInfo minPrice={minPrice} />}
      <CreatedAtInfo property={property} />
    </div>
  );
};

const DesktopPropertyActions: FC<PropertyItemProps> = ({ property, deletingId, onDelete }) => (
  <div className="flex items-center gap-2">
    <RoomsLink property={property} />
    <EditPropertyLink property={property} />
    <DeletePropertyButton deletingId={deletingId} onDelete={onDelete} property={property} />
  </div>
);
