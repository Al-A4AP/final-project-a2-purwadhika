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
  onFormChange: (form: PeakRateFormData) => void;
  onAddRate: (event: FormEvent) => void;
  onDeleteRate: (id: string) => void;
  onClose: () => void;
};

export type PeakRateFormProps = Pick<
  RoomPeakRatesModalProps,
  "peakForm" | "onFormChange" | "onAddRate"
>;
