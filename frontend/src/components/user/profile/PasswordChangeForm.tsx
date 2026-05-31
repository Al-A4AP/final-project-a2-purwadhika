import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { passwordSchema, type PasswordInput } from '@/validations/profile';
import { PasswordFields } from './password-change/PasswordFields';
import { submitPasswordChange } from './password-change/passwordSubmit';
import { ProfileSection } from './ProfileSection';
import { ProfileSubmitButton } from './ProfileSubmitButton';

interface Props {
  inputClass: string;
  onSave: (data: { old_password: string; new_password: string }) => Promise<void>;
}

export const PasswordChangeForm = ({ inputClass, onSave }: Props) => {
  const form = useForm<PasswordInput>({ resolver: zodResolver(passwordSchema) });
  const submit = (data: PasswordInput) => submitPasswordChange(data, onSave, form.reset);

  return (
    <ProfileSection title="Ubah Password" className="mt-6">
      <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
        <PasswordFields form={form} inputClass={inputClass} />
        <ProfileSubmitButton isSubmitting={form.formState.isSubmitting} loadingLabel="Memproses...">Perbarui Password</ProfileSubmitButton>
      </form>
    </ProfileSection>
  );
};
