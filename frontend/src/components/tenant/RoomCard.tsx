import type { FC } from "react";
import { useState } from "react";
import { PeakRatesSection } from "./room-card/PeakRatesSection";
import { RoomActions } from "./room-card/RoomActions";
import { RoomSummary } from "./room-card/RoomSummary";
import type { RoomCardProps } from "./room-card/types";

export const RoomCard: FC<RoomCardProps> = (props) => {
  const [showRates, setShowRates] = useState(false);
  return (
    <div className="space-y-4 rounded-2xl border border-slate-100 bg-white/90 backdrop-blur-lg p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <RoomSummary isWholeUnit={props.isWholeUnit} room={props.room} />
        <RoomActions {...props} />
      </div>
      <PeakRatesSection room={props.room} isOpen={showRates} onToggle={() => setShowRates((value) => !value)} />
    </div>
  );
};
