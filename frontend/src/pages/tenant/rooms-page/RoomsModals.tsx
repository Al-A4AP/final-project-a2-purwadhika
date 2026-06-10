import type { FC } from "react";
import type { DateRange } from "react-day-picker";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { RoomAvailabilityModal } from "@/components/tenant/RoomAvailabilityModal";
import { RoomPeakRatesModal } from "@/components/tenant/RoomPeakRatesModal";
import type { PeakSeasonRate } from "@/types";
import type { PeakRateFormData } from "@/components/tenant/peak-rates/peakRateTypes";

interface RoomsModalsProps {
  availabilityIsAvailable: boolean;
  availabilityRange?: DateRange;
  availabilitySaving: boolean;
  closeConfirmModal: () => void;
  confirmModal: { isOpen: boolean; message: string; onConfirm: () => void; title: string };
  confirmAvailabilityRange: () => void;
  basePrice: number;
  customerBookedDays: Date[];
  editingPeakRateId: string | null;
  isAvailModalOpen: boolean;
  isPeakModalOpen: boolean;
  isSavingPeak: boolean;
  onCancelPeakEdit: () => void;
  onDeleteRate: (id: string) => void;
  onEditRate: (rate: PeakSeasonRate) => void;
  onSavePeakRate: (event: React.FormEvent) => void;
  peakForm: PeakRateFormData;
  peakRates: PeakSeasonRate[];
  tenantBlockedDays: Date[];
  setAvailabilityIsAvailable: (value: boolean) => void;
  setAvailabilityRange: (range?: DateRange) => void;
  setIsAvailModalOpen: (value: boolean) => void;
  setIsPeakModalOpen: (value: boolean) => void;
  setPeakForm: (form: PeakRateFormData) => void;
}

export const RoomsModals: FC<RoomsModalsProps> = (props) => (
  <>
    <RoomAvailabilityModal isOpen={props.isAvailModalOpen} tenantBlockedDays={props.tenantBlockedDays} customerBookedDays={props.customerBookedDays} range={props.availabilityRange} isAvailable={props.availabilityIsAvailable} isSaving={props.availabilitySaving} onRangeChange={props.setAvailabilityRange} onAvailableChange={props.setAvailabilityIsAvailable} onConfirm={props.confirmAvailabilityRange} onClose={() => props.setIsAvailModalOpen(false)} />
    <RoomPeakRatesModal isOpen={props.isPeakModalOpen} isSaving={props.isSavingPeak} basePrice={props.basePrice} peakRates={props.peakRates} peakForm={props.peakForm} editingRateId={props.editingPeakRateId} onFormChange={props.setPeakForm} onSaveRate={props.onSavePeakRate} onEditRate={props.onEditRate} onCancelEdit={props.onCancelPeakEdit} onDeleteRate={props.onDeleteRate} onClose={() => props.setIsPeakModalOpen(false)} />
    <ConfirmModal isOpen={props.confirmModal.isOpen} title={props.confirmModal.title} message={props.confirmModal.message} onConfirm={props.confirmModal.onConfirm} onCancel={props.closeConfirmModal} />
  </>
);
