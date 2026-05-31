import type { ChangeEvent, FC } from 'react';
import { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { ProfileAvatarCard } from '@/components/user/profile/ProfileAvatarCard';
import { EmailChangeForm } from '@/components/user/profile/EmailChangeForm';
import { PasswordChangeForm } from '@/components/user/profile/PasswordChangeForm';
import { PasswordUnavailableCard } from '@/components/user/profile/PasswordUnavailableCard';
import { ProfileInfoForm } from '@/components/user/profile/ProfileInfoForm';
import { userService } from '@/services/userService';
import { useAuthStore } from '@/stores/authStore';

const inputClass = 'w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 outline-none';
const allowedAvatarTypes = ['image/jpeg', 'image/png', 'image/gif'];
const maxAvatarSize = 1024 * 1024;

const getApiMessage = (err: unknown, fallback: string) => {
  const error = err as { response?: { data?: { message?: string } } };
  return error.response?.data?.message || fallback;
};

const isValidAvatar = (file: File) =>
  allowedAvatarTypes.includes(file.type) && file.size <= maxAvatarSize;

const canChangePassword = (user: ReturnType<typeof useAuthStore.getState>['user']) =>
  user?.auth_provider !== 'GOOGLE' && !!user?.password_set_at;

const ProfilePage: FC = () => {
  const { user, setUser } = useAuthStore();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const saveProfile = async (data: { name?: string; phone?: string }) => {
    try {
      const updated = await userService.updateProfile(data);
      setUser(updated);
      toast.success('Profil berhasil disimpan!');
    } catch (err: unknown) {
      toast.error(getApiMessage(err, 'Gagal menyimpan perubahan'));
    }
  };

  const requestEmailChange = async (email: string) => {
    try {
      const updated = await userService.requestEmailChange(email);
      setUser(updated);
      toast.success('Link verifikasi dikirim ke email baru.');
    } catch (err: unknown) {
      toast.error(getApiMessage(err, 'Gagal mengirim verifikasi email'));
    }
  };

  const savePassword = async (data: { old_password: string; new_password: string }) => {
    try {
      await userService.changePassword(data);
      toast.success('Password berhasil diubah!');
    } catch (err: unknown) {
      toast.error(getApiMessage(err, 'Gagal mengubah password'));
    }
  };

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!isValidAvatar(file)) {
      toast.error('Avatar harus JPG, PNG, atau GIF dengan ukuran maksimal 1MB.');
      return;
    }
    setUploadingAvatar(true);
    try {
      const updated = await userService.updateAvatar(file);
      setUser(updated);
      toast.success('Foto profil berhasil diperbarui');
    } catch {
      toast.error('Gagal upload avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Profil Saya</h1>
        <ProfileAvatarCard
          user={user}
          fileRef={fileRef}
          uploading={uploadingAvatar}
          onAvatarChange={handleAvatarChange}
        />
        <ProfileInfoForm user={user} inputClass={inputClass} onSave={saveProfile} />
        <EmailChangeForm user={user} inputClass={inputClass} onRequest={requestEmailChange} />
        {canChangePassword(user) ? (
          <PasswordChangeForm inputClass={inputClass} onSave={savePassword} />
        ) : (
          <PasswordUnavailableCard />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
