import type { Dispatch, SetStateAction } from "react";
import type { DateRange } from "react-day-picker";
import type { PeakSeasonRate, RoomFormInput, RoomWithPeakRates } from "@/types";
import type { RoomAvailability } from "@/services/availabilityService";

export type PeakRateForm = {
  start_date: string;
  end_date: string;
  rate_type: string;
  rate_value: string;
  description: string;
};

export type RoomFormState = {
  showForm: boolean;
  setShowForm: Dispatch<SetStateAction<boolean>>;
  editingRoom: RoomWithPeakRates | null;
  setEditingRoom: Dispatch<SetStateAction<RoomWithPeakRates | null>>;
  form: RoomFormInput;
  setForm: Dispatch<SetStateAction<RoomFormInput>>;
  resetRoomForm: () => void;
  handleEdit: (room: RoomWithPeakRates) => void;
};

export type RoomModalState = {
  isAvailModalOpen: boolean;
  setIsAvailModalOpen: Dispatch<SetStateAction<boolean>>;
  isPeakModalOpen: boolean;
  setIsPeakModalOpen: Dispatch<SetStateAction<boolean>>;
  selectedRoomId: string | null;
  setSelectedRoomId: Dispatch<SetStateAction<string | null>>;
};

export type AvailabilitySetter = Dispatch<SetStateAction<RoomAvailability[]>>;
export type AvailabilityRangeSetter = Dispatch<SetStateAction<DateRange | undefined>>;
export type PeakRateSetter = Dispatch<SetStateAction<PeakSeasonRate[]>>;
