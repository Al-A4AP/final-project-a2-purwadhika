import type { FC } from "react";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { RoomAvailabilityModal } from "@/components/tenant/RoomAvailabilityModal";
import { RoomPeakRatesModal } from "@/components/tenant/RoomPeakRatesModal";
import type { PeakSeasonRate } from "@/types";
import type { PeakRateFormData } from "@/components/tenant/peak-rates/peakRateTypes";

interface RoomsModalsProps {
  blockedDays: Date[];
  closeConfirmModal: () => void;
  confirmModal: { isOpen: boolean; message: string; onConfirm: () => void; title: string };
  handleAddPeakRate: (event: React.FormEvent) => void;
  handleDayClick: (date: Date) => void;
  isAvailModalOpen: boolean;
  isPeakModalOpen: boolean;
  onDeleteRate: (id: string) => void;
  peakForm: PeakRateFormData;
  peakRates: PeakSeasonRate[];
  setIsAvailModalOpen: (value: boolean) => void;
  setIsPeakModalOpen: (value: boolean) => void;
  setPeakForm: (form: PeakRateFormData) => void;
}

export const RoomsModals: FC<RoomsModalsProps> = (props) => (
  <>
    <RoomAvailabilityModal isOpen={props.isAvailModalOpen} blockedDays={props.blockedDays} onDayClick={props.handleDayClick} onClose={() => props.setIsAvailModalOpen(false)} />
    <RoomPeakRatesModal isOpen={props.isPeakModalOpen} peakRates={props.peakRates} peakForm={props.peakForm} onFormChange={props.setPeakForm} onAddRate={props.handleAddPeakRate} onDeleteRate={props.onDeleteRate} onClose={() => props.setIsPeakModalOpen(false)} />
    <ConfirmModal isOpen={props.confirmModal.isOpen} title={props.confirmModal.title} message={props.confirmModal.message} onConfirm={props.confirmModal.onConfirm} onCancel={props.closeConfirmModal} />
  </>
);
