import { MailCheck } from 'lucide-react';
import type { User } from '@/types';
import { CurrentEmailBox } from './CurrentEmailBox';
import { EmailChangeFields } from './EmailChangeFields';
import { ProfileSection } from './ProfileSection';
import { ProfileSubmitButton } from './ProfileSubmitButton';
import { useEmailChangeForm } from './useEmailChangeForm';

interface Props {
  user: User | null;
  inputClass: string;
  onRequest: (email: string) => Promise<void>;
}

export const EmailChangeForm = ({ user, inputClass, onRequest }: Props) => {
  const { form, submit } = useEmailChangeForm(onRequest);
  return (
    <ProfileSection title="Ubah Email" className="mt-6">
      <CurrentEmailBox user={user} />
      <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
        <EmailChangeFields form={form} inputClass={inputClass} />
        <ProfileSubmitButton isSubmitting={form.formState.isSubmitting} loadingLabel="Mengirim..."><MailCheck size={18} /> Kirim Verifikasi Email Baru</ProfileSubmitButton>
      </form>
    </ProfileSection>
  );
};
