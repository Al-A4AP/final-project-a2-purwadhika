import type { FC } from "react";
import { OccupancyContent } from "./occupancy/OccupancyContent";
import { useOccupancyPageState } from "../../hooks/tenant/occupancy/useOccupancyPageState";

const OccupancyPage: FC = () => <OccupancyContent state={useOccupancyPageState()} />;

export default OccupancyPage;
