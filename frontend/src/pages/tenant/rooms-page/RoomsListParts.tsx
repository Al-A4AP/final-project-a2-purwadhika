import type { FC } from "react";
import { Pencil, Trash2, CalendarDays, Users, BedDouble } from "lucide-react";
import { formatPrice } from "@/lib/formatters";
import { getRoomImageUrl, getRoomTitle } from "./roomsListHelpers";
import type { RoomActionProps, RoomOnlyProps } from "./roomsListTypes";

export const RoomImage: FC<RoomOnlyProps & { className: string }> = ({ room, className }) => (
  <div className={`shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-800 ${className}`}>
    <img src={getRoomImageUrl(room)} alt={room.room_type} className="h-full w-full object-cover" loading="lazy" />
  </div>
);

export const RoomTitle: FC<RoomOnlyProps & { className?: string }> = ({ room, isWholeUnit, className = "" }) => (
  <span className={className}>{getRoomTitle(room, isWholeUnit)}</span>
);

export const MobileRoomPriceCapacity: FC<RoomOnlyProps> = ({ room }) => (
  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
    <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">{formatPrice(room.base_price)}</span>
    <span className="flex items-center gap-1"><Users size={12} /> {room.capacity} Orang</span>
  </div>
);

export const MobileRoomQuantity: FC<RoomOnlyProps> = ({ room }) => (
  <span className="flex items-center gap-1 text-xs font-medium text-slate-500">
    <BedDouble size={12} /> {room.quantity} Kamar
  </span>
);

export const DesktopRoomStock: FC<RoomOnlyProps> = ({ room }) => (
  <div className="flex items-center gap-2 text-xs text-slate-500">
    <BedDouble size={12} className="text-slate-400" />
    <span>Stok: {room.quantity} Kamar</span>
  </div>
);

export const DesktopRoomPriceCapacity: FC<RoomOnlyProps> = ({ room }) => (
  <div className="space-y-1.5">
    <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{formatPrice(room.base_price)} / malam</div>
    <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
      <Users size={14} className="text-slate-400" /> Maksimal {room.capacity} Orang
    </div>
  </div>
);

export const EditRoomButton: FC<RoomActionProps & { desktop?: boolean }> = ({ room, handleEdit, desktop = false }) => (
  <button onClick={() => handleEdit?.(room)} className={desktop ? desktopEditButtonClass : mobileEditButtonClass} title={desktop ? "Edit Kamar" : undefined}>
    <Pencil size={14} />
  </button>
);

export const DeleteRoomButton: FC<RoomActionProps & { desktop?: boolean }> = ({ room, onDelete, desktop = false }) => (
  <button onClick={() => onDelete?.(room.id)} className={desktop ? desktopDeleteButtonClass : mobileDeleteButtonClass} title={desktop ? "Hapus Kamar" : undefined}>
    <Trash2 size={14} />
  </button>
);

export const AvailabilityButton: FC<RoomActionProps & { mobile?: boolean }> = ({ room, handleOpenAvailModal, mobile = false }) => (
  <button onClick={() => handleOpenAvailModal?.(room.id)} className={mobile ? mobileAvailabilityButtonClass : desktopAvailabilityButtonClass}>
    <CalendarDays size={14} /> Ketersediaan
  </button>
);

const mobileEditButtonClass = "flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-blue-600 transition hover:bg-blue-50 dark:border-slate-700 dark:text-blue-400 dark:hover:bg-blue-900/20";
const mobileDeleteButtonClass = "flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-red-600 transition hover:bg-red-50 dark:border-slate-700 dark:text-red-400 dark:hover:bg-red-900/20";
const desktopEditButtonClass = "flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-blue-900/50 dark:hover:bg-blue-900/20 dark:hover:text-blue-400";
const desktopDeleteButtonClass = "flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-red-900/50 dark:hover:bg-red-900/20 dark:hover:text-red-400";
const mobileAvailabilityButtonClass = "flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700";
const desktopAvailabilityButtonClass = "flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700";
