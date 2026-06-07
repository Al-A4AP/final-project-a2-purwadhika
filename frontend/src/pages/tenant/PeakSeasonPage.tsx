import type { FC } from "react";
import { usePeakSeasonPageState } from "@/hooks/tenant/peak-season/usePeakSeasonPageState";
import { PeakSeasonContent } from "./peak-season/PeakSeasonContent";
import { PeakSeasonModalLayer } from "./peak-season/PeakSeasonModalLayer";

const PeakSeasonPage: FC = () => {
  const state = usePeakSeasonPageState();
  return (
    <>
      <PeakSeasonContent state={state} />
      <PeakSeasonModalLayer state={state} />
    </>
  );
};

export default PeakSeasonPage;
