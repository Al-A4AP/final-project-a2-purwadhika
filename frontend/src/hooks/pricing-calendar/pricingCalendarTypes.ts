export type PricingDateRange = {
  from?: Date;
  to?: Date;
} | undefined;

export type DatePrice = {
  price: number;
  isPeak: boolean;
};
