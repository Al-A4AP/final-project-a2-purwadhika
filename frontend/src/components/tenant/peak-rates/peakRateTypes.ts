import type { FormEvent } from "react";
import type { PeakSeasonRate } from "@/types";

export type PeakRateFormData = {
  start_date: string;
  end_date: string;
  rate_type: string;
  rate_value: string;
  description: string;
};

export type RoomPeakRatesModalProps = {
  isOpen: boolean;
  peakRates: PeakSeasonRate[];
  peakForm: PeakRateFormData;
  editingRateId: string | null;
  onFormChange: (form: PeakRateFormData) => void;
  onSaveRate: (event: FormEvent) => void;
  onEditRate: (rate: PeakSeasonRate) => void;
  onCancelEdit: () => void;
  onDeleteRate: (id: string) => void;
  onClose: () => void;
};

export type PeakRateFormProps = Pick<
  RoomPeakRatesModalProps,
  "editingRateId" | "peakForm" | "onCancelEdit" | "onFormChange" | "onSaveRate"
>;
