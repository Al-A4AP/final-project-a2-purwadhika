import type { FC } from "react";
import { RoomPeakRatesContent } from "./peak-rates/RoomPeakRatesContent";
import type { RoomPeakRatesModalProps } from "./peak-rates/peakRateTypes";

export const RoomPeakRatesModal: FC<RoomPeakRatesModalProps> = (props) => (
  <RoomPeakRatesContent {...props} />
);
