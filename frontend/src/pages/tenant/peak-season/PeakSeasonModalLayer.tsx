import type { FC } from "react";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { RoomPeakRatesModal } from "@/components/tenant/RoomPeakRatesModal";
import type { PeakSeasonPageState } from "./peakSeasonTypes";

export const PeakSeasonModalLayer: FC<{ state: PeakSeasonPageState }> = ({ state }) => (
  <>
    <PeakRateModal state={state} />
    <DeleteRateConfirm state={state} />
  </>
);

const PeakRateModal: FC<{ state: PeakSeasonPageState }> = ({ state }) => (
  <RoomPeakRatesModal
    isOpen={state.modal.isOpen}
    peakRates={state.modal.peakRates}
    peakForm={state.modal.peakForm}
    editingRateId={state.modal.editingRateId}
    onFormChange={state.modal.onFormChange}
    onSaveRate={state.modal.onSaveRate}
    onEditRate={state.modal.onEditRate}
    onCancelEdit={state.modal.onCancelEdit}
    onDeleteRate={state.modal.onDeleteRate}
    onClose={state.modal.close}
  />
);

const DeleteRateConfirm: FC<{ state: PeakSeasonPageState }> = ({ state }) => (
  <ConfirmModal
    isOpen={Boolean(state.modal.pendingDeleteId)}
    title="Hapus Harga Musiman"
    message="Hapus aturan harga musiman ini? Tanggal tersebut akan kembali memakai harga normal kamar."
    confirmText="Ya, Hapus"
    onConfirm={state.modal.confirmDelete}
    onCancel={() => state.modal.onDeleteRate(null)}
  />
);
