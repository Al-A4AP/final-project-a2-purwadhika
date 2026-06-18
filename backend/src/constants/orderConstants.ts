export const PAYMENT_UPLOAD_DEADLINE_MS = 60 * 60 * 1000;
export const MANUAL_CONFIRMATION_DEADLINE_MS = 2 * 60 * 60 * 1000;
export const REFUND_REQUIRED_REASON_PREFIX = 'REFUND_REQUIRED:';
export const AUTO_CANCEL_NO_REFUND_REASON_PREFIX = 'AUTO_CANCEL_NO_REFUND:';

export const MANUAL_CONFIRMATION_EXPIRED_REASON =
  `${AUTO_CANCEL_NO_REFUND_REASON_PREFIX} Batas waktu konfirmasi tenant telah berakhir`;

export const USER_CANCELLED_AFTER_PROOF_REASON =
  `${REFUND_REQUIRED_REASON_PREFIX} Dibatalkan pengguna setelah upload bukti pembayaran`;

export const buildTenantRejectionRefundReason = (reason: string) =>
  `${REFUND_REQUIRED_REASON_PREFIX} Pembayaran manual ditolak tenant: ${reason.trim()}`;

export const createPaymentDeadline = () => {
  return new Date(Date.now() + PAYMENT_UPLOAD_DEADLINE_MS);
};

export const getManualConfirmationCutoff = (now: Date) =>
  new Date(now.getTime() - MANUAL_CONFIRMATION_DEADLINE_MS);
