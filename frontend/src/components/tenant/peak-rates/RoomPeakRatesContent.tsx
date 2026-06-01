import type { FC } from "react";
import { PeakRateForm } from "./PeakRateForm";
import { PeakRatesFooter } from "./PeakRatesFooter";
import { PeakRatesHeader } from "./PeakRatesHeader";
import { PeakRatesListSection } from "./PeakRatesListSection";
import type { RoomPeakRatesModalProps } from "./peakRateTypes";

export const RoomPeakRatesContent: FC<RoomPeakRatesModalProps> = (props) => {
  if (!props.isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 rounded-xl max-w-lg w-full p-6 space-y-6 shadow-xl border dark:border-slate-700">
        <PeakRatesHeader onClose={props.onClose} />
        <PeakRatesListSection editingRateId={props.editingRateId} peakRates={props.peakRates} onDeleteRate={props.onDeleteRate} onEditRate={props.onEditRate} />
        <PeakRateForm editingRateId={props.editingRateId} peakForm={props.peakForm} onFormChange={props.onFormChange} onSaveRate={props.onSaveRate} onCancelEdit={props.onCancelEdit} />
        <PeakRatesFooter onClose={props.onClose} />
      </div>
    </div>
  );
};
