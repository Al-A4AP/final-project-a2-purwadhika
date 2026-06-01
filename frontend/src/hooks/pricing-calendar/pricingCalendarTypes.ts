export type PricingDateRange = {
  from?: Date;
  to?: Date;
} | undefined;

export type DateAvailabilityStatus =
  | "AVAILABLE"
  | "CUSTOMER_BOOKED"
  | "TENANT_BLOCKED"
  | "UNAVAILABLE";

export type DatePrice = {
  price: number | null;
  isPeak: boolean;
  status: DateAvailabilityStatus;
};
