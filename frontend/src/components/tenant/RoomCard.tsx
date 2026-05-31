import type { FC } from "react";
import { useState } from "react";
import { PeakRatesSection } from "./room-card/PeakRatesSection";
import { RoomActions } from "./room-card/RoomActions";
import { RoomSummary } from "./room-card/RoomSummary";
import type { RoomCardProps } from "./room-card/types";

export const RoomCard: FC<RoomCardProps> = (props) => {
  const [showRates, setShowRates] = useState(false);
  return (
    <div className="space-y-3 rounded-xl border bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <RoomSummary room={props.room} />
        <RoomActions {...props} />
      </div>
      <PeakRatesSection room={props.room} isOpen={showRates} onToggle={() => setShowRates((value) => !value)} />
    </div>
  );
};
