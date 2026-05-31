import type { FC } from "react";
import { PricingCalendarContent } from "./pricing-calendar/PricingCalendarContent";
import type { PricingCalendarSectionProps } from "./pricing-calendar/pricingCalendarTypes";

export const PricingCalendarSection: FC<PricingCalendarSectionProps> = (props) => (
  <PricingCalendarContent {...props} />
);
