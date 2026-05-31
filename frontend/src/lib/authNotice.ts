export type AuthNotice = 'login_required' | 'wrong_role' | 'unverified' | 'session_expired';

const AUTH_NOTICE_KEY = 'purwaloka_auth_notice';

const messages: Record<AuthNotice, string> = {
  login_required: 'Silakan login terlebih dahulu untuk mengakses fitur tersebut.',
  wrong_role: 'Akun Anda tidak memiliki akses ke halaman tersebut.',
  unverified: 'Silakan verifikasi email Anda terlebih dahulu.',
  session_expired: 'Sesi Anda berakhir. Silakan login kembali.',
};

export const getAuthNoticeMessage = (notice?: AuthNotice) => (notice ? messages[notice] : undefined);

export const storeAuthNotice = (notice: AuthNotice) => {
  sessionStorage.setItem(AUTH_NOTICE_KEY, notice);
};

export const takeStoredAuthNotice = () => {
  const notice = sessionStorage.getItem(AUTH_NOTICE_KEY) as AuthNotice | null;
  sessionStorage.removeItem(AUTH_NOTICE_KEY);
  return notice;
};
