import type { FC } from "react";
import { PeakSeasonContent } from "./peak-season/PeakSeasonContent";
import { PeakSeasonModalLayer } from "./peak-season/PeakSeasonModalLayer";
import { usePeakSeasonPageState } from "./peak-season/usePeakSeasonPageState";

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
