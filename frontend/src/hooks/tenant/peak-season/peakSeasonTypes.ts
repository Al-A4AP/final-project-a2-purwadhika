import type { FormEvent } from "react";
import type { PeakSeasonRate, PropertyCategory, RoomWithPeakRates, TenantProperty } from "@/types";
import type { PeakRateFormData } from "@/components/tenant/peak-rates/peakRateTypes";
import type { PeakSortValue } from "./peakSeasonOptions";

export interface PeakSeasonFilters {
  categoryId: string;
  page: number;
  search: string;
  searchInput: string;
  sortOption: PeakSortValue;
}

export interface PeakSeasonPropertyData {
  properties: TenantProperty[];
  pagination: { page?: number; total?: number; totalPages?: number; pages?: number };
}

export interface PeakSeasonPageState {
  categories: PropertyCategory[];
  data: PeakSeasonPropertyData | null;
  error: string | null;
  filters: PeakSeasonFilters;
  isLoading: boolean;
  modal: PeakSeasonRateModalState;
  propertyActions: PeakSeasonPropertyActions;
  refetchProperties: () => void;
  roomActions: PeakSeasonRoomActions;
}

export interface PeakSeasonPropertyActions {
  applySearch: () => void;
  resetFilters: () => void;
  setCategoryId: (value: string) => void;
  setPage: (page: number) => void;
  setSearchInput: (value: string) => void;
  setSortOption: (value: PeakSortValue) => void;
}

export interface PeakSeasonRoomActions {
  errorByProperty: Record<string, string>;
  expandedPropertyId: string | null;
  getRooms: (propertyId: string) => RoomWithPeakRates[];
  isLoadingRooms: (propertyId: string) => boolean;
  refreshPropertyRooms: (propertyId: string) => Promise<void>;
  toggleProperty: (propertyId: string) => void;
}

export interface PeakSeasonRateModalState {
  close: () => void;
  confirmDelete: () => Promise<void>;
  editingRateId: string | null;
  isOpen: boolean;
  onCancelEdit: () => void;
  onDeleteRate: (id: string | null) => void;
  onEditRate: (rate: PeakSeasonRate) => void;
  onFormChange: (form: PeakRateFormData) => void;
  onSaveRate: (event: FormEvent) => void;
  peakForm: PeakRateFormData;
  peakRates: PeakSeasonRate[];
  pendingDeleteId: string | null;
  roomLabel: string;
  selectedRoomId: string | null;
  open: (room: RoomWithPeakRates, propertyId: string) => void;
}
