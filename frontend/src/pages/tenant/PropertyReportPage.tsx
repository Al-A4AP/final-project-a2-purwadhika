import type { FC } from "react";
import { PropertyReportContent } from "./property-report/PropertyReportContent";
import { usePropertyReportState } from "./property-report/usePropertyReportState";

const PropertyReportPage: FC = () => <PropertyReportContent state={usePropertyReportState()} />;

export default PropertyReportPage;
