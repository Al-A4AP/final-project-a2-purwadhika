import { ProfileSection } from './ProfileSection';

export const PasswordUnavailableCard = () => (
  <ProfileSection title="Ubah Password" className="mt-6">
    <p className="text-sm text-gray-600 dark:text-gray-400">
      Akun ini tidak menggunakan password aplikasi. Silakan masuk dengan metode login yang terhubung.
    </p>
  </ProfileSection>
);
