export const PAYMENT_UPLOAD_DEADLINE_MS = 60 * 60 * 1000;
export const MANUAL_CONFIRMATION_DEADLINE_MS = 2 * 60 * 60 * 1000;

export const createPaymentDeadline = () => {
  return new Date(Date.now() + PAYMENT_UPLOAD_DEADLINE_MS);
};

export const getManualConfirmationCutoff = (now: Date) =>
  new Date(now.getTime() - MANUAL_CONFIRMATION_DEADLINE_MS);
