import type { FC } from "react";
import type { RoomWithPeakRates } from "@/types";
import { PeakRateList } from "./PeakRateList";
import { PeakRateToggle } from "./PeakRateToggle";

export const PeakRatesSection: FC<{ isOpen: boolean; onToggle: () => void; room: RoomWithPeakRates }> = ({ isOpen, onToggle, room }) => (
  room.peakRates?.length > 0 ? (
    <div>
      <PeakRateToggle count={room.peakRates.length} isOpen={isOpen} onToggle={onToggle} />
      <PeakRateList isOpen={isOpen} peakRates={room.peakRates} />
    </div>
  ) : null
);
