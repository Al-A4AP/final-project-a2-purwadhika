export const PAYMENT_PROOF_WINDOW_MS = 60 * 60 * 1000 * 2;

export const createPaymentDeadline = () => {
  return new Date(Date.now() + PAYMENT_PROOF_WINDOW_MS);
};
