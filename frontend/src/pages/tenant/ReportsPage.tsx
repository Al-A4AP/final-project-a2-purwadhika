import type { FC } from "react";
import { ReportsContent } from "./reports/ReportsContent";
import { useReportsPageState } from "./reports/useReportsPageState";

const ReportsPage: FC = () => <ReportsContent state={useReportsPageState()} />;

export default ReportsPage;
