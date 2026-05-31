import type { FC } from "react";
import type { PeakSeasonRate } from "@/types";
import { PeakRateItem } from "./PeakRateItem";

export const PeakRateList: FC<{ isOpen: boolean; peakRates: PeakSeasonRate[] }> = ({ isOpen, peakRates }) => (
  isOpen ? <div className="mt-2 space-y-1">{peakRates.map((rate) => <PeakRateItem key={rate.id} rate={rate} />)}</div> : null
);
