export const getBookingBlockedReason = (isAuthenticated: boolean, verifiedAt?: string | null) => {
  if (!isAuthenticated) return "Login dan verifikasi email diperlukan sebelum membuat pesanan.";
  if (!verifiedAt) return "Silakan verifikasi email Anda sebelum membuat pesanan.";
  return undefined;
};
