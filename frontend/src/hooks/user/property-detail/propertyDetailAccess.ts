export const getBookingBlockedReason = (isAuthenticated: boolean, verifiedAt?: string | null) => {
  if (!isAuthenticated) return "Login dan verifikasi email diperlukan sebelum membuat pesanan.";
  if (!verifiedAt) return "Silakan verifikasi email Anda sebelum membuat pesanan.";
  return undefined;
};

export const getBlockedReasonLabel = (reason?: string, fallback: string = 'Pesan') => {
  if (!reason) return fallback;
  const lower = reason.toLowerCase();
  if (lower.includes('login')) return 'Login Diperlukan';
  if (lower.includes('verifikasi')) return 'Verifikasi Email';
  if (lower.includes('tanggal')) return 'Pilih Tanggal';
  if (lower.includes('kamar')) return 'Pilih Kamar';
  if (lower.includes('tersedia') || lower.includes('dipesan')) return 'Tanggal Tidak Tersedia';
  return reason;
};
