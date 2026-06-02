import type { FC } from "react";
import { OccupancyContent } from "./occupancy/OccupancyContent";
import { useOccupancyPageState } from "./occupancy/useOccupancyPageState";

const OccupancyPage: FC = () => <OccupancyContent state={useOccupancyPageState()} />;

export default OccupancyPage;
