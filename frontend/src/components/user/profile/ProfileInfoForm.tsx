import type { User } from '@/types';
import { ProfileInfoFields } from './ProfileInfoFields';
import { ProfileSection } from './ProfileSection';
import { ProfileSubmitButton } from './ProfileSubmitButton';
import { useProfileInfoForm } from './useProfileInfoForm';
import type { ProfileInput } from '@/validations/profile';

interface Props {
  user: User | null;
  inputClass: string;
  onSave: (data: ProfileInput) => Promise<void>;
}

export const ProfileInfoForm = ({ user, inputClass, onSave }: Props) => {
  const { form, submit } = useProfileInfoForm(user, onSave);
  return (
    <ProfileSection title="Edit Informasi">
      <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
        <ProfileInfoFields form={form} inputClass={inputClass} user={user} />
        <ProfileSubmitButton isSubmitting={form.formState.isSubmitting} loadingLabel="Menyimpan..." variant="primary">Simpan Perubahan</ProfileSubmitButton>
      </form>
    </ProfileSection>
  );
};
